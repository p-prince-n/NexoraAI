"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { AgentRunResponse, AgentRunType } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";

const StatsTable = () => {
  const [agentRunList, setAgentRunList] = useState<AgentRunType[]>([]);

  const [loadingAgentRun, setLoadingAgentRun] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchAgentRunLog = async (page: number, loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoadingAgentRun(true);
    }

    try {
      const response = await axios.post<AgentRunResponse>("/api/agentlog", {
        page,
      });

      if (!response.data.success) {
        toast.add({
          type: "error",
          title: response.data.message,
        });
        return;
      }

      const newRuns = response.data.data;
      const pagination = response.data.pagination;

      if (loadMore) {
        setAgentRunList((prev) => [...prev, ...newRuns]);
      } else {
        setAgentRunList(newRuns);
      }

      setCurrentPage(pagination.page);
      setHasNextPage(pagination.hasNextPage);
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error ? error.message : "Failed to fetch agent runs",
      });
    } finally {
      setLoadingAgentRun(false);
      setLoadingMore(false);
    }
  };
  useEffect(() => {
    fetchAgentRunLog(1);
  }, []);

  const handleShowMore = () => {
    if (!hasNextPage || loadingMore) return;

    fetchAgentRunLog(currentPage + 1, true);
  };

  const renderStatus = (status: string) => {
    return (
      <div
        className={`flex items-center w-auto justify-center gap-2 px-3  py-px rounded-xl ${status === "completed" ? "bg-green-200 text-green-600" : ["scheduled", "queued"].includes(status) ? "bg-yellow-200 text-yellow-600" : "bg-red-200 text-red-600"}`}
      >
        <div
          className={`size-1.5 rounded-full ${status === "completed" ? "bg-green-600" : ["scheduled", "queued"].includes(status) ? "bg-yellow-500 " : "bg-red-600 "}`}
        />
        <h1 className="text-sm font-normal">{status}</h1>
      </div>
    );
  };

  return (
    <div
      className="
    mt-5
    w-full
    rounded-2xl
    border
    border-gray-200
    bg-white
    py-4
    transition-colors duration-300

    dark:border-[#432663]
    dark:bg-[#1A0B2E]
  "
    >
      <Table>
        <TableCaption className="text-muted-foreground dark:text-purple-300/70">
          A list of your recent agent runs.
        </TableCaption>

        <TableHeader>
          <TableRow
            className="
          border-gray-200
          hover:bg-transparent
          dark:border-[#432663]
          dark:hover:bg-[#211038]
        "
          >
            <TableHead className="text-center text-gray-700 dark:text-purple-200">
              Agent
            </TableHead>

            <TableHead className="text-center text-gray-700 dark:text-purple-200">
              Task
            </TableHead>

            <TableHead className="text-center text-gray-700 dark:text-purple-200">
              Status
            </TableHead>

            <TableHead className="text-center text-gray-700 dark:text-purple-200">
              Updated
            </TableHead>

            <TableHead className="text-center text-gray-700 dark:text-purple-200">
              Result
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loadingAgentRun ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow
                key={index}
                className="border-gray-200 dark:border-[#302044]"
              >
                <TableCell className="py-4">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-24 dark:bg-[#321451]" />
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-40 dark:bg-[#321451]" />
                </TableCell>

                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="h-6 w-20 rounded-xl dark:bg-[#321451]" />
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-20 dark:bg-[#321451]" />
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-16 dark:bg-[#321451]" />
                </TableCell>
              </TableRow>
            ))
          ) : agentRunList.length === 0 ? (
            <TableRow className="dark:border-[#302044]">
              <TableCell
                colSpan={5}
                className="py-10 text-center text-muted-foreground dark:text-purple-300/70"
              >
                No agent runs found.
              </TableCell>
            </TableRow>
          ) : (
            agentRunList.map((run) => (
              <TableRow
                key={run.id}
                className="
              cursor-pointer
              border-gray-200
              transition-colors duration-300
              hover:bg-purple-50

              dark:border-[#302044]
              dark:hover:bg-[#211038]
            "
              >
                <TableCell
                  className="
                max-w-30
                truncate
                py-4
                text-center
                font-medium
                text-gray-800
                dark:text-purple-50
              "
                >
                  {run.agentName ?? "Unknown Agent"}
                </TableCell>

                <TableCell
                  className="
                max-w-50
                truncate
                text-gray-700
                dark:text-purple-200
              "
                >
                  {run.agentDescription ?? "-"}
                </TableCell>

                <TableCell className="w-20">
                  {renderStatus(run.status)}
                </TableCell>

                <TableCell className="text-center text-gray-600 dark:text-purple-300/80">
                  {run.completedAt
                    ? moment(run.completedAt).fromNow()
                    : moment(run.createdAt).fromNow()}
                </TableCell>

                <TableCell className="text-center">
                  <div
                    className={`
                  inline-flex
                  cursor-pointer
                  items-center
                  text-xs
                  font-medium
                  transition-all
                  duration-300

                  ${
                    run.error
                      ? "text-red-600 hover:scale-125 hover:underline dark:text-red-400"
                      : run.output
                        ? "text-green-600 hover:scale-125 hover:underline dark:text-green-400"
                        : "text-muted-foreground dark:text-purple-300/70"
                  }
                `}
                  >
                    {run.error ? "Failed" : run.output ? "Available" : "-"}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Show More */}
      {hasNextPage && !loadingAgentRun && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={handleShowMore}
            disabled={loadingMore}
            className="
          rounded-lg
          border
          border-gray-200
          bg-white
          px-5
          py-2
          text-sm
          text-gray-700
          transition-all
          duration-300

          hover:bg-purple-50
          hover:text-purple-700

          dark:border-[#432663]
          dark:bg-[#24103D]
          dark:text-purple-200
          dark:hover:border-[#6D28D9]
          dark:hover:bg-[#321451]
          dark:hover:text-purple-50

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
          >
            {loadingMore ? "Loading..." : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default StatsTable;
