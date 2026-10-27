import { buildAgent } from "./buildAgent";
import { CreateAgentType, Tool } from "./types";

export const executeAgent = async ({
  agentConfig,
  userEmail = "",
  input,
  availableTools = [],
}: {
  agentConfig: CreateAgentType;
  userEmail: string;
  input: string;
  availableTools?: Tool[];
}) => {
  try {
    if (agentConfig.status?.toLowerCase() !== "active") {
      throw new Error("Agent is not active");
    }

    const userInput = input?.trim();

    if (!userInput) {
      throw new Error("Agent input is required");
    }

    const agent = await buildAgent({
      agentConfig,
      userEmail,
      availableTools,
    });

    const result = await agent.run(userInput);

    const finalOutput = result?.trim() || "";

    // Detect Composio authentication-required response
    const authenticationRequired =
      /please click the following link to authenticate/i.test(finalOutput) ||
      /authenticate your .* account/i.test(finalOutput) ||
      /authentication.*required/i.test(finalOutput) ||
      /complete.*authentication/i.test(finalOutput);

    if (authenticationRequired) {
      return {
        success: false,
        finalOutput: null,
        agentId: agentConfig.agentId,
        error: finalOutput,
      };
    }

    return {
      success: true,
      finalOutput,
      agentId: agentConfig.agentId,
    };
  } catch (error) {
    console.error("Error executing agent:", error);

    return {
      success: false,
      finalOutput: null,
      agentId: agentConfig.agentId,
      error:
        error instanceof Error
          ? error.message
          : "Failed to execute agent",
    };
  }
};