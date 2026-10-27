import { Skeleton } from "@/components/ui/skeleton";

const DashboardStatsCardSkeleton = () => {
  return (
    <div
      className="
    flex flex-col items-start justify-center gap-5
    rounded-xl
    border border-gray-200
    bg-white
    px-3 py-2
    shadow-md
    transition-colors duration-300

    dark:border-[#302044]
    dark:bg-[#170D29]

    sm:px-4 sm:py-3
  "
    >
      {/* Icon + Count */}
      <div className="flex w-full items-center justify-between">
        {/* Icon */}
        <Skeleton
          className="
        size-12 rounded-xl
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />

        {/* Count */}
        <Skeleton
          className="
        h-9 w-16 rounded-md
        bg-gray-200
        dark:bg-[#321451]
      "
        />
      </div>

      {/* Type + Description */}
      <div className="flex flex-col items-start justify-center gap-1">
        {/* Type */}
        <Skeleton
          className="
        h-6 w-28 rounded-md
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />

        {/* Description */}
        <Skeleton
          className="
        h-4 w-40 rounded-md
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />
      </div>
    </div>
  );
};

export default DashboardStatsCardSkeleton;
