import { CircleX, TriangleAlert } from "lucide-react";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
type Props = {
  agentName: string;
  error: string;
  time: string;
};

const ErrorRunCard = ({ agentName, error, time }: Props) => {
  return (
    <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl transition-colors duration-300 md:grid-cols-[auto_minmax(0,1fr)_auto]">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 shadow-sm transition-colors duration-300 dark:border-red-900/60 dark:bg-red-950/40 sm:size-10">
        <TriangleAlert className="size-5 text-red-600 transition-colors duration-300 dark:text-red-400" />
      </div>

      <div className="min-w-0">
        <h1 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors duration-300 dark:text-purple-50 sm:text-lg">
          {agentName}
        </h1>

        <div className="mt-1 line-clamp-1 text-xs leading-5 text-gray-600 transition-colors duration-300 dark:text-purple-200/70 sm:text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{error}</ReactMarkdown>
        </div>
      </div>

      <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-1 md:justify-end">
        <p className="text-xs text-gray-500 transition-colors duration-300 dark:text-purple-300/60 sm:text-sm">
          {moment(time).fromNow()}
        </p>

        <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition-colors duration-300 dark:bg-red-950/60 dark:text-red-300 sm:text-sm">
          Failed
        </span>
      </div>
    </div>
  );
};

export default ErrorRunCard;
