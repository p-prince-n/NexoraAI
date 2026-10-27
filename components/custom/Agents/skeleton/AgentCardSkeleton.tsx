import { CalendarCheck, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const AgentCardSkeleton = () => {
  return (
    <div
      className="
    w-full rounded-xl
    border border-gray-200
    bg-white
    p-4
    shadow-md
    transition-colors duration-300

    dark:border-[#302044]
    dark:bg-[#170D29]

    sm:p-5
  "
    >
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        {/* Agent Image */}
        <Skeleton
          className="
        size-12 rounded-md
        bg-gray-200
        dark:bg-[#2A1245]
        sm:size-14
      "
        />

        {/* Menu */}
        <Skeleton
          className="
        size-9 rounded-md
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />
      </div>

      {/* Agent Name + Status */}
      <div className="mt-3 flex w-full items-center justify-between gap-3">
        <Skeleton
          className="
        h-6 w-40 rounded-md
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />

        <Skeleton
          className="
        h-6 w-16 rounded-xl
        bg-gray-200
        dark:bg-[#321451]
      "
        />
      </div>

      {/* Description */}
      <div className="mt-2 space-y-2">
        <Skeleton
          className="
        h-4 w-full rounded-md
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />

        <Skeleton
          className="
        h-4 w-3/4 rounded-md
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />
      </div>

      {/* Schedule */}
      <div className="mt-4 flex items-center gap-2">
        <Skeleton
          className="
        size-5 rounded-md
        bg-gray-200
        dark:bg-[#321451]
      "
        />

        <Skeleton
          className="
        h-4 w-32 rounded-md
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />
      </div>

      {/* Actions */}
      <div
        className="
      mt-5 flex w-full flex-col
      items-center justify-center
      gap-2
      border-t border-gray-200
      pt-5
      transition-colors duration-300

      dark:border-[#302044]

      lg:flex-row
    "
      >
        <Skeleton
          className="
        h-11 w-full rounded-xl
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />

        <Skeleton
          className="
        h-11 w-full rounded-xl
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />
      </div>
    </div>
  );
};

export default AgentCardSkeleton;
