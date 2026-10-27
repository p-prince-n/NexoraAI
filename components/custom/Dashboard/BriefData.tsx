"use client";

import { Bot, CheckCircle2, Sparkles, TriangleAlert, Zap } from "lucide-react";
import { DashboardData, BriefData as BriefDataType } from "../../../lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  dashboardData: DashboardData | null;
  dloading: boolean;
};

const BriefData = ({ dashboardData, dloading }: Props) => {
  const [briefData, setBriefData] = useState<BriefDataType | null>(null);
  const [briefLoading, setBriefLoading] = useState(true);

  const statsData = [
    {
      icon: CheckCircle2,
      textColor: "text-green-600 dark:text-green-300",
      bgColor: "bg-green-100 dark:bg-green-950/40",
      count: dashboardData?.completed ?? 0,
      title: "completed",
    },
    {
      icon: Zap,
      textColor: "text-blue-600 dark:text-blue-300",
      bgColor: "bg-blue-100 dark:bg-blue-950/40",
      count: dashboardData?.running ?? 0,
      title: "running",
    },
    {
      icon: TriangleAlert,
      textColor: "text-yellow-600 dark:text-yellow-300",
      bgColor: "bg-yellow-100 dark:bg-yellow-950/40",
      count: dashboardData?.failed ?? 0,
      title: "needs attention",
    },
  ];
  // Fetch existing brief
  const fetchBriefingData = async () => {
    try {
      const res = await axios.get("/api/dashboard/brief");

      console.log("Fetch brief response:", res.data);

      if (!res.data?.success) {
        setBriefData(null);
        return false;
      }

      // Your API returns:
      // { success: true, brief: {...} }
      const data = res.data.brief;

      // Brief already exists
      if (data?.brief) {
        setBriefData(data);
        return true;
      }

      // No brief exists
      return false;
    } catch (error) {
      console.error("Failed to fetch briefing:", error);
      setBriefData(null);
      return false;
    }
  };

  // Trigger generation and wait for Inngest to save it
  const generateBrief = async () => {
    try {
      console.log("Generating dashboard brief...");

      await axios.post("/api/dashboard/brief/generate");

      // Inngest runs asynchronously.
      // Check every 2 seconds.
      for (let attempt = 0; attempt < 15; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log(`Checking generated brief: ${attempt + 1}/15`);

        try {
          const res = await axios.get("/api/dashboard/brief");

          if (!res.data?.success) {
            continue;
          }

          const data = res.data.brief;

          if (data?.brief) {
            console.log("Brief generated successfully:", data);

            setBriefData(data);

            return true;
          }
        } catch (pollError) {
          console.error(
            `Brief polling attempt ${attempt + 1} failed:`,
            pollError,
          );
        }
      }

      console.log("Brief generation timeout");

      return false;
    } catch (error) {
      console.error("Failed to generate brief:", error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadBrief = async () => {
      setBriefLoading(true);

      try {
        const existingBrief = await fetchBriefingData();

        // If brief already exists, don't generate again
        if (existingBrief) {
          return;
        }

        // No brief in database → generate one
        if (mounted) {
          await generateBrief();
        }
      } catch (error) {
        console.error("Failed to load dashboard brief:", error);
      } finally {
        if (mounted) {
          setBriefLoading(false);
        }
      }
    };

    loadBrief();

    return () => {
      mounted = false;
    };
  }, []);

  console.log("briefData:", briefData);

  return (
    <div
      className="
      relative mt-6 w-full overflow-hidden rounded-2xl border
      bg-white dark:bg-[#100A1F]
      border-gray-200 dark:border-[#302044]
      px-4 py-6 shadow-xl
      shadow-gray-200/50 dark:shadow-purple-950/20
      sm:mt-8 sm:px-6 sm:py-7 lg:px-7
      transition-colors duration-500 ease-in-out
    "
    >
      {/* Gradient top line */}
      <div className="absolute left-0 top-0 h-1.5 w-full bg-linear-to-r from-green-500 via-blue-500 via-purple-500 to-orange-500" />

      <div className="flex w-full flex-col gap-5">
        {/* ================= HEADER ================= */}
        <div className="flex w-full items-start gap-3">
          {/* AI Icon */}
          <div
            className="
            flex size-11 shrink-0 items-center justify-center rounded-xl
            bg-blue-100 dark:bg-purple-900/40
            transition-colors duration-500
            sm:size-12
          "
          >
            {briefLoading ? (
              <Bot
                className="
                size-6 animate-bounce
                text-blue-700 dark:text-purple-300
                transition-colors duration-500
                sm:size-7
              "
              />
            ) : (
              <Sparkles
                className="
                size-6
                text-blue-800 dark:text-purple-300
                transition-colors duration-500
                sm:size-7
              "
              />
            )}
          </div>

          {/* Heading */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1
                className="
                text-lg font-bold tracking-tight
                text-gray-900 dark:text-purple-50
                transition-colors duration-500
                sm:text-xl
              "
              >
                Your AI Briefing
              </h1>

              {/* Generated time */}
              {!briefLoading && briefData?.generatedAt && (
                <div
                  className="
                  rounded-full px-2.5 py-1
                  text-[10px] font-semibold sm:text-xs
                  bg-gray-100 dark:bg-purple-900/40
                  text-gray-600 dark:text-purple-300
                  transition-colors duration-500
                "
                >
                  Updated {moment(briefData.generatedAt).fromNow()}
                </div>
              )}

              {/* Loading badge */}
              {briefLoading && (
                <div
                  className="
                  flex items-center gap-1.5 rounded-full
                  px-2.5 py-1
                  text-[10px] font-semibold sm:text-xs
                  bg-blue-50 dark:bg-purple-900/30
                  text-blue-600 dark:text-purple-300
                  transition-colors duration-500
                "
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-blue-500 dark:bg-purple-400" />
                  Generating briefing
                </div>
              )}
            </div>

            <p
              className="
              mt-1 text-xs sm:text-sm
              text-gray-500 dark:text-purple-200/60
              transition-colors duration-500
            "
            >
              AI-generated summary of your recent agent activity.
            </p>
          </div>
        </div>

        {/* ================= AI BRIEF ================= */}
        <div className="w-full">
          {briefLoading ? (
            /* BRIEF LOADING */
            <div
              className="
              flex w-full items-start gap-3 rounded-xl border
              border-blue-100 dark:border-purple-800/40
              bg-blue-50/60 dark:bg-purple-950/30
              p-4 sm:p-5
              transition-colors duration-500
            "
            >
              <div
                className="
                flex size-9 shrink-0 items-center justify-center rounded-full
                bg-blue-100 dark:bg-purple-900/50
                transition-colors duration-500
                sm:size-10
              "
              >
                <Bot
                  className="
                  size-5 animate-bounce
                  text-blue-700 dark:text-purple-300
                  transition-colors duration-500
                "
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className="
                    text-sm font-semibold
                    text-blue-800 dark:text-purple-200
                    transition-colors duration-500
                  "
                  >
                    Nexora AI is preparing your briefing
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="size-1.5 animate-bounce rounded-full bg-blue-500 dark:bg-purple-400 [animation-delay:-0.3s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-blue-500 dark:bg-purple-400 [animation-delay:-0.15s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-blue-500 dark:bg-purple-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton
                    className="
      h-3 w-full max-w-3xl rounded-md
      bg-gray-200
      dark:bg-[#2A1245]
    "
                  />
                  <Skeleton
                    className="
      h-3 w-[90%] max-w-2xl rounded-md
      bg-gray-200
      dark:bg-[#2A1245]
    "
                  />
                  <Skeleton
                    className="
      h-3 w-[70%] max-w-xl rounded-md
      bg-gray-200
      dark:bg-[#321451]
    "
                  />
                </div>
              </div>
            </div>
          ) : briefData?.brief ? (
            <div
              className="
              rounded-xl border
              border-gray-100 dark:border-purple-800/40
              bg-gray-50/70 dark:bg-[#170D29]
              p-4 sm:p-5
              transition-colors duration-500
            "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                  min-w-0 whitespace-pre-line
                  text-sm leading-6 sm:text-[15px]
                  text-gray-700 dark:text-purple-100/80
                  transition-colors duration-500
                "
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {briefData.brief}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="
              rounded-xl border border-dashed
              border-gray-200 dark:border-purple-800/40
              bg-gray-50 dark:bg-purple-950/20
              p-4 text-sm
              text-gray-500 dark:text-purple-200/60
              transition-colors duration-500
            "
            >
              No AI briefing is available yet.
            </div>
          )}
        </div>

        <div className="grid w-full grid-cols-1 gap-2 min-[400px]:grid-cols-3 sm:flex sm:flex-wrap sm:gap-3">
          {dloading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="
                  flex min-h-9 items-center justify-center gap-2
                  rounded-xl border
                  bg-white dark:bg-[#170D29]
                  border-gray-200 dark:border-purple-800/40
                  px-3 py-2
                  transition-colors duration-500
                "
                >
                  <Skeleton className="size-4 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              ))
            : statsData.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`
                    flex min-w-0 items-center justify-center gap-2
                    rounded-xl px-3 py-2
                    ${item.bgColor}
                    ${item.textColor}
                    transition-colors duration-500
                  `}
                  >
                    <Icon className="size-4 shrink-0" />

                    <p className="truncate text-xs font-semibold sm:text-sm">
                      {item.count} {item.title}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default BriefData;
