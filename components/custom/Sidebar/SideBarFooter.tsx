import React, { useContext } from "react";

import { SidebarFooter } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { UserDetailContext } from "@/context/UserDetailContext";

const SideBarFooter = () => {
  const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error(
      "YourComponent must be used inside UserDetailContext.Provider",
    );
  }

  const { userData } = context;

  return (
    <SidebarFooter
      className="
    bg-white
    transition-colors duration-300

    dark:bg-[#10051C]
  "
    >
      {/* ================= Credits ================= */}
      {userData ? (
        <div
          className="
        flex
        flex-col
        gap-2
        rounded-lg
        border
        border-gray-200
        bg-white
        p-4
        shadow-md
        transition-all duration-300

        hover:shadow-lg

        dark:border-[#432663]
        dark:bg-[#1A0B2E]
        dark:shadow-[0_0_15px_rgba(109,40,217,0.12)]

        group-data-[collapsible=icon]:hidden
      "
        >
          <h2
            className="
          flex
          justify-between
          text-gray-800
          font-medium

          dark:text-purple-50
        "
          >
            Agents
            <span className="dark:text-purple-200">
              {userData.agentCredits}/5
            </span>
          </h2>

          <h2
            className="
          flex
          justify-between
          text-gray-600

          dark:text-purple-300
        "
          >
            Credits
            <span className="dark:text-purple-200">
              {userData.usageCredits}
            </span>
          </h2>

          <Progress
            className="
          bg-purple-100

          dark:bg-[#321451]
        "
            value={60}
          />
        </div>
      ) : (
        <div
          className="
        flex
        flex-col
        gap-2
        rounded-lg
        border
        border-gray-200
        bg-white
        p-4
        shadow-md
        transition-colors duration-300

        dark:border-[#432663]
        dark:bg-[#1A0B2E]

        group-data-[collapsible=icon]:hidden
      "
        >
          <div className="flex justify-between">
            <Skeleton
              className="
            h-4
            w-16
            bg-gray-200

            dark:bg-[#2A1245]
          "
            />

            <Skeleton
              className="
            h-4
            w-8
            bg-gray-200

            dark:bg-[#2A1245]
          "
            />
          </div>

          <div className="flex justify-between">
            <Skeleton
              className="
            h-4
            w-16
            bg-gray-200

            dark:bg-[#2A1245]
          "
            />

            <Skeleton
              className="
            h-4
            w-8
            bg-gray-200

            dark:bg-[#2A1245]
          "
            />
          </div>

          <Skeleton
            className="
          h-2
          w-full
          bg-purple-100

          dark:bg-[#6D28D9]
        "
          />
        </div>
      )}

      {/* ================= User ================= */}
      <div
        className="
      flex
      flex-row
      items-center
      gap-2
      rounded-lg
      border
      border-gray-200
      bg-white
      p-2
      mt-2
      cursor-pointer

      shadow-md

      hover:scale-105
      hover:bg-purple-50

      transition-all
      duration-500

      group-data-[collapsible=icon]:rounded-full
      group-data-[collapsible=icon]:justify-center

      dark:border-[#432663]
      dark:bg-[#1A0B2E]
      dark:hover:bg-[#2A1245]
      dark:hover:border-[#6D28D9]
      dark:hover:shadow-[0_0_18px_rgba(109,40,217,0.22)]
    "
      >
        {userData ? (
          <div className="flex items-center justify-center rounded-full">
            <img
              src={userData.image?.toString()}
              alt={userData.name?.toString()}
              className="
            size-11
            rounded-full
            ring-2
            ring-purple-200

            dark:ring-[#6D28D9]
          "
            />
          </div>
        ) : (
          <Skeleton
            className="
          size-10
          shrink-0
          rounded-full
          bg-gray-200

          dark:bg-[#2A1245]
        "
          />
        )}

        <div
          className="
        flex
        flex-col
        items-start
        justify-center

        group-data-[collapsible=icon]:hidden
      "
        >
          {userData ? (
            <>
              <h1
                className="
              text-xl
              font-semibold
              text-gray-800

              dark:text-purple-50
            "
              >
                {userData.name}
              </h1>

              <p
                className="
              text-xs
              text-gray-600

              dark:text-purple-300
            "
              >
                {userData.email}
              </p>
            </>
          ) : (
            <>
              <Skeleton
                className="
              mb-1
              h-5
              w-28
              bg-gray-200

              dark:bg-[#2A1245]
            "
              />

              <Skeleton
                className="
              h-3
              w-36
              bg-gray-200

              dark:bg-[#321451]
            "
              />
            </>
          )}
        </div>
      </div>
    </SidebarFooter>
  );
};

export default React.memo(SideBarFooter);
