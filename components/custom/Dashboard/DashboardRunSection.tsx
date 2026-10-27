"use client";

import { LucideIcon } from "lucide-react";
import EmptyData from "@/components/custom/Agents/SubComponents/DashboardSubComponents/EmptyData";
import AgentLoader from "@/components/custom/Dashboard/AgentLoader";

interface DashboardRunSectionProps {
  title: string;
  emptyMessage: string;
  icon: LucideIcon;
  listData: any[];
  loading: boolean;

  bgColor: string;
  textColor: string;
  borderColor: string;
  tileBgColor: string;
  tileTextColor: string;

  loaderText: string;

  renderItem: (item: any, index: number) => React.ReactNode;
}

const DashboardRunSection = ({
  title,
  emptyMessage,
  icon,
  listData,
  loading,
  bgColor,
  textColor,
  borderColor,
  tileBgColor,
  tileTextColor,
  loaderText,
  renderItem,
}: DashboardRunSectionProps) => {
  return (
    <div>
      <EmptyData
        loading={loading}
        title={title}
        data={emptyMessage}
        icon={icon}
        listData={listData}
        bgColor={bgColor}
        textColor={textColor}
        borderColor={borderColor}
        tileBgColor={tileBgColor}
        tileTextColor={tileTextColor}
      />

      {loading && (
        <AgentLoader
          data={loaderText}
          bgColor={tileBgColor}
          textColor={textColor}
          borderColor={borderColor}
        />
      )}

      {!loading && listData.length > 0 && (
        <div className="flex flex-col items-start justify-center gap-2 rounded-xl border mt-5">
          {listData.map((item, index) => (
            <div
              className={`p-3 sm:p-4 flex  w-full items-center justify-start ${index !== listData.length - 1 && "border-b"}`}
              key={item?.run?.id ?? index}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardRunSection;
