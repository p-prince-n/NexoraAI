
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  count: number | undefined;
  type: string;
  desc: string;
  icon: LucideIcon;
}

const StatsCard = ({
  bgColor,
  borderColor,
  iconBgColor,
  iconColor,
  count,
  type,
  desc,
  icon: Icon,
}: StatsCardProps) => {
  return (
    <div
      className={`flex flex-col items-start justify-center gap-5 px-3 py-2
        border rounded-xl shadow-md
        hover:shadow-2xl hover:scale-105
        cursor-pointer transition-all hover:-translate-y-1
        ${bgColor} ${borderColor}`}
    >
      <div className="flex items-center justify-between w-full">
        <div
          className={`flex items-center rounded-xl p-3 ${iconBgColor}`}
        >
          <Icon className={`size-6 ${iconColor}`} />
        </div>

        <h1 className="text-3xl font-bold pr-2 ">
          {count}
        </h1>
      </div>

      <div className="flex flex-col items-start justify-center">
        <h1 className="text-xl font-semibold">
          {type}
        </h1>

        <p className="text-sm font-light -mt-1">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;

