import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type LatestCompletedTask = {
  imgSrc: string;
  agentName: string;
  instruction: string;
  time: string; // ISO timestamp / createdAt
};

const LatestResultsCard = ({
  imgSrc,
  agentName,
  instruction,
  time,
}: LatestCompletedTask) => {
 return (
  <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto]">
    {/* Avatar */}
    <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29] sm:size-12 sm:p-0.5">
      <div className="absolute bottom-0 -right-0.5 size-2.5 rounded-full bg-green-600 ring-2 ring-white dark:ring-[#170D29]" />

      <img
        src={imgSrc}
        alt={agentName}
        className="size-full rounded-lg object-contain"
      />
    </div>

    {/* Main Content */}
    <div className="min-w-0">
      <h1 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors duration-300 dark:text-purple-50 sm:text-lg">
        {agentName}
      </h1>

      <div className="line-clamp-1 text-xs leading-5 text-gray-600 transition-colors duration-300 dark:text-purple-200/70 sm:text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {instruction}
        </ReactMarkdown>
      </div>
    </div>

    <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-1 md:justify-end">
      <p className="text-xs text-gray-500 transition-colors duration-300 dark:text-purple-300/60 sm:text-sm">
        {moment(time).fromNow()}
      </p>

      <button className="shrink-0 text-sm font-semibold text-purple-700 transition-colors duration-300 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 sm:text-base">
        View Result
      </button>
    </div>
  </div>
);
};

export default LatestResultsCard;
