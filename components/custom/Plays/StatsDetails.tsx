"use client"
import { toast } from "@/components/ui/toast";
import axios from "axios";
import React, { useEffect, useState } from "react";

type AgentRunStats = {
  completed: number;
  failed: number;
  scheduled: number;
};

type AgentRunStatsResponse = {
  success: boolean;
  message: string;
  data: AgentRunStats;
};

const StatsDetailes = () => {
  const [stats, setStats] = useState<AgentRunStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);

  const fetchStatsDetails = async () => {
    setLoadingStats(true);
    try {
      const response = await axios.get<AgentRunStatsResponse>("/api/agentlog");

      if (!response.data.success) {
        toast.add({
          type: "error",
          title: response.data.message,
        });
        return;
      }

      setStats(response.data.data);
    } catch (error: any) {
      toast.add({ type: "error", title: error instanceof Error? error.message : "Somthing went wrong" });
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStatsDetails();
  }, []);

  const statsdata = [
    { type: "Completed", count: stats?.completed, color: "bg-green-600" },
    { type: "Failed", count: stats?.failed, color: "bg-red-600" },
    { type: "Schedule", count: stats?.scheduled, color: "bg-blue-400" },
  ];
  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-5">
      {statsdata.map((item) => (
        <StatsData
          type={item.type}
          color={item.color}
          count={item.count ?? 0}
          key={item.type}
        />
      ))}
    </div>
  );
};

type StatsDataProps = {
  type: string;
  count: number;
  color: string;
};

const StatsData = ({ count, color, type }: StatsDataProps) => {
  return (
    <div
  className="
    flex
    justify-between
    items-center
    rounded-2xl
    border
    border-gray-200
    bg-white
    p-3
    text-gray-900
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-md

    dark:border-[#432663]
    dark:bg-[#1A0B2E]
    dark:text-purple-50
    dark:hover:border-[#6D28D9]
    dark:hover:bg-[#211038]
    dark:hover:shadow-[0_0_15px_rgba(109,40,217,0.2)]
  "
>
  <div className="flex items-center gap-1.5">
    <div className={`size-3 rounded-full ${color}`} />

    <h2 className="text-sm font-medium dark:text-purple-100">
      {type}
    </h2>
  </div>

  <h2 className="font-semibold text-gray-800 dark:text-purple-50">
    {count}
  </h2>
</div>
  );
};

export default StatsDetailes;
