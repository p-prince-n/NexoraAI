// src/inngest/functions.ts
import { agentConfig, agentRun, db, dashboardBrief } from "@/db";
import { inngest } from "./client";
import { and, asc, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { CreateAgentType } from "@/lib/types";
import { executeAgent } from "@/lib/executeAgent";
import { tools } from "../db/schema";
import { calculateNextDailyRun } from "@/lib/agentShedule";

import { getOrCreateSessionAgent } from "@/lib/getAgentComposioSession";
import { syncScheduledAgentRuns } from "@/lib/syncScheduledAgentRuns";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_GOOGLE_GEMINI_API_KEY!,
});

/*
export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      return { processed: true, id: event.data.id };
    });

    await step.sleep("pause", "1s");

    return { message: `Task ${JSON.stringify(event?.data)} complete`, result };
  }
);
*/

export const ProcessScheduledAgent = inngest.createFunction(
  {
    id: "process-scheduled-agent-runs",
    triggers: [{ cron: "*/5 * * * *" }],
  },

  async ({ step }) => {
    const now = new Date();

    // 1. Sync scheduled runs
    await step.run(
      "sync-scheduled-agent-runs",
      async () => {
        await syncScheduledAgentRuns();
      }
    );

    // 2. Find runs that are due
    const dueRuns = await step.run(
      "load-due-agent-runs",
      async () => {
        return await db
          .select({
            run: agentRun,
          })
          .from(agentRun)
          .where(
            and(
              eq(agentRun.status, "scheduled"),
              lte(agentRun.scheduledFor, now)
            )
          )
          .orderBy(asc(agentRun.scheduledFor))
          .limit(100);
      }
    );

    const results = [];

    // 3. Queue due runs
    for (const { run } of dueRuns) {
      const queueRun = await step.run(
        `queue-agent-run-${run.id}`,
        async () => {
          const result = await db
            .update(agentRun)
            .set({
              status: "queued",
              queuedAt: now,
            })
            .where(
              and(
                eq(agentRun.id, run.id),
                eq(agentRun.status, "scheduled")
              )
            )
            .returning();

          return result[0] ?? null;
        }
      );

      // Already picked by another scheduler
      if (!queueRun) {
        results.push({
          runId: run.id,
          agentId: run.agentid,
          status: "skipped",
        });

        continue;
      }

      // 4. Trigger actual execution
      await step.sendEvent(
        `send-execute-agent-event-${run.id}`,
        {
          name: "agent/run.execute",
          data: {
            runId: run.id,
          },
        }
      );

      results.push({
        runId: run.id,
        agentId: run.agentid,
        status: "queued",
      });
    }

    return {
      queued: results.filter(
        (result) => result.status === "queued"
      ),
      results,
    };
  }
);
export const ExecuteScheduledAgent = inngest.createFunction(
  {
    id: "execute-scheduled-agent-runs",
    triggers: [{ event: "agent/run.execute" }],
  },
  async ({ event, step }) => {
    const runId = event?.data?.runId as string | undefined;
    if (!runId) {
      throw new Error("Missing runId for scheduled agent execution");
    }

    const runData = await step.run(`load-agent-run-${runId}`, async () => {
      const result = await db
        .select({ run: agentRun, agentConfigData: agentConfig })
        .from(agentRun)
        .innerJoin(agentConfig, eq(agentRun.agentid, agentConfig.agentId))
        .where(eq(agentRun.id, runId))
        .limit(1);
      return result[0] ?? null;
    });
    if (!runData) {
      throw new Error(`Agent run ${runId} was not found`);
    }
    const { run, agentConfigData } = runData;
    try {
      await step.sleepUntil(
        `wait-for-scheduled-time-${run.id}`,
        run.scheduledFor,
      );
      const startedRun = await step.run(
        `mark-run-started-${run.id}`,
        async () => {
          const result = await db
            .update(agentRun)
            .set({ status: "running", startedAt: new Date() })
            .where(and(eq(agentRun.id, run.id), eq(agentRun.status, "queued")))
            .returning();
          return result[0] ?? null;
        },
      );
      if (startedRun) {
        await step.run(`emit-running-status-${run.id}`, async () => {
          await inngest.send({
            name: "agent/status.changed",
            data: {
              runId: run.id,
              agentId: run.agentid,
              userEmail: run.userEmail,
              status: "running",
            },
          });
        });
      }
      if (!startedRun) {
        return { runId: run.id, agentId: run.agentid, status: run.status };
      }

      const tool: any = await step.run(
        `fetching-tools-data-${run.agentid}`,
        async () => {
          const allowedTools: string[] = Array.isArray(agentConfigData.tools)
            ? (agentConfigData.tools as string[])
            : [];

          if (allowedTools.length === 0) {
            console.log("NO TOOLS CONFIGURED");
            return [];
          }

          const dbTools = await db
            .select({
              name: tools.name,
              slug: tools.slug,
              type: tools.type,
            })
            .from(tools)
            .where(inArray(tools.slug, allowedTools));

          const session = await getOrCreateSessionAgent(
            agentConfigData as CreateAgentType,
            run.userEmail,
          );

          if (!session) {
            throw new Error("Composio session could not be created");
          }

          console.log("Composio session created");

          const toolkitResult = await session.toolkits();

          console.log(
            "Composio toolkits:",
            toolkitResult?.items?.map((item: any) => ({
              slug: item.slug,
              name: item.name,
              connected: item.connection?.isActive,
              accountId: item.connection?.connectedAccount?.id,
            })),
          );

          const result = dbTools.map((dbTool: any) => {
            const toolkit = toolkitResult?.items?.find(
              (item: any) =>
                item.slug?.toLowerCase() === dbTool.slug?.toLowerCase(),
            );

            return {
              slug: dbTool.slug,
              name: dbTool.name,
              type: dbTool.type,
              logo: toolkit?.logo ?? "",
              connected: toolkit?.connection?.isActive ?? false,
              connectedAccountId:
                toolkit?.connection?.connectedAccount?.id ?? null,
            };
          });

          return result;
        },
      );
      const output = await step.run(`execute-agent-${run.id}`, async () => {
        const scheduledExecutionInstruction = `
            This is a single execution of a task triggered by Nexora AI's scheduler.
            Execute only the underlying task described in the objective for this occurrence.
            Rules:
              * Do NOT create, modify, schedule, reschedule, repeat, or automate any task.
              * Do NOT ask the user how or when to schedule anything.
              * Ignore scheduling, recurrence, frequency, and time-related instructions as scheduling commands.
              * Treat words such as "daily", "weekly", "recurring", "schedule", or specific times only as context for the current task.
              * Perform the task once and return the result.
              * Do not initiate another execution after completing this task.
            `.trim();
        const executableAgentConfig: CreateAgentType = {
          id: agentConfigData.id,
          userEmail: agentConfigData.userEmail,
          agentId: agentConfigData.agentId,
          name: agentConfigData.name,
          agentImage: agentConfigData.agentImage,
          description: agentConfigData.description,
          instructions: [
            agentConfigData.instructions ?? "",
            scheduledExecutionInstruction,
          ]
            .filter(Boolean)
            .join("\n\n"),
          objective: agentConfigData.objective,
          tools: Array.isArray(agentConfigData.tools)
            ? (agentConfigData.tools as string[])
            : [],
          skills: Array.isArray(agentConfigData.skills)
            ? (agentConfigData.skills as string[])
            : [],
          schedule: (agentConfigData.schedule ?? {
            type: "manual",
          }) as CreateAgentType["schedule"],
          outputFormate: agentConfigData.outputFormate,
          status: agentConfigData.status ?? "active",
          createdAt: new Date(agentConfigData.createdAt ?? ""),
          updatedAt: new Date(agentConfigData.updatedAt ?? ""),
          composioSessionId: agentConfigData.composioSessionId ?? null,
        };
        return await executeAgent({
          agentConfig: executableAgentConfig,
          userEmail: run.userEmail,
          input: [
            scheduledExecutionInstruction,
            "",
            "Task to excute now: ",
            executableAgentConfig.objective,
          ].join("\n"),
          availableTools: tool,
        });
      });
      if (!output.success) {
        await db
          .update(agentRun)
          .set({
            status: "failed",
            output: null,
            // @ts-ignore
            error: output.error || "Agent execution failed",
            completedAt: new Date(),
          })
          .where(eq(agentRun.id, run.id));

        await step.run(`emit-failed-status-${run.id}`, async () => {
          await inngest.send({
            name: "agent/status.changed",
            data: {
              runId: run.id,
              agentId: run.agentid,
              userEmail: run.userEmail,
              status: "failed",
            },
          });
        });

        return {
          runId: run.id,
          agentId: run.agentid,
          status: "failed",
        };
      }
      await step.run(`mark-run-completed-${run.id}`, async () => {
        await db
          .update(agentRun)
          .set({ status: "completed", output, completedAt: new Date() })
          .where(eq(agentRun.id, run.id));
      });
      await step.run(`emit-completed-status-${run.id}`, async () => {
        await inngest.send({
          name: "agent/status.changed",
          data: {
            runId: run.id,
            agentId: run.agentid,
            userEmail: run.userEmail,
            status: "completed",
          },
        });
      });
     const schedule = agentConfigData.schedule as {
  type?: string;
  frequency?: string;
  time?: string;
  timezone?: string;
} | null;


if (schedule?.time && (schedule?.type === "recurring" )) {
  const nextRun = await step.run(
    `create-next-daily-run-${run.id}`,
    async () => {
      const timezone = schedule.timezone || run.timezone;
      const nextScheduledFor = calculateNextDailyRun({
        time: schedule.time!,
        timezone,
        after: new Date(run.scheduledFor),
      });

      console.log(
        "Next scheduled date:",
        nextScheduledFor,
        nextScheduledFor.toISOString()
      );

      const inserted = await db
        .insert(agentRun)
        .values({
          agentid: run.agentid,
          userEmail: run.userEmail,
          scheduledFor: nextScheduledFor,
          timezone,
          status: "scheduled",
        })
        .returning();

      console.log("NEXT RUN INSERTED:", inserted);

      return inserted[0] ?? null;
    }
  );

  console.log("NEXT RUN RESULT:", nextRun);
} else {
  console.log("NOT CREATING NEXT RUN");
}
     
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      await step.run(`mark-run-failed-${run.id}`, async () => {
        await db
          .update(agentRun)
          .set({
            status: "failed",
            error: message,
            completedAt: new Date(),
          })
          .where(eq(agentRun.id, run.id));
      });

      await step.run(`emit-failed-status-${run.id}`, async () => {
        await inngest.send({
          name: "agent/status.changed",
          data: {
            runId: run.id,
            agentId: run.agentid,
            userEmail: run.userEmail,
            status: "failed",
          },
        });
      });

      throw error;
    }
  },
);

export const ExecuteScheduledAgentDashboard = inngest.createFunction(
  {
    id: "execute-scheduled-agent-dashboard",
    triggers: [{ event: "agent/status.changed" }],
  },
  async ({ event, step }) => {
    const { userEmail, runId, status } = event.data as {
      userEmail: string;
      runId: string;
      status: "running" | "completed" | "failed" | "scheduled" | "queued";
    };

    if (!userEmail) {
      throw new Error("Missing userEmail");
    }

    const briefData = await step.run(
      `load-dashboard-data-${userEmail}`,
      async () => {
        const now = new Date();

        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const runs = await db
          .select({
            run: agentRun,
            config: agentConfig,
          })
          .from(agentRun)
          .innerJoin(agentConfig, eq(agentRun.agentid, agentConfig.agentId))
          .where(
            and(
              eq(agentRun.userEmail, userEmail),
              gte(agentRun.createdAt, oneDayAgo),
              lte(agentRun.createdAt, now),
            ),
          )
          .orderBy(desc(agentRun.createdAt));

        const completed = runs.filter(
          (item) => item.run.status === "completed",
        );

        const failed = runs.filter((item) => item.run.status === "failed");

        const running = runs.filter((item) => item.run.status === "running");

        const scheduled = runs.filter(
          (item) =>
            item.run.status === "scheduled" || item.run.status === "queued",
        );

        return {
          period: {
            from: oneDayAgo.toISOString(),
            to: now.toISOString(),
          },

          total: runs.length,

          counts: {
            completed: completed.length,
            failed: failed.length,
            running: running.length,
            scheduled: scheduled.length,
          },

          runs: runs.map((item) => ({
            runId: item.run.id,

            agentId: item.run.agentid,

            agentName: item.config.name ?? "Unnamed Agent",

            objective: item.config.objective ?? item.config.description ?? "",

            status: item.run.status,

            scheduledFor: item.run.scheduledFor,

            startedAt: item.run.startedAt,

            completedAt: item.run.completedAt,

            error: item.run.status === "failed" ? item.run.error : null,

            result: item.run.status === "completed" ? item.run.output : null,
          })),
        };
      },
    );

    const generatedBrief = await step.run(
      `generate-ai-brief-${userEmail}-${runId}`,
      async () => {
        const prompt = `
You are Nexora AI's dashboard briefing assistant.

Generate a 300-400 words and useful briefing for the user's AI agents.

TIME PERIOD:
Last 24 hours until now.

CURRENT STATUS CHANGE:
Agent run ${runId} changed to "${status}".

DATA:
${JSON.stringify(briefData, null, 2)}

Instructions:

1. Give a concise summary of what happened with the user's agents.
2. Mention the number of completed, running, failed and scheduled runs.
3. Mention important completed tasks using their agent name and result.
4. If an agent failed, briefly explain the failure using the error.
5. If something is currently running, mention it.
6. Do not expose IDs, email addresses, internal database information,
   Composio session IDs or technical implementation details.
7. Do not invent information.
8. Keep the response between 2 and 5 sentences.
9. Make it sound like a helpful dashboard assistant.
10. If there were no runs, say that there is no significant agent activity
    in the last 24 hours.

Return ONLY the briefing text.
        `.trim();

        const response = await ai.models.generateContent({
          model: process.env.NEXT_GOOGLE_GEMINI_MODEL ?? "gemini-2.5-flash",

          contents: prompt,
        });

        return (
          response.text?.trim() ||
          "No briefing could be generated at this time."
        );
      },
    );

    const generatedAt = new Date();

    await step.run(`save-dashboard-brief-${userEmail}`, async () => {
      await db
        .insert(dashboardBrief)
        .values({
          userEmail,
          brief: generatedBrief,
          generatedAt,
          updatedAt: generatedAt,
        })
        .onConflictDoUpdate({
          target: dashboardBrief.userEmail,
          set: {
            brief: generatedBrief,
            generatedAt,
            updatedAt: generatedAt,
          },
        });
    });

    return {
      success: true,
      userEmail,
      generatedAt: generatedAt.toISOString(),
      brief: generatedBrief,
    };
  },
);

export const processTask = ProcessScheduledAgent;
