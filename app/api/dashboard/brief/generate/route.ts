import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { inngest } from "@/inngest/client";

export async function POST() {
   console.log("called");
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

    const userEmail =
      user.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "User email not found",
        },
        { status: 400 }
      );
    }

    await inngest.send({
      name: "agent/status.changed",
      data: {
        runId: `dashboard-${Date.now()}`,
        agentId: "dashboard",
        userEmail,
        status: "completed",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Dashboard briefing generation started",
    });
  } catch (error) {
    console.error(
      "Failed to trigger dashboard briefing:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate dashboard briefing",
      },
      { status: 500 }
    );
  }
}