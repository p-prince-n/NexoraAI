import { and, asc, eq } from "drizzle-orm";
import { agentConfig, agentRun, db } from "@/db";
import { calculateNextDailyRun } from "@/lib/agentShedule";

type AgentSchedule = {
  type?: "once" | "recurring" | "manual";
  frequency?: "hourly" | "daily" | "weekly" | "monthly";
  time?: string;
  timezone?: string;
};

export async function syncScheduledAgentRuns(agentId?: string) {
  const conditions = [
    eq(agentRun.status, "scheduled"),
  ];

  if (agentId) {
    conditions.push(eq(agentRun.agentid, agentId));
  }

  const runs = await db
    .select({
      run: agentRun,
      config: agentConfig,
    })
    .from(agentRun)
    .innerJoin(
      agentConfig,
      eq(agentRun.agentid, agentConfig.agentId)
    )
    .where(and(...conditions))
    .orderBy(asc(agentRun.scheduledFor));

  const now = new Date();

  for (const { run, config } of runs) {
    const schedule = config.schedule as AgentSchedule | null;

    // Cancel invalid/manual schedules
    if (
      !schedule ||
      schedule.type === "manual" ||
      !(
        schedule.type === "recurring" &&
        schedule.frequency === "daily" &&
        schedule.time
      )
    ) {
      await db
        .update(agentRun)
        .set({
          status: "cancelled",
          completedAt: now,
        })
        .where(
          and(
            eq(agentRun.id, run.id),
            eq(agentRun.status, "scheduled")
          )
        );

      console.log(
        `[Scheduler] Cancelled scheduled run ${run.id}`
      );

      continue;
    }

    // Already due or future run:
    // DON'T modify scheduledFor here.
    console.log(
      `[Scheduler] Keeping run ${run.id}`,
      {
        scheduledFor: run.scheduledFor.toISOString(),
        now: now.toISOString(),
      }
    );
  }
}