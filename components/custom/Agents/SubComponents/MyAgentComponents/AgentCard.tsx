import React from "react";
import {
  BotMessageSquareIcon,
  CalendarCheck,
  Dot,
  Edit2,
  Ellipsis,
  Pause,
  Play,
  PlaySquareIcon,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreateAgentType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import AgentCardSkeleton from "../../skeleton/AgentCardSkeleton";
import { useTheme } from "@/context/ThemeContext";

type Prop = {
  currentData: CreateAgentType;
  setSelectedAgent: (agent: CreateAgentType) => void;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setChatOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  updateAgent: () => void;
  selectForUpdate: CreateAgentType | null;
  updateLoading: boolean;
  runAgent: any;
  setSelectAgentRun: any;
};

const AgentCard = ({
  setSelectAgentRun,
  runAgent,
  updateAgent,
  currentData,
  setSelectedAgent,
  setOpenSheet,
  setChatOpenSheet,
  setOpenAlert,
  selectForUpdate,
  updateLoading = false,
}: Prop) => {
  const { theme } = useTheme();
  const isActive = currentData.status === "active";

  if (currentData.id === selectForUpdate?.id && updateLoading)
    return <AgentCardSkeleton />;

  return (
    <div className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl dark:border-[#302044] dark:bg-[#170D29] dark:shadow-violet-950">

  {/* Header */}
  <div className="flex w-full items-center justify-between">

    <div className="relative flex items-center justify-center rounded-md border border-gray-300 bg-gray-200 p-1 transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F]">
      <img
        src={currentData.agentImage?.toString()}
        alt={currentData.agentId}
        className="size-10"
      />

      <Dot
        className={`absolute -bottom-7 -right-7 size-15 ${
          isActive
            ? "text-green-500 dark:text-green-400"
            : "text-gray-400 dark:text-gray-600"
        }`}
      />
    </div>

 <DropdownMenu>
  <DropdownMenuTrigger
    render={
      <Button
        variant="ghost"
        className="
          cursor-pointer
          text-gray-600
          hover:bg-gray-100
          hover:text-gray-900
          transition-colors duration-300
          dark:text-purple-200
          dark:hover:bg-purple-950/40
          dark:hover:text-purple-50
          
        "
        size="icon"
      />
    }
  >
    <Ellipsis className="size-4" />
  </DropdownMenuTrigger>

 <DropdownMenuContent
  data-theme={theme}
  className="
    border-gray-200
    bg-white
    text-gray-900
    shadow-lg
    transition-colors
    duration-300

    data-[theme=dark]:border-[#302044]
    data-[theme=dark]:bg-[#170D29]
    data-[theme=dark]:text-purple-50
    data-[theme=dark]:shadow-purple-950/30
  "
>
    <DropdownMenuGroup>
      {/* RUN */}
      <DropdownMenuItem
        onClick={() => {
          setSelectAgentRun(currentData);
          runAgent();
        }}
        className="
          text-gray-700
          transition-colors duration-200
          focus:bg-gray-100
          focus:text-gray-900
          dark:hover:text-purple-50
          dark:text-purple-100
          dark:focus:bg-purple-950/50
          dark:focus:text-purple-50
        "
      >
        <Play className="text-gray-600 dark:text-purple-300" />
        Run New
      </DropdownMenuItem>

      {/* PAUSE / ACTIVATE */}
      <DropdownMenuItem
        onClick={() => {
          setSelectedAgent(currentData);
          updateAgent();
        }}
        className="
          text-gray-700
          transition-colors duration-200
          focus:bg-gray-100
          focus:text-gray-900

          dark:text-purple-100
          dark:focus:bg-purple-950/50
          dark:focus:text-purple-50
        "
      >
        {isActive ? (
          <>
            <Pause className="text-gray-600 dark:text-purple-300" />
            Pause Agent
          </>
        ) : (
          <>
            <PlaySquareIcon className="text-gray-600 dark:text-purple-300" />
            Activate Agent
          </>
        )}
      </DropdownMenuItem>

      {/* EDIT */}
      <DropdownMenuItem
        onClick={() => {
          setSelectedAgent(currentData);
          setOpenSheet(true);
        }}
        className="
          text-gray-700
          transition-colors duration-200
          focus:bg-gray-100
          focus:text-gray-900

          dark:text-purple-100
          dark:focus:bg-purple-950/50
          dark:focus:text-purple-50
        "
      >
        <Edit2 className="text-gray-600 dark:text-purple-300" />
        Edit Agent
      </DropdownMenuItem>
    </DropdownMenuGroup>

    <DropdownMenuSeparator
      className="
        bg-gray-200
        dark:bg-[#302044]
      "
    />

    {/* DELETE */}
    <DropdownMenuGroup>
      <DropdownMenuItem
        variant="destructive"
        onClick={() => {
          setSelectedAgent(currentData);
          setOpenAlert(true);
        }}
        className="
          text-red-600
          transition-colors duration-200
          focus:bg-red-50
          focus:text-red-700

          dark:text-red-400
          dark:focus:bg-red-950/50
          dark:focus:text-red-300
        "
      >
        <Trash2 className="text-red-600 dark:text-red-400" />
        Delete Agent
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
  </div>

  {/* Agent Name + Status */}
  <div className="mt-3 flex w-full items-center justify-between">

    <h1 className="line-clamp-1 text-xl font-bold text-gray-900 transition-colors duration-300 dark:text-purple-50">
      {currentData.name}
    </h1>

    <div
      className={`flex items-center justify-center rounded-xl border px-2 transition-all duration-200 hover:scale-105 hover:shadow-xl ${
        isActive
          ? "border-green-700 bg-green-200 text-green-600 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300"
          : "border-gray-400 bg-yellow-200 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300"
      }`}
    >
      {currentData.status}
    </div>
  </div>

  {/* Description */}
  <p className="line-clamp-1 text-sm text-muted-foreground transition-colors duration-300 dark:text-purple-200/60">
    {currentData.description}
  </p>

  {/* Schedule */}
  <div className="mt-3 flex items-center justify-start gap-1 px-2 text-gray-500 transition-colors duration-300 dark:text-purple-300/70">
    <CalendarCheck className="size-5" />

    <p className="mt-1">
      {currentData.schedule?.type==="recurring"
        ? `${currentData.schedule.frequency
            .charAt(0)
            .toUpperCase()}${currentData.schedule.frequency.slice(1)}`
        : `${currentData.schedule.type
            .charAt(0)
            .toUpperCase()}${currentData.schedule.type.slice(1)}` || ""}

      {currentData.schedule?.time && " at "}

      {currentData.schedule?.time || ""}
    </p>
  </div>

  {/* Actions */}
  <div className="mt-5 flex w-full flex-col items-center justify-center gap-2 border-t border-gray-200 pt-5 transition-colors duration-300 dark:border-[#302044] lg:flex-row">

    <button
      onClick={() => {
        setSelectAgentRun(currentData);
        runAgent();
      }}
      type="button"
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-400 bg-green-300 px-2 py-2 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-300 active:scale-95 dark:border-green-700 dark:bg-green-950/60 dark:hover:bg-green-900/60 dark:hover:shadow-green-900/30"
    >
      <Play className="size-5 text-green-900 dark:text-green-300" />
      <span className="text-lg font-medium text-green-900 dark:text-green-300">
        Run Agent
      </span>
    </button>

    <button
      onClick={() => {
        setSelectedAgent(currentData);
        setChatOpenSheet(true);
      }}
      type="button"
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 px-2 py-2 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-200 active:scale-95 dark:bg-purple-700 dark:hover:bg-purple-600 dark:hover:shadow-purple-950/50"
    >
      <BotMessageSquareIcon className="size-5 text-white" />

      <span className="text-lg font-medium text-white">
        Chat Agent
      </span>
    </button>

  </div>
</div>
  );
};

export default AgentCard;
