import { useEffect, useState } from "react";
import { Check, Link, Loader2, Search, Unlink } from "lucide-react";
import React from "react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateAgentType, Tool } from "@/lib/types";
import axios from "axios";
import { toast } from "@/components/ui/toast";



type Props = {
  selectedAgent: CreateAgentType | null;
};

const ConnectedTools=({ selectedAgent }: Props)=> {
  const [tools, setTools] = useState<Tool[]>([]);
const [connectedTools, setConnectedTools] = useState<Tool[]>([]);
const [search, setSearch] = useState("");
const [loadingTool, setLoadingTool] = useState<string | null>(null);
const [fetchToolsLoadingTool, setFetchToolsLoadingTool] = useState<boolean | null>(false);




useEffect(() => {
  if (!selectedAgent?.agentId) return;
  

  const fetchTools = async () => {
  setFetchToolsLoadingTool(true);

  try {
    const response = await axios.post(
      `/api/agent/tools?agentId=${selectedAgent.agentId}`
    );

    const data = response.data.tools;
    console.log("All Tools:", data.tools);
    console.log({data});
    

    // Only integration tools should appear in the Connected Tools UI
    const integrationTools = data.filter(
      (tool:any) => tool.type === "integration"
    );

    console.log("Integration Tools:", integrationTools);

    setTools(integrationTools);

    setConnectedTools(
      integrationTools.filter((tool:any) => tool.connected)
    );
  } catch (error) {
    console.error("Failed to fetch tools:", error);
  } finally {
    setFetchToolsLoadingTool(false);
  }
};

  fetchTools();
}, [selectedAgent?.agentId]);

  const connectedCount = connectedTools.length;
const totalTools = tools.length;

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Dummy connect function
const connectTool = async (tool: Tool) => {
  if (!selectedAgent?.agentId) return;

  setLoadingTool(tool.slug);

  try {
    const result = await axios.post("/api/agent/tools/connect", {
      agentId: selectedAgent.agentId,
      toolSlug: tool.slug,
    });

    const redirectUrl = result.data?.redirectUrl;

    if (!redirectUrl) {
      throw new Error("No redirect URL received");
    }

    // Open OAuth in a popup
    const popup = window.open(
      redirectUrl,
      "composio-oauth",
      "width=600,height=700,left=200,top=100,resizable=yes,scrollbars=yes",
    );

    if (!popup) {
      throw new Error("Popup was blocked by the browser");
    }

    // Check when popup closes
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);

        // Refresh/check connected tools after OAuth
        setLoadingTool(null);

        // Optional: reload current page
        window.location.reload();
      }
    }, 500);
  } catch (error: any) {
    console.error("Failed to connect tool:", error);

    const message =
      error?.response?.data?.error ||
      error?.message ||
      "Failed to connect tool";

    console.error(message);
    setLoadingTool(null);
  }
};
  // Dummy disconnect function
  const disconnectTool = async (tool: Tool) => {
  if (!selectedAgent?.agentId) {
    toast.add({
      type: "error",
      title: "Agent ID is missing",
    });
    return;
  }

  setLoadingTool(tool.slug);

  try {
    const result = await axios.delete("/api/agent/tools/connect", {
      data: {
        agentId: selectedAgent.agentId,
        toolSlug: tool.slug,
      },
    });

    if (result.data?.success) {
      toast.add({
        type: "success",
        title: "Tool disconnected successfully",
      });

      setTools((prev) =>
        prev.map((item) =>
          item.slug === tool.slug
            ? { ...item, connected: false }
            : item
        )
      );

      setConnectedTools((prev) =>
        prev.filter((item) => item.slug !== tool.slug)
      );
    } else {
      toast.add({
        type: "error",
        title: result.data?.error || "Failed to disconnect tool",
      });
    }
  } catch (error: any) {
    console.error("Disconnect tool error:", error);

    toast.add({
      type: "error",
      title:
        error?.response?.data?.error ||
        error?.message ||
        "Failed to disconnect tool",
    });
  } finally {
    setLoadingTool(null);
  }
};

  return (
    <section className="mt-5 w-full space-y-3 rounded-xl border border-gray-200 bg-white p-3 transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29] sm:p-4">
  {/* Header */}
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <h1 className="text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-purple-50 sm:text-xl">
        Connected Tools
      </h1>

      <p className="text-sm text-muted-foreground dark:text-purple-200/60">
        {connectedCount} of {totalTools} connected
      </p>
    </div>
  </div>

  {/* Search */}
  {totalTools > 0 && (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground dark:text-purple-300/50" />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tools..."
        className="border-gray-200 bg-white pl-9 text-gray-900 placeholder:text-gray-400 transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-50 dark:placeholder:text-purple-300/40"
      />
    </div>
  )}

  {fetchToolsLoadingTool && (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="size-6 animate-spin text-purple-500 dark:text-purple-400" />
    </div>
  )}

  <div className="grid w-full gap-3">
    {!fetchToolsLoadingTool &&
      filteredTools.map((tool) => {
        const isConnected = connectedTools.some(
          (item) => item.slug === tool.slug,
        );

        const isLoading = loadingTool === tool.slug;

        return (
          <div
            key={tool.name}
            className="flex min-w-0 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-md transition-all duration-300 hover:shadow-lg dark:border-[#302044] dark:bg-[#100A1F] dark:hover:border-purple-800 dark:hover:bg-[#170D29]"
          >
            {/* Tool information */}
            <div className="flex min-w-0 items-center gap-3">
              {/* Tool icon */}
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg transition-colors duration-300 dark:bg-purple-950/40">
                <img
                  src={tool.logo}
                  alt={tool.name}
                  className="size-6 object-contain"
                />
              </div>

              {/* Tool name + status */}
              <div className="min-w-0">
                <h3 className="truncate text-sm font-medium text-gray-900 transition-colors duration-300 dark:text-purple-50">
                  {tool.name}
                </h3>

                {isConnected ? (
                  <div className="mt-1 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <Check className="size-3" />
                    Connected
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                    <Unlink className="size-3" />
                    Not connected
                  </div>
                )}
              </div>
            </div>

            {/* Connect / Disconnect */}
            {isConnected ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isLoading}
                onClick={() => disconnectTool(tool)}
                className="shrink-0 cursor-pointer transition-all duration-200 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/70"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Unlink className="size-4 sm:mr-1" />
                    <span className="hidden sm:inline">Disconnect</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={isLoading}
                onClick={() => connectTool(tool)}
                className="shrink-0 cursor-pointer bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Link className="size-4 sm:mr-1" />
                    <span className="hidden sm:inline">Connect</span>
                  </>
                )}
              </Button>
            )}
          </div>
        );
      })}
  </div>

  {/* Search result empty */}
  {!fetchToolsLoadingTool &&
    filteredTools.length === 0 &&
    totalTools > 0 && (
      <div className="py-6 text-center text-sm text-muted-foreground dark:text-purple-200/60">
        No tools found.
      </div>
    )}

  {/* No tools */}
  {!fetchToolsLoadingTool && totalTools === 0 && (
    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F]">
      <p className="text-sm font-medium text-gray-900 dark:text-purple-50">
        No tools available
      </p>

      <p className="mt-1 text-xs text-muted-foreground dark:text-purple-200/60">
        Add tools to this agent to connect them.
      </p>
    </div>
  )}
</section>
  );
}

export default React.memo(ConnectedTools)
