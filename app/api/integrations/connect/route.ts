import { composio } from "@/lib/composio";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    const { slug } = await req.json();
    const authConfig = await composio.authConfigs.create(slug);
    const conectionTool = await composio.connectedAccounts.link(
      userEmail,
      authConfig.id,
    );
    return NextResponse.json(
      {
        success: true,
        message: "Tool connection successfully done",
        redirectUrl: conectionTool.redirectUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error ? error.message : "Error while connecting tool",
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    const { connectedAccountId } = await req.json();
    await composio.connectedAccounts.delete(connectedAccountId);
    return NextResponse.json(
      { success: true, message: "disconnected successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error while disconnecting tool",
    });
  }
}
