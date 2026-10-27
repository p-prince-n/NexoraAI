import { LoaderCircle } from "lucide-react";
import moment from "moment";

type Props = {
  agentName: string;
  instruction: string;
  time: string;
};

const RunningAgentCard = ({ agentName, instruction, time }: Props) => {
  return (
   <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl p-3 transition-colors duration-300 sm:p-4 md:grid-cols-[auto_minmax(0,1fr)_auto]">
  {/* Running Icon */}
  <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 shadow-sm transition-colors duration-300 dark:border-blue-900/60 dark:bg-blue-950/40 sm:size-14">
    <LoaderCircle className="size-6 animate-spin text-blue-600 dark:text-blue-400" />

    {/* Online indicator */}
    <div className="absolute bottom-0 right-[-2px] size-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-[#170D29]" />
  </div>

  {/* Main Content */}
  <div className="min-w-0">
    <h1 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors duration-300 dark:text-purple-50 sm:text-lg">
      {agentName}
    </h1>

    <p className="mt-1 line-clamp-1 text-xs leading-5 text-gray-600 transition-colors duration-300 dark:text-purple-200/70 sm:text-sm">
      {instruction}
    </p>
  </div>

  {/* Time + Status */}
  <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-1 md:justify-end">
    <p className="text-xs text-gray-500 transition-colors duration-300 dark:text-purple-300/60 sm:text-sm">
      {moment(time).fromNow()}
    </p>

    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors duration-300 dark:bg-blue-950/60 dark:text-blue-300 sm:text-sm">
      <span className="size-1.5 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400" />
      Running
    </span>
  </div>
</div>
  );
};

export default RunningAgentCard;

