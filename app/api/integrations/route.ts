import { db, tools } from "@/db";
import { composio } from "@/lib/composio";
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

    // Get page from query params
    const { searchParams } = new URL(req.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = 6;

    const offset = (page - 1) * limit;

    // Get all active integrations
    const toolResult = await db
      .select()
      .from(tools)
      .where(
        and(
          eq(tools.status, "active"),
          eq(tools.type, "integration")
        )
      );

    const totalItems = toolResult.length;

    const totalPages = Math.ceil(totalItems / limit);

    // Get only the integrations for current page
    const paginatedTools = toolResult.slice(
      offset,
      offset + limit
    );

    const slugs = paginatedTools.map((item) =>
      String(item.slug)
    );

    const accounts =
      slugs.length > 0
        ? await composio.connectedAccounts.list({
            userIds: [
              user.primaryEmailAddress?.emailAddress ?? "",
            ],
            toolkitSlugs: slugs,
          })
        : { items: [] };

    const integrations = await Promise.all(
      paginatedTools.map(async (tool: any) => {
        const toolAccount = accounts.items.find(
          (account: any) =>
            account.toolkit.slug.toLowerCase() ===
            tool.slug.toLowerCase()
        );

        const toolkit = await composio.toolkits.get(
          tool.slug
        );

        return {
          ...tool,

          account: toolAccount ?? null,

          connected: toolAccount?.status === "ACTIVE",

          image: toolkit?.meta?.logo ?? null,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        message: "Tools successfully fetched",

        integrations,

        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          totalPages,

          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    const error =
      e instanceof Error
        ? e.message
        : "Error while fetching the tools";

    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      { status: 500 }
    );
  }
}

