import { agentConfig, agentRun, db } from "@/db";
import { inngest } from "@/inngest/client";
import { executeAgent } from "@/lib/executeAgent";
import { currentUser } from "@clerk/nextjs/server";
import { and, between, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "User email not found",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const { agentConfigData, agentId } = body;

    if (!agentConfigData && !agentId) {
      return NextResponse.json(
        {
          success: false,
          error: "agentId or agentConfigData is required",
        },
        { status: 400 }
      );
    }

    let AgentData:any;

    /*
     * Always load the agent from DB using the authenticated user.
     *
     * Do not blindly trust agentConfigData sent from the client.
     */
    const requestedAgentId =
      agentId || agentConfigData?.agentId;

    if (!requestedAgentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent ID is required",
        },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(agentConfig)
      .where(
        and(
          eq(agentConfig.agentId, requestedAgentId),
          eq(agentConfig.userEmail, userEmail)
        )
      )
      .limit(1);

    AgentData = result[0];

    if (!AgentData) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent not found",
        },
        { status: 404 }
      );
    }

    /*
     * Do not allow another execution of the same agent
     * while one is queued/running.
     */
    const isAgentRunning = await db
      .select({
        id: agentRun.id,
        status: agentRun.status,
      })
      .from(agentRun)
      .where(
        and(
          eq(agentRun.agentid, AgentData.agentId),
          eq(agentRun.userEmail, userEmail),
          inArray(agentRun.status, ["queued", "running"])
        )
      )
      .limit(1);

    if (isAgentRunning.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Agent is already running. Please wait for it to complete.",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    const timezone =
      AgentData.schedule?.timezone ||
      "UTC";

    /*
     * Create the run first.
     */
    const insertAgentRun = await db
      .insert(agentRun)
      .values({
        agentid: AgentData.agentId,
        userEmail,
        scheduledFor: now,
        timezone,
        status: "queued",
        queuedAt: now,
      })
      .returning();

    const run = insertAgentRun[0];

    if (!run) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create agent run",
        },
        { status: 500 }
      );
    }

    /*
     * Send execution event to Inngest.
     */
    try {
      await inngest.send({
        name: "agent/run.execute",
        data: {
          runId: run.id,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: `${AgentData.name} Agent execution queued`,
          runId: run.id,
          status: "queued",
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send agent execution event";

      await db
        .update(agentRun)
        .set({
          status: "failed",
          error: message,
          completedAt: new Date(),
        })
        .where(eq(agentRun.id, run.id));

      console.error(
        "Failed to send agent execution event:",
        message
      );

      return NextResponse.json(
        {
          success: false,
          message: "Failed to queue agent execution",
          error: message,
          runId: run.id,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to execute agent";

    console.error("Manual agent run error:", message);

    return NextResponse.json(
      {
        success: false,
        message,
        error: message,
      },
      { status: 500 }
    );
  }
}