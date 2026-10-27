import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { dashboardBrief, db } from "@/db";


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

    const userEmail =
      user.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Authenticated user email not found",
        },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(dashboardBrief)
      .where(eq(dashboardBrief.userEmail, userEmail))
      .orderBy(desc(dashboardBrief.generatedAt))
      .limit(1);

    return NextResponse.json({
      success: true,
      brief: result[0] ?? null,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard brief:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard brief",
      },
      { status: 500 }
    );
  }
}