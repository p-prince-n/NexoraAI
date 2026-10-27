"use client";
import { Button } from "@/components/ui/button";
import {
  AgentConfig,
  ClarificationQuestion,
  CreateAgentType,
  QuickSuggetionSchema,
  TempletSchema,
} from "@/lib/types";
import {
  ArrowUp,
  BadgeAlert,
  BriefcaseBusiness,
  Loader,
  Loader2Icon,
  Mail,
  Plus,
  Search,
} from "lucide-react";
import SuggesionButton from "./SubComponents/CreateAgentComponents/SuggesionButton";
import { useCallback, useState } from "react";
import Templet from "./SubComponents/CreateAgentComponents/Templet";
import axios from "axios";
import AgentQuestionary from "./SubComponents/CreateAgentComponents/AgentQuestionary";
import NewAgentCard from "./SubComponents/CreateAgentComponents/NewAgentCard";
import DeleteAgent from "./GlobalAgentsComponents/DeleteAgent";
import { toast } from "@/components/ui/toast";
import NewAgentCardSkeleton from "./skeleton/NewAgentCardSkeleton";
import EditAgentCard from "./GlobalAgentsComponents/EditAgentCard";

const quickSuggesionButton: QuickSuggetionSchema = [
  {
    lable: "Find AI Jobs",
    prompt:
      "Find the latest AI developer jobs posted this week that natch my skills and summarize the best opportunities for me.",
  },
  {
    lable: "Inbox Summary",
    prompt:
      "Check my inbox and summuarize thye most important emails, especially anything tthat requires my reply or attention.",
  },
  {
    lable: "Research Topic",
    prompt:
      "Research this topic using reliable and up-to-date sources. Summarize the key findings, important facts, different viewpoints, and provide source links.",
  },
  {
    lable: "Plan My Day",
    prompt:
      "Check my calender and upcomming tasks, then create a prioritized plan for everything I should focus on today. ",
  },
  {
    lable: "Reddit Trend",
    prompt:
      "Search Reddit for recent discussions and trends about this topic. Summarize what people are saying, common opinions, useful insights, and notable discussions.",
  },
];
const templetsData: TempletSchema = [
  {
    icon: BriefcaseBusiness,
    description: "Search the web for the latest jobs matching my profile",
    title: "Find Latest Jobs",
    iconBG: "bg-orange-100 dark:bg-orange-950/40",
    iconColor: "text-orange-600 dark:text-orange-300",
    border: "hover:border-orange-300 dark:hover:border-orange-800",
    glow: "hover:shadow-orange-100 dark:hover:shadow-orange-950/40",
  },
  {
    icon: Mail,
    description:
      "Summarize important emails abd highlight what needs my attention.",
    title: "Daily Inbox Summary",
    iconBG: "bg-blue-100 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-300",
    border: "hover:border-blue-300 dark:hover:border-blue-800",
    glow: "hover:shadow-blue-100 dark:hover:shadow-blue-950/40",
  },
  {
    icon: Search,
    description:
      "Search the web and creates a useful research summary for me.",
    title: "Research A Topic",
    iconBG: "bg-purple-100 dark:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-300",
    border: "hover:border-purple-300 dark:hover:border-purple-700",
    glow: "hover:shadow-purple-100 dark:hover:shadow-purple-950/40",
  },
];

type AgentConfigResponse = {
  status: "needs_clarification" | "ready";
  clarificationQuestions: ClarificationQuestion[];
  config?: AgentConfig;
};

const getBrowserTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const CreateAgents = () => {
  const [prompt, setPrompt] = useState("");
  const setPromptCallback = useCallback((data: any) => {
    setPrompt(data);
  }, []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);
  const [configResult, setConfigResult] =
    useState<AgentConfigResponse | null>();
  const [createdAgent, setCreatedAgent] = useState<CreateAgentType | null>(
    null,
  );
  const [agentDeleteAlert, setAgentDeleteAlert] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [openEdit, setOpenEdit]=useState<boolean>(false);
  const [selectToUpdate, setSelectToUpdate]=useState<CreateAgentType | null>(null);

  const onSubmitHandle = async () => {
    setLoading(true);
    const timezone = getBrowserTimeZone();
    try {
      const result = await axios.post("/api/agent/config", {
        prompt,
        timezone,
      });
      setConfigResult(result.data);
      if (result.data.status_temp === "ready") {
        setCreatedAgent(result.data);
        setPrompt("");
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  const onComplete = async (res: any) => {
    const updatedPrompt = prompt + "\n" + JSON.stringify(res);
    setConfigResult(null);
    setLoading(true);
    const timezone = getBrowserTimeZone();
    try {
      const result = await axios.post("/api/agent/config", {
        prompt: updatedPrompt,
        timezone,
      });
      setConfigResult(result.data);
      setCreatedAgent(result.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const updateAgentStatus = async () => {
    if (!createdAgent?.id) return;
    setStatusLoading(true);

    const newStatus = createdAgent.status === "active" ? "pause" : "active";

    try {
      const { data } = await axios.put("/api/agent/config", {
        updatedData: {
          ...createdAgent,
          status: newStatus,
        },
      });

      if (!data?.success) {
        throw new Error(data?.error || "Failed to update agent status");
      }

      // Update selected agent
      setCreatedAgent((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
            }
          : null,
      );

      // Update agent in current page immediately

      toast.add({
        type: "success",
        title: newStatus === "active" ? "Agent activated" : "Agent paused",
        description:
          newStatus === "active"
            ? `"${createdAgent.name}" is now active.`
            : `"${createdAgent.name}" has been paused.`,
      });
    } catch (error) {
      console.error("Failed to update agent status:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to update agent status."
        : error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      toast.add({
        type: "error",
        title: "Status update failed",
        description: message,
      });
    } finally {
      setStatusLoading(false);
    }
  };
  return (
    <div className="mt-5 ">
      <div>
  <h2 className="text-2xl font-semibold tracking-tight text-gray-900 transition-colors duration-300 dark:text-purple-50">
    Create New Agent
  </h2>

  <p className="mt-1 text-sm text-muted-foreground transition-colors duration-300 dark:text-purple-200/60">
    Ask what type of Agent you want to build
  </p>
</div>

<div className="mt-5 rounded-2xl border border-gray-200 bg-background px-2 py-2 shadow-2xl transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29] dark:shadow-purple-950/20">
  <textarea
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    placeholder="Describe the agent you wnat to create..."
    className="min-h-24 w-full resize-none bg-transparent px-2 py-2 text-sm text-gray-900 outline-none transition-colors duration-300 placeholder:text-gray-400 dark:text-purple-50 dark:placeholder:text-purple-300/40"
  />

  <div className="flex items-center justify-between">
    <div>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="cursor-pointer text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-900 dark:text-purple-200 dark:hover:bg-purple-950/40 dark:hover:text-purple-50"
      >
        <Plus />
      </Button>
    </div>

    <div>
      <Button
        disabled={loading}
        onClick={onSubmitHandle}
        size={"icon"}
        className="size-9 cursor-pointer rounded-full bg-purple-600 text-white transition-all duration-300 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 dark:hover:shadow-lg dark:hover:shadow-purple-950/50"
      >
        {loading ? (
          <Loader className="animate-spin text-white" />
        ) : (
          <ArrowUp />
        )}
      </Button>
    </div>
  </div>
</div>
      <div className="mt-3 flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
        {quickSuggesionButton.map((item, i) => (
          <SuggesionButton
            key={i}
            label={item.lable}
            prompt={item.prompt}
            setPrompt={setPromptCallback}
          />
        ))}
      </div>
      {loading ? (
        <div className="flex gap-2 md:gap-5 items-center p-5 mt-7 border rounded-xl  border-gray-300 shadow-md cursor-pointer  hover:shadow-xl ">
          <Loader2Icon className="animate-spin " />
          <h1 className=" text-base md:text-xl font-semibold">
            Generating Agent Config ...{" "}
          </h1>
        </div>
      ) : (
        !configResult && (
          <div className="mt-10">
            <h1 className="flex justify-between text-xl items-center  font-semibold ">
              Get Started{" "}
              <span className="text-sm cursor-pointer font-medium ">
                View All
              </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
              {templetsData.length > 0 &&
                templetsData.map((item, i) => (
                  <div
                    key={i}
                    className={`border rounded-2xl p-5 hover:${item.glow} cursor-pointer hover:shadow-xl ${item.border} hover:scale-105 duration-400 hover:-translate-y-2 transition-transform dark:bg-black/30  `}
                  >
                    <Templet
                      Icon={item.icon}
                      iconBg={item.iconBG}
                      iconColor={item.iconColor}
                      title={item.title}
                      description={item.description}
                    />
                  </div>
                ))}
            </div>
          </div>
        )
      )}

      {configResult && configResult.status === "needs_clarification" && (
        <div className="p-5 border rounded-2xl">
          <AgentQuestionary
            onComplete={(res) => onComplete(res)}
            questionList={configResult.clarificationQuestions}
          />
        </div>
      )}

      {createdAgent &&
        !loading &&
        (statusLoading ? (
          <NewAgentCardSkeleton />
        ) : (
          <NewAgentCard
            setCloseEidtSheet={(v:boolean)=>setOpenEdit(v)}
            setSelectAgentToUpdate={setSelectToUpdate}
            updateAgentStatus={updateAgentStatus}
            createdAgent={createdAgent}
            setUpdatedAgent={(updatedValue: CreateAgentType) =>
              setCreatedAgent(updatedValue)
            }
            onDelete={() => setAgentDeleteAlert(true)}
          />
        ))}

      {agentDeleteAlert && (
        <DeleteAgent
          openAlert={agentDeleteAlert}
          agent={createdAgent}
          onClose={() => setAgentDeleteAlert(false)}
          onDeleted={() => {
            setCreatedAgent(null);
            setConfigResult(null);
          }}
        />
      )}

      {openEdit && (
        <EditAgentCard createdAgent={selectToUpdate} setUpdatedAgent={setSelectToUpdate} openSheet_={openEdit} closeSheet={(v:boolean)=> setOpenEdit(false)} />
      )}
    </div>
  );
};

export default CreateAgents;
