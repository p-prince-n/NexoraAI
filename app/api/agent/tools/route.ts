// import { agentConfig, db, tools } from "@/db";
// import { composio } from "@/lib/composio";
// import { getOrCreateSessionAgent } from "@/lib/getAgentComposioSession";
// import { currentUser } from "@clerk/nextjs/server";
// import { and, eq, inArray } from "drizzle-orm";
// import { NextRequest, NextResponse } from "next/server";


// export async function POST(req: NextRequest) {
//   try {
//     const searchParams = req.nextUrl.searchParams;
//     const agentId = searchParams.get("agentId");
//     const user = await currentUser();

//     if (!user) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "You are not authorized",
//         },
//         { status: 401 },
//       );
//     }

//     if (!agentId) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "agentId is required",
//         },
//         { status: 400 },
//       );
//     }

//     const userEmail =
//       user.primaryEmailAddress?.emailAddress ?? "";

//     if (!userEmail) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "User email not found",
//         },
//         { status: 400 },
//       );
//     }

//     const result = await db
//       .select()
//       .from(agentConfig)
//       .where(
//         and(
//           eq(agentConfig.agentId, agentId),
//           eq(agentConfig.userEmail, userEmail),
//         ),
//       );

//     const agentConfigResult = result[0];

//     if (!agentConfigResult) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Agent configuration data not found",
//         },
//         { status: 404 },
//       );
//     }

//     const allowedTools: string[] = Array.isArray(
//       agentConfigResult.tools,
//     )
//       ? agentConfigResult.tools
//       : [];

//     console.log("Allowed tools:", allowedTools);

//     if (allowedTools.length === 0) {
//       return NextResponse.json(
//         {
//           success: true,
//           tools: [],
//         },
//         { status: 200 },
//       );
//     }

    
//     const dbTools = await db
//       .select()
//       .from(tools)
//       .where(inArray(tools.slug, allowedTools));

//     console.log("DB tools:", dbTools);

  
//     const accounts =
//       await composio.connectedAccounts.list({
//         userIds: [userEmail],
//         toolkitSlugs: allowedTools,
//       });

//     console.log(
//       "Connected accounts:",
//       accounts.items,
//     );


//     const resultTools = await Promise.all(
//       dbTools.map(async (tool:any) => {
//         try {
       
//           const toolkit = await composio.toolkits.get(
//             tool.slug,
//           );

//           const toolAccount = accounts.items.find(
//             (account: any) => {
//               const accountSlug =
//                 account.toolkit?.tool?.slug ??
//                 account.toolkit?.slug;

//               return (
//                 accountSlug?.toLowerCase() ===
//                 tool.slug.toLowerCase()
//               );
//             },
//           );

//           return {
            
//             id: tool.id,
//             slug: tool.slug,
//             name: tool.name,
//             description: tool.description,
//             category: tool.category,
//             type: tool.type,
//             provider: tool.provider,
//             icon: tool.icon,

//             status: tool.status,
//             requiresAuth: tool.requiresAuth,
//             authType: tool.authType,
//             authProvider: tool.authProvider,

//             capabilities: tool.capabilities,
//             useCases: tool.useCases,
//             permissions: tool.permissions,
//             approvalRules: tool.approvalRules,
//             config: tool.config,

//             riskLevel: tool.riskLevel,

//             canRead: tool.canRead,
//             canWrite: tool.canWrite,
//             canDelete: tool.canDelete,
//             canExecute: tool.canExecute,

//             enabled: tool.enabled,

         
//             logo: toolkit?.meta?.logo ?? "",

//             appUrl:
//               toolkit?.meta?.appUrl ?? null,

//             categories:
//               toolkit?.meta?.categories ?? [],

//             toolsCount:
//               toolkit?.meta?.toolsCount ?? 0,

//             triggersCount:
//               toolkit?.meta?.triggersCount ?? 0,

          
//             connected:
//               toolAccount?.status === "ACTIVE",

//             connectedAccountId:
//               toolAccount?.id ?? null,
//           };
//         } catch (error) {
//           console.error(
//             `Failed to fetch Composio toolkit: ${tool.slug}`,
//             error,
//           );

       
//           return {
//             id: tool.id,
//             slug: tool.slug,
//             name: tool.name,
//             description: tool.description,
//             category: tool.category,
//             type: tool.type,
//             provider: tool.provider,
//             icon: tool.icon,

//             status: tool.status,
//             requiresAuth: tool.requiresAuth,
//             authType: tool.authType,
//             authProvider: tool.authProvider,

//             capabilities: tool.capabilities,
//             useCases: tool.useCases,
//             permissions: tool.permissions,
//             approvalRules: tool.approvalRules,
//             config: tool.config,

//             riskLevel: tool.riskLevel,

//             canRead: tool.canRead,
//             canWrite: tool.canWrite,
//             canDelete: tool.canDelete,
//             canExecute: tool.canExecute,

//             enabled: tool.enabled,

  
//             logo: "",
//             appUrl: null,
//             categories: [],
//             toolsCount: 0,
//             triggersCount: 0,

           
//             connected: false,
//             connectedAccountId: null,
//           };
//         }
//       }),
//     );

//     console.log(
//       "Final result tools:",
//       resultTools,
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         tools: resultTools,
//       },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     console.error(
//       "Failed to get connected tools:",
//       error,
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error?.message ??
//           "Failed to get connected tools",
//       },
//       { status: 500 },
//     );
//   }
// }


import { agentConfig, db, tools } from "@/db";
import { getOrCreateSessionAgent } from "@/lib/getAgentComposioSession";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // -----------------------------------------
    // Get agentId
    // -----------------------------------------

    const searchParams = req.nextUrl.searchParams;
    const agentId = searchParams.get("agentId");

    // -----------------------------------------
    // Check authentication
    // -----------------------------------------

    const user = await currentUser();

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

    // -----------------------------------------
    // Get user email
    // -----------------------------------------

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

    // -----------------------------------------
    // Get agent configuration
    // -----------------------------------------

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

    if (!agentConfigResult) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent configuration data not found",
        },
        { status: 404 },
      );
    }

    // -----------------------------------------
    // Get allowed tools
    // -----------------------------------------

    const allowedTools: string[] = Array.isArray(
      agentConfigResult.tools,
    )
      ? agentConfigResult.tools
      : [];

    console.log("Allowed tools:", allowedTools);

    if (allowedTools.length === 0) {
      return NextResponse.json(
        {
          success: true,
          tools: [],
        },
        { status: 200 },
      );
    }

    // -----------------------------------------
    // Get tool information from DB
    // -----------------------------------------

    const dbTools = await db
      .select()
      .from(tools)
      .where(inArray(tools.slug, allowedTools));

    console.log("DB tools:", dbTools);

    // -----------------------------------------
    // Get / create Composio session
    // -----------------------------------------

    const session = await getOrCreateSessionAgent(
      //@ts-ignore
      agentConfigResult,
      userEmail,
    );

    // -----------------------------------------
    // Get toolkits from the session
    // -----------------------------------------

    const toolkitResult = await session.toolkits();

    console.log(
      "Session toolkits:",
      toolkitResult.items,
    );

    // -----------------------------------------
    // Build final tools response
    // -----------------------------------------

    const resultTools = dbTools.map((tool:any) => {
      const toolkit = toolkitResult.items.find(
        (item) =>
          item.slug?.toLowerCase() ===
          tool.slug?.toLowerCase(),
      );

      return {
        // =====================================
        // Database tool information
        // =====================================

        id: tool.id,
        slug: tool.slug,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        type: tool.type,
        provider: tool.provider,
        icon: tool.icon,
        status: tool.status,

        requiresAuth: tool.requiresAuth,
        authType: tool.authType,
        authProvider: tool.authProvider,

        capabilities: tool.capabilities,
        useCases: tool.useCases,
        permissions: tool.permissions,
        approvalRules: tool.approvalRules,
        config: tool.config,

        riskLevel: tool.riskLevel,

        canRead: tool.canRead,
        canWrite: tool.canWrite,
        canDelete: tool.canDelete,
        canExecute: tool.canExecute,

        enabled: tool.enabled,

        // =====================================
        // Composio session toolkit information
        // =====================================

        logo: toolkit?.logo ?? "",

        // =====================================
        // Connection information
        // =====================================

        connected:
          toolkit?.connection?.isActive ?? false,

        connectedAccountId:
          toolkit?.connection?.connectedAccount?.id ??
          null,
      };
    });

    console.log(
      "Final result tools:",
      resultTools,
    );

    // -----------------------------------------
    // Return response
    // -----------------------------------------

    return NextResponse.json(
      {
        success: true,
        tools: resultTools,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "Failed to get connected tools:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          "Failed to get connected tools",
      },
      { status: 500 },
    );
  }
}
