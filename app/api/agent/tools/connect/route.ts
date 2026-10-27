import { agentConfig, db } from "@/db";
import { composio } from "@/lib/composio";
import { getOrCreateSessionAgent } from "@/lib/getAgentComposioSession";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const user = await currentUser();

//     if (!user) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Unauthorized",
//         },
//         { status: 401 }
//       );
//     }

//     const userEmail = user.primaryEmailAddress?.emailAddress ?? "";

//     const { toolSlug } = await req.json();

//     if (!toolSlug) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "toolSlug is required",
//         },
//         { status: 400 }
//       );
//     }

//     console.log("Connecting tool:", toolSlug);

//     // Create Composio auth configuration
//     const authConfig = await composio.authConfigs.create(toolSlug);

//     // Start OAuth connection for the user
//     const connectionRequest =
//       await composio.connectedAccounts.link(
//         userEmail,
//         authConfig.id
//       );

//     console.log(
//       "Authorization redirect:",
//       connectionRequest.redirectUrl
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Tool connection started",
//         redirectUrl: connectionRequest.redirectUrl,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Connect tool error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error
//             ? error.message
//             : "Failed to connect the tool",
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req:NextRequest) {
  try {
    const {toolSlug, agentId}=await req.json();
    const user=await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not authorized",
        },
        { status: 401 },
      );
    }

    if (!agentId) {
      return NextResponse.json(
        {
          success: false,
          error: "agentId is required",
        },
        { status: 400 },
      );
    }

    const userEmail =
      user.primaryEmailAddress?.emailAddress ?? "";

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "User email not found",
        },
        { status: 400 },
      );
    }

    const result = await db
      .select()
      .from(agentConfig)
      .where(
        and(
          eq(agentConfig.agentId, agentId),
          eq(agentConfig.userEmail, userEmail),
        ),
      );

    const agentConfigResult = result[0];
    //@ts-ignore
    const session=await getOrCreateSessionAgent(agentConfigResult, userEmail);
    const connectionRequest=await session.authorize(toolSlug);
    return NextResponse.json({redirectUrl: connectionRequest.redirectUrl}, {status:200})
  } catch (error) {
    
  }
  
}


export async function DELETE(req: NextRequest) {
  try {
    const { toolSlug, agentId } = await req.json();

    if (!toolSlug || !agentId) {
      return NextResponse.json(
        {
          success: false,
          error: "toolSlug and agentId are required",
        },
        { status: 400 },
      );
    }

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

    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";

    const agentConfigData = await db
      .select()
      .from(agentConfig)
      .where(
        and(
          eq(agentConfig.agentId, agentId),
          eq(agentConfig.userEmail, userEmail),
        ),
      );

    if (!agentConfigData.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent configuration not found",
        },
        { status: 404 },
      );
    }

    const composioSessionId = agentConfigData[0].composioSessionId;

    if (!composioSessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Composio session not found",
        },
        { status: 404 },
      );
    }

    // @ts-ignore
    const session = await composio.use(composioSessionId);

    const toolKits: any = await session.toolkits();

    const toolKit = toolKits.items?.find(
      (item: any) => item.slug?.toLowerCase() === toolSlug.toLowerCase(),
    );

    const connectedAccountId =
      toolKit?.connection?.connectedAccount?.id ?? null;

    if (!connectedAccountId) {
      return NextResponse.json(
        {
          success: false,
          error: "Connection not found",
        },
        { status: 404 },
      );
    }

    await composio.connectedAccounts.delete(connectedAccountId);

    return NextResponse.json(
      {
        success: true,
        message: "Tool disconnected successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Disconnect tool error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message ?? "Failed to disconnect the tool",
      },
      { status: 500 },
    );
  }
}
