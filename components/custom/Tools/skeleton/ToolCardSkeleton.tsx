import { Skeleton } from "@/components/ui/skeleton";

const ToolCardSkeleton = () => {
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

    md:max-w-sm
  "
    >
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        {/* Tool Image */}
        <Skeleton
          className="
        size-[60px] rounded-xl
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />

        {/* Connection Status */}
        <Skeleton
          className="
        h-7 w-28 rounded-xl
        bg-gray-200
        dark:bg-[#321451]
      "
        />
      </div>

      {/* Tool Info */}
      <div className="mt-4 flex w-full flex-col items-start justify-center">
        <div className="flex items-center gap-2">
          {/* Name */}
          <Skeleton
            className="
          h-7 w-28 rounded-md
          bg-gray-200
          dark:bg-[#2A1245]
        "
          />

          {/* Category */}
          <Skeleton
            className="
          h-4 w-20 rounded-md
          bg-gray-200
          dark:bg-[#321451]
        "
          />
        </div>

        {/* Description */}
        <div className="mt-2 flex w-full flex-col gap-2">
          <Skeleton
            className="
          h-4 w-full rounded-md
          bg-gray-200
          dark:bg-[#2A1245]
        "
          />

          <Skeleton
            className="
          h-4 w-4/5 rounded-md
          bg-gray-200
          dark:bg-[#2A1245]
        "
          />
        </div>
      </div>

      {/* Capabilities */}
      <div className="mt-4 flex flex-col justify-center">
        <Skeleton
          className="
        mb-2 h-5 w-16 rounded-md
        bg-gray-200
        dark:bg-[#321451]
      "
        />

        <div className="flex flex-wrap items-center gap-2 py-2">
          <Skeleton
            className="
          h-7 w-20 rounded-xl
          bg-gray-200
          dark:bg-[#2A1245]
        "
          />

          <Skeleton
            className="
          h-7 w-24 rounded-xl
          bg-gray-200
          dark:bg-[#2A1245]
        "
          />

          <Skeleton
            className="
          h-7 w-16 rounded-xl
          bg-gray-200
          dark:bg-[#2A1245]
        "
          />

          <Skeleton
            className="
          h-7 w-28 rounded-xl
          bg-gray-200
          dark:bg-[#2A1245]
        "
          />
        </div>
      </div>

      {/* Button */}
      <div
        className="
      mt-5 flex w-full items-center justify-center
      gap-2 border-t border-gray-200 pt-5
      transition-colors duration-300
      dark:border-[#302044]
    "
      >
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

export default ToolCardSkeleton;
