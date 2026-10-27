"use client";

import { toast } from "@/components/ui/toast";
import { CreateAgentType } from "@/lib/types";
import axios from "axios";
import { LoaderIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AgentCard from "./SubComponents/MyAgentComponents/AgentCard";
import EditAgentCard from "./GlobalAgentsComponents/EditAgentCard";
import ChatAgentDrawer from "./SubComponents/MyAgentComponents/ChatAgentDrawer";
import DeleteAgent from "./GlobalAgentsComponents/DeleteAgent";
import AgentCardSkeleton from "./skeleton/AgentCardSkeleton";

const MyAgents = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [agents, setAgents] = useState<CreateAgentType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgentForUpdate, setSelectedAgentForUpdate] =
    useState<CreateAgentType | null>(null);
  const [openEditAgentSheet, setOpenEditAgentSheet] = useState(false);
  const [openChatDrawer, setChatDrawer] = useState(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [selectAgentRun, setSelectAgentRun] = useState(null);

  const fetchAllMyAgents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get("/api/agent/config", {
        params: {
          page,
          limit,
        },
      });

      if (!data?.success) {
        throw new Error(data?.error || "Failed to fetch agents");
      }

      setAgents(data.data || []);
      setTotalPages(data.pagination?.totalPages || 0);
    } catch (error: any) {
      console.error("Fetch agents error:", error);

      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong while fetching agents.";

      setError(message);

      toast.add({
        type: "error",
        title: "Failed to fetch agents",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMyAgents();
  }, [page]);
  const updateAgentStatus = async () => {
    if (!selectedAgentForUpdate?.id) return;
    setUpdateLoading(true);

    const newStatus =
      selectedAgentForUpdate.status === "active" ? "pause" : "active";

    try {
      const { data } = await axios.put("/api/agent/config", {
        updatedData: {
          ...selectedAgentForUpdate,
          status: newStatus,
        },
      });

      if (!data?.success) {
        throw new Error(data?.error || "Failed to update agent status");
      }

      // Update selected agent
      setSelectedAgentForUpdate((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
            }
          : null,
      );

      // Update agent in current page immediately
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.id === selectedAgentForUpdate.id
            ? {
                ...agent,
                status: newStatus,
              }
            : agent,
        ),
      );

      toast.add({
        type: "success",
        title: newStatus === "active" ? "Agent activated" : "Agent paused",
        description:
          newStatus === "active"
            ? `"${selectedAgentForUpdate.name}" is now active.`
            : `"${selectedAgentForUpdate.name}" has been paused.`,
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
      setUpdateLoading(false);
    }
  };

  const runAgent = async () => {
    console.log("called");

    if (!selectAgentRun) return;

    try {
      const response = await axios.post("/api/agent/run/manully", {
        agentConfigData: selectAgentRun,
      });

      const data = response.data;

      if (data.success) {
        toast.add({
          type: "success",
          title: data.message || "Agent execution queued",
        });
      } else {
        toast.add({
          type: "error",
          title:
            data.message || data.error || "Failed to queue agent execution",
        });
      }
    } catch (error: any) {
      console.log("Run agent error:", error);

      toast.add({
        type: "error",
        title:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to queue agent execution",
      });
    } finally {
      setSelectAgentRun(null);
    }
  };
  return (
    <div className="mt-5 w-full h-full ">
      <div className="pb-5">
        <h2 className="text-2xl font-semibold tracking-tight dark:text-gray-200">
          My Agents
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Run, manage and update all the agents you're created.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3 items-center justify-center ">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <AgentCardSkeleton key={i} />
            ))
          : agents.length > 0 &&
            agents.map((data) => (
              <AgentCard
                setSelectAgentRun={setSelectAgentRun}
                runAgent={runAgent}
                selectForUpdate={selectedAgentForUpdate}
                updateLoading={updateLoading}
                updateAgent={updateAgentStatus}
                setOpenAlert={setOpenAlert}
                setChatOpenSheet={setChatDrawer}
                key={data.id}
                setOpenSheet={setOpenEditAgentSheet}
                currentData={data}
                setSelectedAgent={setSelectedAgentForUpdate}
              />
            ))}
      </div>

      {!loading && !error && agents.length === 0 && (
        <p className="text-gray-600 dark:text-purple-300">No agents found.</p>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex w-full justify-center py-4">
          <Pagination>
            <PaginationContent className="gap-1 sm:gap-2">
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) {
                      setPage((prev) => prev - 1);
                    }
                  }}
                  className={`
              cursor-pointer
              transition-all duration-200
              hover:-translate-x-1
              hover:bg-purple-50
              hover:text-purple-600
              active:scale-95

              dark:text-purple-200
              dark:hover:bg-[#2A1245]
              dark:hover:text-purple-50

              ${page === 1 ? "pointer-events-none opacity-40" : ""}
            `}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                .map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNumber);
                      }}
                      className={`
                  cursor-pointer
                  min-w-9
                  transition-all duration-200
                  hover:scale-105
                  active:scale-95

                  ${
                    page === pageNumber
                      ? `
                        bg-purple-600
                        text-white
                        hover:bg-purple-700
                        hover:text-white
                        shadow-md
                        shadow-purple-200

                        dark:bg-[#6D28D9]
                        dark:text-white
                        dark:hover:bg-[#7C3AED]
                        dark:hover:text-white
                        dark:shadow-[0_0_12px_rgba(109,40,217,0.35)]
                      `
                      : `
                        text-gray-700
                        hover:bg-purple-50
                        hover:text-purple-600

                        dark:text-purple-200
                        dark:hover:bg-[#2A1245]
                        dark:hover:text-purple-50
                      `
                  }
                `}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {/* Ellipsis */}
              {page + 2 < totalPages && (
                <PaginationItem className="hidden sm:block">
                  <PaginationEllipsis className="text-gray-500 dark:text-purple-300" />
                </PaginationItem>
              )}

              {/* Last page */}
              {page + 2 < totalPages && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(totalPages);
                    }}
                    className="
                cursor-pointer
                text-gray-700
                transition-all duration-200
                hover:scale-105
                hover:bg-purple-50
                hover:text-purple-600
                active:scale-95

                dark:text-purple-200
                dark:hover:bg-[#2A1245]
                dark:hover:text-purple-50
              "
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) {
                      setPage((prev) => prev + 1);
                    }
                  }}
                  className={`
              cursor-pointer
              transition-all duration-200
              hover:translate-x-1
              hover:bg-purple-50
              hover:text-purple-600
              active:scale-95

              dark:text-purple-200
              dark:hover:bg-[#2A1245]
              dark:hover:text-purple-50

              ${page === totalPages ? "pointer-events-none opacity-40" : ""}
            `}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {openEditAgentSheet && (
        <EditAgentCard
          createdAgent={selectedAgentForUpdate}
          setUpdatedAgent={() => fetchAllMyAgents()}
          openSheet_={openEditAgentSheet}
          closeSheet={(v: boolean) => setOpenEditAgentSheet(v)}
        />
      )}
      {openChatDrawer && (
        <ChatAgentDrawer
          agent={selectedAgentForUpdate}
          openSheet_={openChatDrawer}
          closeSheet={(v: boolean) => setChatDrawer(v)}
        />
      )}
      {openAlert && (
        <DeleteAgent
          openAlert={openAlert}
          onClose={() => setOpenAlert(false)}
          allAgents={agents}
          setAgents={setAgents}
          agent={selectedAgentForUpdate}
        />
      )}
    </div>
  );
};

export default MyAgents;
