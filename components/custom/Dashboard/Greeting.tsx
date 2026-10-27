"use client";

import { UserDetailContext } from "@/context/UserDetailContext";

import CurrentTime from "@/hooks/CurentTime";

import {
  CalendarClockIcon,
  CheckCircle2,
  Clock,
  RefreshCcw,
  TriangleAlert,
  Zap,
} from "lucide-react";

import { useContext } from "react";

import StatsCard from "../Agents/SubComponents/DashboardSubComponents/StatsCard";

import { DashboardData } from "../../../lib/types";

import DashboardStatsCardSkeleton from "../Agents/skeleton/DashboardStatsCard";

const getGreeting = () => {
  const hour = new Date().getHours();

  return hour < 12 && hour >= 4
    ? "Good Morning"
    : hour < 17 && hour >= 12
      ? "Good Afternoon"
      : hour < 20 && hour >= 17
        ? "Good Evening"
        : "Good Night";
};

type Props = {
  dashboardData: DashboardData | null;
  loading: boolean;
  userData: any;
  handleButton: any;
};

const Greeting = ({
  dashboardData,
  loading,
  userData,
  handleButton,
}: Props) => {
  const statsCards = [
    {
      bgColor: "bg-green-100 dark:bg-green-950/40",
      borderColor: "border-green-600 dark:border-green-500",
      iconBgColor: "bg-green-300 dark:bg-green-900",
      iconColor: "text-green-800 dark:text-green-300",
      count: dashboardData?.completed,
      type: "Completed",
      desc: "finished runs",
      icon: CheckCircle2,
    },
    {
      bgColor: "bg-orange-100 dark:bg-orange-950/40",
      borderColor: "border-orange-600 dark:border-orange-500",
      iconBgColor: "bg-orange-300 dark:bg-orange-900",
      iconColor: "text-orange-800 dark:text-orange-300",
      count: dashboardData?.running,
      type: "Running",
      desc: "active agents",
      icon: Zap,
    },
    {
      bgColor: "bg-yellow-100 dark:bg-yellow-950/40",
      borderColor: "border-yellow-600 dark:border-yellow-500",
      iconBgColor: "bg-yellow-300 dark:bg-yellow-900",
      iconColor: "text-yellow-800 dark:text-yellow-300",
      count: dashboardData?.scheduled,
      type: "Scheduled",
      desc: "coming up",
      icon: CalendarClockIcon,
    },
    {
      bgColor: "bg-red-100 dark:bg-red-950/40",
      borderColor: "border-red-600 dark:border-red-500",
      iconBgColor: "bg-red-300 dark:bg-red-900",
      iconColor: "text-red-800 dark:text-red-300",
      count: dashboardData?.failed,
      type: "Attention",
      desc: "need review",
      icon: TriangleAlert,
    },
  ];

  return (
    <div
      className="
        flex flex-col px-3 py-2 justify-center
        border
        bg-blue-50 dark:bg-[#100A1F]
        border-blue-100 dark:border-gray-800
        pb-5
        rounded-xl
        shadow-md shadow-blue-100 dark:shadow-black/20
        text-gray-900 dark:text-gray-100
        transition-colors duration-300
      "
    >
      <div
        className="
          flex flex-col sm:flex-row gap-2 sm:gap-0
          items-start sm:items-center
          justify-center sm:justify-between
        "
      >
        <div className="flex items-center justify-start gap-2">
          <Clock className="size-5 text-blue-500 dark:text-blue-400 transition-colors duration-300" />

          <h1 className="text-gray-900 dark:text-gray-300 transition-colors duration-300">
            <CurrentTime />
          </h1>
        </div>

        <button
          onClick={handleButton}
          className="
            flex items-center gap-3 justify-center
            border
            px-3 py-1
            rounded-xl
            bg-white dark:bg-[#170D29] 
            border-gray-200 dark:border-[#302044] dark:shadow-purple-950
            text-gray-900 dark:text-gray-100
            shadow-md
            hover:shadow-2xl
            hover:scale-105
            cursor-pointer
            transition-all duration-300
            hover:-translate-y-1
          "
        >
          <RefreshCcw className="size-4" />
          <h1>Refresh briefing</h1>
        </button>
      </div>

      <div className="flex flex-col items-start justify-center mt-5">
        <h1
          className="
            text-2xl md:text-4xl
            font-serif font-bold
            text-gray-900 dark:text-white
            transition-colors duration-300
          "
        >
          {getGreeting()}, {userData?.name?.split(" ")[0] ?? "Guest"}
        </h1>

        <p
          className="
            text-sm md:text-lg
            text-gray-700 dark:text-gray-400
            transition-colors duration-300
          "
        >
          Here's the latest pulse from your agents, runs, schedules, andanything
          that needs a closer look.
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <DashboardStatsCardSkeleton key={i} />
          ))}

        {!loading &&
          statsCards.map((card) => (
            <StatsCard
              key={card.type}
              bgColor={card.bgColor}
              borderColor={card.borderColor}
              iconBgColor={card.iconBgColor}
              iconColor={card.iconColor}
              count={card.count}
              type={card.type}
              desc={card.desc}
              icon={card.icon}
            />
          ))}
      </div>
    </div>
  );
};

export default Greeting;