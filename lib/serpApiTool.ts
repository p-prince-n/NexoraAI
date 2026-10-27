import { getJson } from "serpapi";

type SerpSearchInput = {
  query: string;

  location?: string;
  numResults?: number;
  agentName?: string;
  agentInstructions?: string;}

type SearchResult = {
  title: string;
  link: string;
  snippet?: string;
  displayedLink?: string;
  position?: number;
}

type SerpSearchResponse = {
  query: string;
  results: SearchResult[];
};

async function searchWithSerpAPI({
  query,
  location,
  numResults = 10,
}: SerpSearchInput): Promise<SerpSearchResponse> {
  if (!query?.trim()) {
    throw new Error("Search query is required.");
  }
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    throw new Error("SERPAPI_API_KEY is not configured.");
  }

  const safeNumResults = Math.min(
    Math.max(Number(numResults) || 10, 1),
    10,
  );
  try {
    const response = await getJson({
      engine: "google",
      api_key: apiKey,
      q: query.trim(),
      ...(location?.trim()
        ? {
            location: location.trim(),
          }
        : {}),
      num: safeNumResults,
    });
    console.log("hasError:", !!response.error);
    console.log("=================================");
    if (response.error) {
      const errorMessage =
        typeof response.error === "string"
          ? response.error
          : JSON.stringify(response.error);
      throw new Error(`SerpAPI error: ${errorMessage}`);
    }
    const results: SearchResult[] = (response.organic_results ?? [])
      .slice(0, safeNumResults)
      .map((item: any, index: number) => ({
        position: index + 1,
        title: item.title ?? "",
        link: item.link ?? "",
        snippet: item.snippet ?? "",
        displayedLink: item.displayed_link ?? "",
      }));
    return {
      query: query.trim(),
      results,
    };
  } catch (error: any) {
    throw new Error(error?.message || "SerpAPI request failed.");
  }
}
export const serpSearchTool = {
  name: "serp_search",
  slug: "serpapi",
  description: `
Search the live web using Google Search through SerpAPI.
Use this tool when the user's request requires web search.
This tool performs web SEARCH only.
IMPORTANT RESPONSE RULE:
The search results are SOURCE MATERIAL, not the final answer.
After receiving the results:
- Answer ONLY the user's actual question.
- Extract only relevant information.
- Do NOT reproduce all search results.
- Do NOT dump raw search data.
- Do NOT include unrelated information.
- Do NOT list all URLs unless requested.
- Do NOT fabricate missing information.
- If multiple values are found, explain the differences.
- If the results do not contain enough information, sayso.
The tool must follow the current agent's name and instructions.
The tool does not perform browser interaction or website automation.
`,
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "The exact topic, question, product, company, technology, or information to search for.",
      },
      location: {
        type: "string",
        description:
          "Optional geographic location for localized search, such as Mumbai, India.",
      },
      numResults: {
        type: "number",
        description:
          "Number of search results to return. Use between 1 and 10. Default is 10.",
      },
    },
    required: ["query"],
  },
  async exec({
    query,
    location,
    numResults,
    agentName,
    agentInstructions,
  }: SerpSearchInput): Promise<SerpSearchResponse> {
    if (!agentName?.trim()) {
      throw new Error(
        "SERP Search is not available without an agent configuration.",
      );
    }
    if (!agentInstructions?.trim()) {
      throw new Error(
        `SERP Search is not configured for agent "${agentName}".`,
      );
    }
    const result = await searchWithSerpAPI({
      query,
      location,
      numResults,
    })
    return result;
  },
};
