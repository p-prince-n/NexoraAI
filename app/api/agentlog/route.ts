import { agentConfig, agentRun, db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "User email not found",
        },
        { status: 400 },
      );
    }



    const body = await req.json();

    const page = Math.max(Number(body.page) || 1, 1);

    const limit = 10;
    const offset = (page - 1) * limit;

    // Fetch runs + total count in parallel
    const [results, totalResult] = await Promise.all([
      db
        .select({
          id: agentRun.id,
          agentId: agentRun.agentid,
          userEmail: agentRun.userEmail,
          scheduledFor: agentRun.scheduledFor,
          timezone: agentRun.timezone,
          status: agentRun.status,
          output: agentRun.output,
          error: agentRun.error,
          queuedAt: agentRun.queuedAt,
          startedAt: agentRun.startedAt,
          completedAt: agentRun.completedAt,
          createdAt: agentRun.createdAt,

          agentName: agentConfig.name,
          agentImage: agentConfig.agentImage,
          agentDescription: agentConfig.description,
        })
        .from(agentRun)
        .innerJoin(
          agentConfig,
          and(
            eq(agentConfig.agentId, agentRun.agentid),
            eq(agentConfig.userEmail, email),
          ),
        )
        .where(eq(agentRun.userEmail, email))
        .orderBy(desc(agentRun.createdAt))
        .limit(limit)
        .offset(offset),

      db
        .select({
          count: count(),
        })
        .from(agentRun)
        .where(eq(agentRun.userEmail, email)),
    ]);

    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        message: "Successfully data fetched",
        data: results,
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
    console.error("Failed to fetch agent runs:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch agent runs",
      },
      { status: 500 },
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const email = user.primaryEmailAddress?.emailAddress ?? "";

    const results = await Promise.allSettled([
      db
        .select({
          completed: count(),
        })
        .from(agentRun)
        .where(
          and(eq(agentRun.userEmail, email), eq(agentRun.status, "completed")),
        ),

      db
        .select({
          failed: count(),
        })
        .from(agentRun)
        .where(
          and(eq(agentRun.userEmail, email), eq(agentRun.status, "failed")),
        ),

      db
        .select({
          scheduled: count(),
        })
        .from(agentRun)
        .where(
          and(eq(agentRun.userEmail, email), inArray(agentRun.status, ["scheduled", "queued"])),
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
    };

    return NextResponse.json(
      {
        success: true,
        message: "Successfully data fetched",
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
