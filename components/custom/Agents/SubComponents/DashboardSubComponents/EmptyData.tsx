
import React from "react";
import { Loader, type LucideIcon } from "lucide-react";

type EmptyDataProps = {
  title: string;
  data: string;
  listData?: string[];

  icon: LucideIcon;

  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  tileBgColor?: string;
  tileTextColor?: string;
  loading:boolean;


  className?: string;
};

const EmptyData = ({
  loading=false,
  title,
  data,
  listData = [],
  icon: Icon,

  bgColor = "bg-gray-50",
  textColor = "text-gray-600",
  borderColor = "border-gray-300",

  tileBgColor = "bg-gray-100",
  tileTextColor = "text-gray-700",


  className = "",
}: EmptyDataProps) => {
  return (
    <div
      className={`flex w-full flex-col items-start justify-center gap-3 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-start gap-4">
        <h1 className="text-xl font-semibold sm:text-2xl dark:text-purple-100">
          {title}
        </h1>

        <div
          className={`flex size-7 items-center justify-center rounded-md ${tileBgColor}`}
        >
          <p className={`${tileTextColor} text-sm font-semibold`}>
            {loading ? <Loader className="size-3 animate-spin" /> : listData.length}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {!loading && listData.length === 0 && (
        <div
          className={`flex w-full items-center justify-start gap-4 rounded-xl border border-dashed p-3 ${borderColor} ${bgColor} ${textColor}`}
        >
          <Icon className="size-5 shrink-0" />

          <p className="text-sm sm:text-base">
            {data}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmptyData;
