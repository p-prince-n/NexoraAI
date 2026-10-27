import { agentConfig, db, tools } from "@/db";
import { composio } from "./composio";
import { CreateAgentType } from "./types";
import { eq, inArray } from "drizzle-orm";

export const getOrCreateSessionAgent = async (
  agentConfig: CreateAgentType,
  userEmail: string,
) => {
  try {
    if (!userEmail) {
      throw new Error("User email is required");
    }
    if (agentConfig?.composioSessionId) {
      console.log(
        "Reusing existing Composio session:",
        agentConfig.composioSessionId,
      );

      return composio.use(agentConfig.composioSessionId);
    }

   
    const allowedTools: string[] = agentConfig.tools ?? [];

    console.log("Allowed tools:", allowedTools);

    if (!allowedTools.length) {
      throw new Error("No tools selected for this agent");
    }

    const dbTools = await db
      .select({
        name: tools.name,
        slug: tools.slug,
      })
      .from(tools)
      .where(inArray(tools.slug, allowedTools));

    console.log("DB tools:", dbTools);

    const toolkitSlugs = dbTools
      .map((tool) => tool.slug)
      .filter(
        (slug): slug is string =>
          typeof slug === "string" && slug.length > 0,
      );

    console.log("Composio toolkit slugs:", toolkitSlugs);

    if (!toolkitSlugs.length) {
      throw new Error(
        `No valid Composio toolkits found for: ${allowedTools.join(", ")}`,
      );
    }


    const session = await composio.sessions.create(userEmail, {
      toolkits: toolkitSlugs,
    });

  

  
    await saveSessionIdForComposio(
      agentConfig.agentId,
      session.sessionId,
    );

  
    
    return session;
  } catch (error) {
    console.error(
      "Error while getOrCreateSessionAgent:",
      error instanceof Error ? error.message : error,
    );

    throw error;
  }
};

const saveSessionIdForComposio = async (
  agentId: string,
  sessionId: string,
) => {
  try {
    await db
      .update(agentConfig)
      .set({
        composioSessionId: sessionId,
      })
      .where(eq(agentConfig.agentId, agentId));

    console.log(
      "Saved Composio session:",
      sessionId,
    );
  } catch (error) {
    console.error(
      "Error while saveSessionIdForComposio:",
      error instanceof Error ? error.message : error,
    );

    throw error;
  }
};