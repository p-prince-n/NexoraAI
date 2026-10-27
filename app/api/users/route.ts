import { db, users } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const clerkData = await currentUser();

    if (!clerkData) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const email = clerkData.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email not found",
        },
        { status: 400 }
      );
    }

    const image = clerkData.imageUrl;

    const alreadyUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (alreadyUser.length === 0) {
      const newUser = await db
        .insert(users)
        .values({
          name: clerkData.fullName ?? "",
          email,
          image: image ?? "",
        })
        .returning();

      return NextResponse.json({
        success: true,
        data: newUser[0],
      });
    }

    // Optional: keep the image updated if the user changes
    const updatedUser = await db
      .update(users)
      .set({
        name: clerkData.fullName ?? "",
        image: image ?? "",
      })
      .where(eq(users.email, email))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedUser[0],
    });
  } catch (error) {
    console.error("User sync error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};