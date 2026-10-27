import { agentConfig, agentRun, db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
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
        { status: 401 }
      );
    }

    const userEmail = req.nextUrl.searchParams.get("userEmail");
    console.log({ userEmail });

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "User Email is required",
        },
        { status: 400 }
      );
    }
    const authenticatedEmail =
      user.primaryEmailAddress?.emailAddress;
    if (!authenticatedEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Authenticated user email not found",
        },
        { status: 400 }
      );
    }
    if (userEmail !== authenticatedEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
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
      .where(
        eq(agentRun.userEmail, userEmail)
      );
    const runsData = {
      errorRuns: [] as typeof runs,
      scheduleRuns: [] as typeof runs,
      completedRuns: [] as typeof runs,
      runningRuns: [] as typeof runs,
    };

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const item of runs) {
      switch (item.run.status) {
        case "failed":
          runsData.errorRuns.push(item);
          break;

        case "scheduled":
          runsData.scheduleRuns.push(item);
          break;
        case "queued":
          runsData.scheduleRuns.push(item);
          break;
        

        case "completed":
          if (item.run.createdAt >= oneDayAgo) {
            runsData.completedRuns.push(item);
          }
          break;

        case "running":
          runsData.runningRuns.push(item);
          break;

        default:
          break;
      }
    }
    return NextResponse.json(
      {
        success: true,
        runsData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch agent runs:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch agent runs",
      },
      { status: 500 }
    );
  }
}