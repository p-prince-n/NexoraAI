import { agentRun, db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, count, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const email = user.primaryEmailAddress?.emailAddress ?? "";

    const results = await Promise.allSettled([
      // Completed
      db
        .select({
          completed: count(),
        })
        .from(agentRun)
        .where(
          and(
            eq(agentRun.userEmail, email),
            eq(agentRun.status, "completed"),
          ),
        ),

      // Failed
      db
        .select({
          failed: count(),
        })
        .from(agentRun)
        .where(
          and(
            eq(agentRun.userEmail, email),
            eq(agentRun.status, "failed"),
          ),
        ),

      // Scheduled
      db
        .select({
          scheduled: count(),
        })
        .from(agentRun)
        .where(
          and(
            eq(agentRun.userEmail, email),
            inArray(agentRun.status, ["scheduled", "queued"]),
          ),
        ),

      // Running
      db
        .select({
          running: count(),
        })
        .from(agentRun)
        .where(
          and(
            eq(agentRun.userEmail, email),
            eq(agentRun.status, "running"),
          ),
        ),
    ]);

    const data = {
      completed:
        results[0].status === "fulfilled"
          ? (results[0].value[0]?.completed ?? 0)
          : 0,

      failed:
        results[1].status === "fulfilled"
          ? (results[1].value[0]?.failed ?? 0)
          : 0,

      scheduled:
        results[2].status === "fulfilled"
          ? (results[2].value[0]?.scheduled ?? 0)
          : 0,

      running:
        results[3].status === "fulfilled"
          ? (results[3].value[0]?.running ?? 0)
          : 0,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Successfully fetched data",
        data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}