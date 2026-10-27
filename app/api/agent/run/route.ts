import { agentConfig, db } from "@/db";
import { executeAgent } from "@/lib/executeAgent";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
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
        { status: 401 },
      );
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "User email not found",
        },
        { status: 400 },
      );
    }

    const body = await req.json();

    const { agentConfigData, agentId, input, availableTools } = body;
    console.log({availableTools});
    

    if (!agentConfigData && !agentId) {
      return NextResponse.json(
        {
          success: false,
          error: "agentId or agentConfigData is required",
        },
        { status: 400 },
      );
    }

    if (!input?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent input is required",
        },
        { status: 400 },
      );
    }

    let AgentData = agentConfigData;

    if (!AgentData) {
      const result = await db
        .select()
        .from(agentConfig)
        .where(
          and(
            eq(agentConfig.agentId, agentId),
            eq(agentConfig.userEmail, userEmail),
          ),
        )
        .limit(1);

      AgentData = result[0];
    }

    if (!AgentData) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent not found",
        },
        { status: 404 },
      );
    }

    const result = await executeAgent({
      agentConfig: AgentData,
      userEmail,
      input: input.trim(),
      availableTools
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Error executing agent API:", error);

    return NextResponse.json(
      {
        success: false,
        finalOutput: null,
        error:
          error instanceof Error ? error.message : "Failed to execute agent",
      },
      { status: 500 },
    );
  }
}
