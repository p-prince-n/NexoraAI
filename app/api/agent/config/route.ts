import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { agentConfigSystemPrompt } from "@/data/prompt";
import { agentConfigResponseSchema } from "@/data/responseSchema";
import { agentConfig, agentRun, db, tools } from "@/db";
import crypto from "crypto";
import { currentUser } from "@clerk/nextjs/server";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { config } from "../../../../proxy";
import { calculateNextDailyRun } from "@/lib/agentShedule";
import { syncScheduledAgentRuns } from "@/lib/syncScheduledAgentRuns";

export async function POST(req: NextRequest) {
  const { prompt, timezone } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is required for the AI use" },
      { status: 400 },
    );
  }

  try {
    const aiTools = await db
      .select({
        slug: tools.slug,
      })
      .from(tools);

    const availableTools = aiTools.map((tool) => tool.slug).join("\n- ");

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = agentConfigSystemPrompt
      .replace("{AVAILABLE_TOOLS}", availableTools)
      .replace("{USER_PROMPT}", prompt);

    const generate = () =>
      ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: systemPrompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MEDIUM,
          },
          responseMimeType: "application/json",
          responseSchema: agentConfigResponseSchema,
        },
      });

    let res;

    try {
      res = await generate();
    } catch (error: any) {
      const status = error?.status ?? error?.code;

      if (status === 429) {
        console.error("Gemini API quota exceeded:", error);

        return NextResponse.json(
          {
            error:
              "Gemini API quota exceeded. Please try again later or check your Gemini API billing and quota.",
          },
          { status: 429 },
        );
      }

      if (status === 503) {
        console.log("Gemini 503. Retrying in 2 seconds...");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
          res = await generate();
        } catch (retryError: any) {
          const retryStatus = retryError?.status ?? retryError?.code;

          if (retryStatus === 429) {
            return NextResponse.json(
              {
                error:
                  "Gemini API quota exceeded. Please try again later or check your Gemini API billing and quota.",
              },
              { status: 429 },
            );
          }

          if (retryStatus === 503) {
            return NextResponse.json(
              {
                error:
                  "Gemini service is temporarily unavailable. Please try again.",
              },
              { status: 503 },
            );
          }

          throw retryError;
        }
      } else {
        throw error;
      }
    }

    const aiOutput = JSON.parse(res.text ?? "{}");

    if (aiOutput.status === "ready") {
      const user = await currentUser();

      const agentId = crypto.randomUUID();

      const dbResult = await db
        .insert(agentConfig)
        .values({
          ...aiOutput.config,

          agentImage: `https://api.dicebear.com/10.x/gaze/svg?tags=animation&seed=${agentId}`,

          agentId,

          userEmail: user?.primaryEmailAddress?.emailAddress,
          schedule: {
            time: aiOutput?.config?.schedule?.time,
            type: aiOutput?.config?.schedule?.type,
            frequency: aiOutput?.config?.schedule?.frequency,
            timezone,
          },
        })
        .returning();

      const schedule = aiOutput?.config?.schedule;

      const firstRun =
        (schedule?.type === "recurring" ||  schedule?.type === "once") && schedule.frequency === "daily"
          ? calculateNextDailyRun({ time: schedule?.time, timezone })
          : null;

      if (firstRun) {
        const runInsert = await db
          .insert(agentRun)
          .values({
            agentid: agentId,
            userEmail: user?.primaryEmailAddress?.emailAddress ?? "",
            scheduledFor: firstRun ?? "",
            timezone: timezone,
            status: "scheduled",
          })
          .returning();
      }

      return NextResponse.json(
        { ...dbResult[0], status_temp: "ready" },
        {
          status: 201,
        },
      );
    }

    return NextResponse.json(aiOutput, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in Agent/Config/Post Route:", error);

    const status = error?.status ?? error?.code;

    if (status === 429) {
      return NextResponse.json(
        {
          error:
            "Gemini API quota exceeded. Please try again later or check your API billing and quota.",
        },
        { status: 429 },
      );
    }

    if (status === 503) {
      return NextResponse.json(
        {
          error: "Gemini service is temporarily unavailable. Please try again.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: error?.message ?? "Failed to generate agent configuration",
      },
      { status: 500 },
    );
  }
}


export async function PUT(req: NextRequest) {
  try {
    const { updatedData } = await req.json();

    // ----------------------------------------
    // 1. Validate request
    // ----------------------------------------

    if (!updatedData) {
      return NextResponse.json(
        { error: "Need updated data" },
        { status: 400 },
      );
    }

    if (!updatedData.id) {
      return NextResponse.json(
        { error: "ID is required to update agent data" },
        { status: 400 },
      );
    }
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }
    const agentStatus = updatedData.status;

    if (agentStatus !== "active" && agentStatus !== "pause") {
      return NextResponse.json(
        {
          error: 'Agent status must be either "active" or "pause"',
        },
        { status: 400 },
      );
    }
    const agentData = await db
      .select()
      .from(agentConfig)
      .where(
        and(
          eq(agentConfig.id, updatedData.id),
          eq(agentConfig.userEmail, userEmail),
        ),
      )
      .limit(1);

    if (agentData.length === 0) {
      return NextResponse.json(
        {
          error: `Agent not found for id ${updatedData.id}`,
        },
        { status: 404 },
      );
    }

    const existingAgent = agentData[0];

    // ----------------------------------------
    // 5. Existing / new schedule
    // ----------------------------------------

    const oldSchedule = existingAgent.schedule as {
      time?: string;
      type?: string;
      frequency?: string;
      timezone?: string;
    } | null;

    const newSchedule = updatedData.schedule as {
      time?: string;
      type?: string;
      frequency?: string;
      timezone?: string;
    } | null;

    // ----------------------------------------
    // 6. Check whether schedule changed
    // ----------------------------------------

    const scheduleChanged =
      oldSchedule?.time !== newSchedule?.time ||
      oldSchedule?.type !== newSchedule?.type ||
      oldSchedule?.frequency !== newSchedule?.frequency ||
      oldSchedule?.timezone !== newSchedule?.timezone;

    // ----------------------------------------
    // 7. Check whether status changed
    // ----------------------------------------

    const statusChanged = existingAgent.status !== agentStatus;

    // ----------------------------------------
    // 8. Update agent config
    // ----------------------------------------

    const updateData = {
      agentId: updatedData.agentId ?? existingAgent.agentId,
      name: updatedData.name,
      agentImage: updatedData.agentImage,
      description: updatedData.description,
      instructions: updatedData.instructions,
      objective: updatedData.objective,
      tools: updatedData.tools,
      skills: updatedData.skills,
      schedule: updatedData.schedule,
      outputFormate: updatedData.outputFormate,
      status: agentStatus,
      updatedAt: new Date(),
    };

    const result = await db
      .update(agentConfig)
      .set(updateData)
      .where(
        and(
          eq(agentConfig.id, updatedData.id),
          eq(agentConfig.userEmail, userEmail),
        ),
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to update agent data",
        },
        { status: 400 },
      );
    }

    // IMPORTANT:
    // agentRun.agentid references agentConfig.agentId
    //
    // We should use the NEW agentId if it changed.
    const agentRunId = updateData.agentId;

    // ----------------------------------------
    // 9. Determine whether schedule is recurring
    // ----------------------------------------

    const isRecurringDaily =
      newSchedule?.type === "recurring" &&
      newSchedule?.frequency === "daily" &&
      !!newSchedule?.time;

    // ----------------------------------------
    // 10. PAUSE AGENT
    // ----------------------------------------
    //
    // When agent is paused:
    // - Keep agentConfig
    // - Cancel scheduled runs
    // - Do NOT delete the agent
    //

    if (agentStatus === "pause") {
      const cancelledRuns = await db
        .update(agentRun)
        .set({
          status: "cancelled",
        })
        .where(
          and(
            eq(agentRun.agentid, existingAgent.agentId),
            eq(agentRun.status, "scheduled"),
          ),
        )
        .returning({
          id: agentRun.id,
        });

      console.log(
        `Agent ${existingAgent.agentId} paused. Cancelled ${cancelledRuns.length} scheduled run(s).`,
      );

      return NextResponse.json(
        {
          success: true,
          message: "Agent paused successfully",
          agent: result[0],
          scheduledRunsCancelled: cancelledRuns.length,
        },
        { status: 200 },
      );
    }

    // ----------------------------------------
    // 11. ACTIVE AGENT
    // ----------------------------------------
    //
    // If agent is active:
    // - recurring daily => create/update scheduled run
    // - manual/non-recurring => cancel scheduled runs
    //

    if (agentStatus === "active") {
      // ----------------------------------------
      // 11A. Active + recurring daily schedule
      // ----------------------------------------

      if (isRecurringDaily) {
        const timezone =
          newSchedule?.timezone ||
          oldSchedule?.timezone ||
          "Asia/Kolkata";

        const nextRun = calculateNextDailyRun({
          time: newSchedule!.time!,
          timezone,
          after: new Date(),
        });

        // Find currently scheduled run
        const scheduledRuns = await db
          .select({
            id: agentRun.id,
            scheduledFor: agentRun.scheduledFor,
          })
          .from(agentRun)
          .where(
            and(
              eq(agentRun.agentid, existingAgent.agentId),
              eq(agentRun.status, "cancelled"),
            ),
          )
          .orderBy(agentRun.scheduledFor)
          .limit(1);

        // ----------------------------------------
        // Existing scheduled run
        // ----------------------------------------

        if (scheduledRuns.length > 0) {
          await db
            .update(agentRun)
            .set({
              scheduledFor: nextRun,
              timezone,
              userEmail,
              status:"scheduled"
            })
            .where(eq(agentRun.id, scheduledRuns[0].id));

          console.log(
            `Updated scheduled run ${scheduledRuns[0].id} -> ${nextRun.toISOString()}`,
          );
        }

        // ----------------------------------------
        // No scheduled run
        // ----------------------------------------

        else {
          await db
            .insert(agentRun)
            .values({
              agentid: existingAgent.agentId,
              userEmail,
              scheduledFor: nextRun,
              timezone,
              status: "scheduled",
            }).onConflictDoNothing();

          console.log(
            `Created scheduled run for ${existingAgent.agentId} -> ${nextRun.toISOString()}`,
          );
        }
      }

      // ----------------------------------------
      // 11B. Active + manual/non-recurring
      // ----------------------------------------
      //
      // If schedule is:
      // - manual
      // - missing
      // - non-recurring
      // - invalid
      //
      // there should be no scheduled run.
      //

      else {
        const cancelledRuns = await db
          .update(agentRun)
          .set({
            status: "cancelled",
          })
          .where(
            and(
              eq(agentRun.agentid, existingAgent.agentId),
              eq(agentRun.status, "scheduled"),
            ),
          )
          .returning({
            id: agentRun.id,
          });

        if (cancelledRuns.length > 0) {
          console.log(
            `Cancelled ${cancelledRuns.length} scheduled run(s) because agent is not recurring.`,
          );
        }
      }
    }

    // ----------------------------------------
    // 12. Return response
    // ----------------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          agentStatus === "pause"
            ? "Agent paused successfully"
            : "Agent updated successfully",
        agent: result[0],
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in Agent Config PUT Route:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ?? "Failed to update agent configuration",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please login first.",
        },
        { status: 401 },
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const { searchParams } = new URL(req.url);

    const pageParam = Number(searchParams.get("page")) || 1;
    const limitParam = Number(searchParams.get("limit")) || 10;

    const page = Math.max(1, pageParam);
    const limit = Math.min(Math.max(1, limitParam), 100);

    const offset = (page - 1) * limit;

    const totalResult = await db
      .select({
        count: count(),
      })
      .from(agentConfig)
      .where(eq(agentConfig.userEmail, userEmail));

    const total = Number(totalResult[0]?.count ?? 0);

    const agents = await db
      .select()
      .from(agentConfig)
      .where(eq(agentConfig.userEmail, userEmail))
      .orderBy(desc(agentConfig.createdAt))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,

        data: agents,

        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/agent/config error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch agents.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { agentId } = await req.json();
    console.log({agentId});
    

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 },
      );
    }

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 401 },
      );
    }

    // Verify that the agent belongs to the current user
    const existingAgent = await db
      .select()
      .from(agentConfig)
      .where(
        and(eq(agentConfig.id, agentId), eq(agentConfig.userEmail, userEmail)),
      )
      .limit(1);

    if (existingAgent.length === 0) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const agent = existingAgent[0];


    await db
      .delete(agentRun)
      .where(
        and(
          eq(agentRun.agentid, agent.agentId),
          eq(agentRun.userEmail, userEmail)
        ),
      );

    const deletedAgent = await db
      .delete(agentConfig)
      .where(
        and(eq(agentConfig.id, agent.id), eq(agentConfig.userEmail, userEmail)),
      )
      .returning({
        id: agentConfig.id,
        name: agentConfig.name,
      });

    if (deletedAgent.length === 0) {
      return NextResponse.json(
        { error: "Failed to delete agent" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Agent deleted successfully",
        data: deletedAgent[0].name,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/agent/config error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete agent",
      },
      { status: 500 },
    );
  }
}
