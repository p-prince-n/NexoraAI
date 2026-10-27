import { Skeleton } from "@/components/ui/skeleton";

const NewAgentCardSkeleton = () => {
  return (
    <div
      className="
    mt-5 flex w-full flex-col gap-3
    rounded-xl
    border border-gray-300
    bg-white
    p-3
    shadow-md
    transition-colors duration-300

    dark:border-[#302044]
    dark:bg-[#170D29]

    sm:p-4
    xl:gap-8
    md:flex-row
    md:items-center
    md:justify-between
  "
    >
      {/* Left Section */}
      <div className="flex w-full min-w-0 items-start gap-3">
        {/* Agent Image */}
        <Skeleton
          className="
        size-12 shrink-0 rounded-xl
        bg-gray-200
        dark:bg-[#2A1245]
        sm:size-14
        md:size-16
      "
        />

        <div className="min-w-0 flex-1">
          {/* Name + Status */}
          <div
            className="
          flex min-w-0 flex-col gap-2
          sm:flex-row sm:items-center
          sm:justify-between sm:gap-3
        "
          >
            {/* Name */}
            <Skeleton
              className="
            h-6 w-40 rounded-md
            bg-gray-200
            dark:bg-[#2A1245]
            sm:h-7 sm:w-52
          "
            />

            {/* Status */}
            <Skeleton
              className="
            h-6 w-20 shrink-0 rounded-xl
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
            sm:h-5
          "
            />

            <Skeleton
              className="
            h-4 w-4/5 rounded-md
            bg-gray-200
            dark:bg-[#2A1245]
            sm:h-5
          "
            />
          </div>

          {/* Schedule Information */}
          <div
            className="
          mt-3 flex flex-col gap-2
          sm:flex-row sm:items-center
          sm:justify-between sm:gap-3
        "
          >
            <div className="flex min-w-0 items-center gap-2">
              {/* Calendar Icon */}
              <Skeleton
                className="
              size-5 shrink-0 rounded-md
              bg-gray-200
              dark:bg-[#321451]
            "
              />

              {/* Next Run */}
              <Skeleton
                className="
              h-4 w-32 rounded-md
              bg-gray-200
              dark:bg-[#2A1245]
              sm:h-5 sm:w-40
            "
              />
            </div>

            {/* Frequency */}
            <Skeleton
              className="
            h-4 w-24 shrink-0 rounded-md
            bg-gray-200
            dark:bg-[#2A1245]
            sm:h-5 sm:w-28
          "
            />
          </div>
        </div>
      </div>

      {/* Right Section / Actions */}
      <div
        className="
      flex w-full items-center justify-end gap-1
      border-t border-gray-200
      pt-2
      transition-colors duration-300

      dark:border-[#302044]

      md:w-auto
      md:shrink-0
      md:border-t-0
      md:pt-0
    "
      >
        {/* Edit Button */}
        <Skeleton
          className="
        size-9 rounded-md
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />

        {/* Dropdown Button */}
        <Skeleton
          className="
        size-9 rounded-md
        bg-gray-200
        dark:bg-[#2A1245]
      "
        />
      </div>
    </div>
  );
};

export default NewAgentCardSkeleton;
