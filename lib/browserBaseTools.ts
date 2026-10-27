import { Browserbase } from "@browserbasehq/sdk";

type BrowserResearchInput = {
  task: string;
};

type BrowserResearchResult = {
  runId: string;
  status: string;
  result: unknown;
};

async function researchWithBrowserBase(
  task: string,
): Promise<BrowserResearchResult> {
  if (!task?.trim()) {
    throw new Error("Browser research task is required");
  }

  const apiKey = process.env.BROWSERBASE_API_KEY;
  const agentId = process.env.BROWSERBASE_AGENT_ID;

  if (!apiKey) {
    throw new Error("BROWSERBASE_API_KEY is not configured");
  }

  if (!agentId) {
    throw new Error("BROWSERBASE_AGENT_ID is not configured");
  }

  const bb = new Browserbase({
    apiKey,
  });

  const { runId } = await bb.agents.runs.create({
    agentId,
    task: task.trim(),
    browserSettings: {
      proxies: true,
    },
  });

  const deadline = Date.now() + 4 * 60 * 1000;

  const terminalStatuses = [
    "COMPLETED",
    "FAILED",
    "STOPPED",
    "TIMED_OUT",
  ];

  while (Date.now() < deadline) {
    const run = await bb.agents.runs.retrieve(runId);

    if (terminalStatuses.includes(run.status)) {
      if (run.status !== "COMPLETED") {
        throw new Error(
          `Browser research ${run.status.toLowerCase()}. Run ID: ${runId}`,
        );
      }

      return {
        runId,
        status: run.status,
        result: run.result,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(`Browser research timed out. Run ID: ${runId}`);
}

export const bbResearchTool = {
  slug: "browserbase_tool",
  name: "browser_research",

  description: `
Research the live internet using a read-only Browserbase research agent.

Use this tool when the user needs:
- Current or latest information
- Live internet research
- Current product prices or availability
- Product or service comparisons
- Current news or recent updates
- Website-specific information
- Verification of information from websites
- Current software, API, documentation, or release information

The tool is READ-ONLY.

Do not use it for purchases, logins, form submissions,
sending messages, uploading files, or modifying external systems.

Return only information actually obtained from the browser research.
Do not invent prices, availability, URLs, or research results.
`,

  parameters: {
    type: "object",
    properties: {
      task: {
        type: "string",
        description:
          "A precise research task describing exactly what information should be searched, verified, compared, or retrieved from the live internet.",
      },
    },
    required: ["task"],
  },

  async exec({ task }: BrowserResearchInput) {
    return await researchWithBrowserBase(task);
  },
};