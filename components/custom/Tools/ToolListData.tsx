"use client";

import { toast } from "@/components/ui/toast";
import { Integration } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import ToolCard from "./ToolCard";
import ToolCardSkeleton from "./skeleton/ToolCardSkeleton";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ToolList = () => {
  const [fetchToolLoading, setFetchToolLoading] = useState(false);

  const [toolDataList, setToolDataList] = useState<Integration[]>([]);

  // const [selectToolData, setSelectToolData] =
  //   useState<Integration | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Which tool is currently being connected/disconnected
  const [loadingToolSlug, setLoadingToolSlug] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 6,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchToolData = async (page: number) => {
    setFetchToolLoading(true);

    try {
      const res = await axios.get(`/api/integrations?page=${page}`);

      const data = res.data;

      if (!data.success) {
        toast.add({
          type: "error",
          title: data.message,
        });
        return;
      }

      setToolDataList(data.integrations);
      setPagination(data.pagination);
    } catch (error: any) {
      toast.add({
        type: "error",
        title: error.message || "Failed to fetch integrations",
      });
    } finally {
      setFetchToolLoading(false);
    }
  };

  useEffect(() => {
    fetchToolData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CONNECT TOOL
  // =========================
  const connectTool = async (tool: Integration) => {
    if (!tool?.slug) return;

    setLoadingToolSlug(tool.slug);

    try {
      const res = await axios.post("/api/integrations/connect", {
        slug: tool.slug,
      });

      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to connect tool");
      }

      const redirectUrl = data.redirectUrl;

      if (!redirectUrl) {
        throw new Error("No redirect URL received");
      }

      const popup = window.open(
        redirectUrl,
        "composio-oauth",
        "width=600,height=700,left=200,top=100,resizable=yes,scrollbars=yes",
      );

      if (!popup) {
        throw new Error("Popup was blocked by the browser");
      }

      toast.add({
        type: "success",
        title: "Connection started",
      });

      // Check OAuth popup
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);

          // Refresh integrations after OAuth is completed
          fetchToolData(currentPage);
          setLoadingToolSlug(null);
        }
      }, 500);
    } catch (error: any) {
      console.error("Failed to connect tool:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to connect tool";

      toast.add({
        type: "error",
        title: message,
      });

      setLoadingToolSlug(null);
    }
  };

  // =========================
  // DISCONNECT TOOL
  // =========================
  const disConnectTool = async (tool: Integration) => {
    const connectedAccountId = tool?.account?.id;

    if (!connectedAccountId || !tool?.slug) {
      toast.add({
        type: "error",
        title: "Connected account not found",
      });

      return;
    }

    setLoadingToolSlug(tool.slug);

    try {
      const res = await axios.delete("/api/integrations/connect", {
        data: {
          connectedAccountId,
        },
      });

      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to disconnect tool");
      }

      // Update only this tool locally
      setToolDataList((prev) =>
        prev.map((item) =>
          item.slug === tool.slug
            ? {
                ...item,
                connected: false,
                account: null,
              }
            : item,
        ),
      );

      toast.add({
        type: "success",
        title: "Tool disconnected successfully",
      });
    } catch (error: any) {
      console.error("Failed to disconnect tool:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to disconnect tool";

      toast.add({
        type: "error",
        title: message,
      });
    } finally {
      setLoadingToolSlug(null);
    }
  };

  // Loading
  if (fetchToolLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        {Array.from({ length: 6 }).map((_, index) => (
          <ToolCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // No data
  if (toolDataList.length === 0) {
    return (
      <div
        className="
    flex
    items-center
    justify-center
    rounded-xl
    border
    border-gray-200
    bg-gray-50
    py-10
    transition-colors duration-300

    dark:border-[#432663]
    dark:bg-[#1A0B2E]
  "
      >
        <p
          className="
      text-muted-foreground
      dark:text-purple-300/80
    "
        >
          No integrations found.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 w-full">
      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        {toolDataList.map((item) => (
          <ToolCard
            key={item.id}
            toolData={item}
            connectTool={connectTool}
            disConnectTool={disConnectTool}
            isLoading={loadingToolSlug === item.slug}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent className="gap-1">
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (pagination.hasPreviousPage) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={`
              transition-all duration-300

              ${
                !pagination.hasPreviousPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-purple-100 hover:text-purple-700"
              }

              dark:text-purple-300
              dark:hover:bg-[#2A1245]
              dark:hover:text-purple-50
            `}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1,
              ).map((page) => (
                <PaginationItem key={page}>
                  <button
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`
                inline-flex
                h-9
                min-w-9
                items-center
                justify-center
                rounded-md
                px-3
                text-sm
                font-medium
                transition-all
                duration-300

                ${
                  currentPage === page
                    ? `
                      bg-purple-600
                      text-white
                      shadow-sm
                      hover:bg-purple-700

                      dark:bg-[#6D28D9]
                      dark:text-white
                      dark:hover:bg-[#7C3AED]
                      dark:shadow-[0_0_12px_rgba(109,40,217,0.3)]
                    `
                    : `
                      text-gray-700
                      hover:bg-purple-100
                      hover:text-purple-700

                      dark:text-purple-300
                      dark:hover:bg-[#2A1245]
                      dark:hover:text-purple-50
                    `
                }
              `}
                  >
                    {page}
                  </button>
                </PaginationItem>
              ))}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (pagination.hasNextPage) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={`
              transition-all duration-300

              ${
                !pagination.hasNextPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-purple-100 hover:text-purple-700"
              }

              dark:text-purple-300
              dark:hover:bg-[#2A1245]
              dark:hover:text-purple-50
            `}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ToolList;
