"use client";

import BriefData from "@/components/custom/Dashboard/BriefData";
import Greeting from "@/components/custom/Dashboard/Greeting";

import LatestResultsCard from "@/components/custom/Agents/SubComponents/DashboardSubComponents/LatestResultsCard";
import SheduleNext from "@/components/custom/Agents/SubComponents/DashboardSubComponents/SheduleNext";

import ErrorRunCard from "@/components/custom/Agents/SubComponents/DashboardSubComponents/ErrorRunCard";
import RunningAgentCard from "@/components/custom/Agents/SubComponents/DashboardSubComponents/RunningAgentCard";

import DashboardRunSection from "@/components/custom/Dashboard/DashboardRunSection";

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";

import { DashboardData } from "@/lib/types";
import { UserDetailContext } from "@/context/UserDetailContext";

import {
  CalendarClockIcon,
  CircleCheck,
  Zap,
} from "lucide-react";

const DashboardPage = () => {
  const context = useContext(UserDetailContext);


  if (!context) {
    throw new Error(
      "YourComponent must be used inside UserDetailContext.Provider",
    );
  }

  const { userData } = context;


  const [logData, setLogData] = useState<DashboardData>({
    completed: 0,
    failed: 0,
    scheduled: 0,
    running: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [agentDetails, setAgentDetails] = useState({
    errorRuns: [],
    scheduleRuns: [],
    completedRuns: [],
    runningRuns: [],
  });

  const [loadingAgentDetails, setLoadingAgentDetails] = useState(true);
  const [agentDetailsError, setAgentDetailsError] = useState("");

  const fetchAgentDetails = async () => {
    // alert("called")
    if (!userData?.email) return;

    try {
      setLoadingAgentDetails(true);
      setAgentDetailsError("");

      const res = await axios.get("/api/dashboard/run-details", {
        params: {
          userEmail: userData.email,
        },
      });

      if (res.data?.success) {
        setAgentDetails(res.data.runsData);
      } else {
        setAgentDetailsError(
          res.data?.message || "Failed to fetch agent details",
        );
      }
    } catch (error: any) {
      console.error("Fetch agent details error:", error);

      setAgentDetailsError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch agent details",
      );
    } finally {
      setLoadingAgentDetails(false);
    }
  };

  useEffect(() => {
    if (userData?.email) {
      fetchAgentDetails();
    }
  }, [userData?.email]);

  const fetchLogDataForDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/api/dashboard");

      if (response.data.success) {
        setLogData(response.data.data);
      } else {
        setError(
          response.data.message || "Failed to fetch dashboard data",
        );
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Something went wrong while fetching dashboard data",
        );
      } else {
        setError("Something went wrong while fetching dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogDataForDashboard();
  }, []);

  useEffect(() => {
    if (error) {
      toast.add({
        title: error,
        type: "error",
        timeout: 2000,
      });
    }
  }, [error]);

  
 const dashboardSections = [
  {
    key: "errorRuns",
    title: "Needs your attention",
    emptyMessage: "There is no completed Task till last 1 days",
    icon: CircleCheck,
    listData: agentDetails.errorRuns,
    bgColor: "bg-red-100 dark:bg-red-950/40",
    textColor: "text-red-600 dark:text-red-300",
    borderColor: "border-red-500 dark:border-red-800",
    tileBgColor: "bg-red-100 dark:bg-red-950/40",
    tileTextColor: "text-red-600 dark:text-red-300",
    loaderText: "Fetching Error Runs ....",
    renderItem: (item: any) => (
      <ErrorRunCard
        agentName={item?.config?.name}
        time={item?.run?.completedAt}
        error={item?.run?.error ?? item?.run?.output?.error}
      />
    ),
  },

  {
    key: "runningRuns",
    title: "Running now",
    emptyMessage: "No agents running right now.",
    icon: Zap,
    listData: agentDetails.runningRuns,
    bgColor: "bg-blue-50 dark:bg-blue-950/40",
    textColor: "text-blue-600 dark:text-blue-300",
    borderColor: "border-blue-500 dark:border-blue-800",
    tileBgColor: "bg-blue-100 dark:bg-blue-950/40",
    tileTextColor: "text-blue-600 dark:text-blue-300",
    loaderText: "Fetching Currently Running Runs ....",
    renderItem: (item: any) => (
      <RunningAgentCard
        agentName={item?.config?.name}
        time={item?.run?.startedAt}
        instruction={item?.config?.objective}
      />
    ),
  },

  {
    key: "completedRuns",
    title: "Latest Results",
    emptyMessage: "There is no completed Task till last 1 days",
    icon: CircleCheck,
    listData: agentDetails.completedRuns,
    bgColor: "bg-green-100 dark:bg-green-950/40",
    textColor: "text-green-600 dark:text-green-300",
    borderColor: "border-green-500 dark:border-green-800",
    tileBgColor: "bg-green-100 dark:bg-green-950/40",
    tileTextColor: "text-green-600 dark:text-green-300",
    loaderText: "Fetching Completed Runs ....",
    renderItem: (item: any) => (
      <LatestResultsCard
        agentName={item?.config?.name}
        instruction={item?.run?.output?.finalOutput}
        time={item?.run?.completedAt}
        imgSrc={item?.config?.agentImage}
      />
    ),
  },

  {
    key: "scheduleRuns",
    title: "Up Next",
    emptyMessage: "There is no next scheduled",
    icon: CalendarClockIcon,
    listData: agentDetails.scheduleRuns,
    bgColor: "bg-yellow-100 dark:bg-yellow-950/40",
    textColor: "text-yellow-600 dark:text-yellow-300",
    borderColor: "border-yellow-500 dark:border-yellow-800",
    tileBgColor: "bg-yellow-100 dark:bg-yellow-950/40",
    tileTextColor: "text-yellow-600 dark:text-yellow-300",
    loaderText: "Fetching Schedule Runs ....",
    renderItem: (item: any) => (
      <SheduleNext
        agentName={item?.config?.name}
        time={item?.run?.scheduledFor}
      />
    ),
  },
];
 
  const sortedDashboardSections = [...dashboardSections].sort(
    (a, b) => a.listData.length - b.listData.length,
  );

  return (
    <div  className="flex w-full justify-center ">
      <div className="w-full max-w-7xl px-4 pt-5 pb-16 sm:px-6 ">

       
        <Greeting
        handleButton={ fetchLogDataForDashboard}
          userData={userData}
          loading={loading}
          dashboardData={logData}
        />

        {/* Dashboard Stats */}
        <BriefData
          dloading={loading}
          dashboardData={logData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-10 mt-10">
          {sortedDashboardSections.map((section) => (
            <DashboardRunSection
              key={section.key}
              title={section.title}
              emptyMessage={section.emptyMessage}
              icon={section.icon}
              listData={section.listData}
              loading={loadingAgentDetails}
              bgColor={section.bgColor}
              textColor={section.textColor}
              borderColor={section.borderColor}
              tileBgColor={section.tileBgColor}
              tileTextColor={section.tileTextColor}
              loaderText={section.loaderText}
              renderItem={section.renderItem}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;