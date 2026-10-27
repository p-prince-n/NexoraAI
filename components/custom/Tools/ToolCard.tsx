import { Integration } from "@/lib/types";
import { Link, Loader2, Unlink } from "lucide-react";

const ToolCard = ({
  toolData,
  connectTool,
  disConnectTool,
  isLoading,
}: {
  toolData: Integration;
  connectTool: (tool: Integration) => void;
  disConnectTool: (tool: Integration) => void;
  isLoading: boolean;
}) => {
  const isConnected = toolData?.connected;

  return (
   <div
  className="
    w-full
    md:max-w-sm
    cursor-pointer
    rounded-xl
    border
    border-gray-200
    bg-white
    p-4
    text-gray-900
    shadow-md
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-2xl

    dark:border-[#432663]
    dark:bg-[#1A0B2E]
    dark:text-purple-50
    dark:shadow-purple-950/20
    dark:hover:border-[#6D28D9]
    dark:hover:bg-[#211038]
    dark:hover:shadow-[0_0_25px_rgba(109,40,217,0.25)]
  "
>
  {/* Header */}
  <div className="flex w-full items-center justify-between">
    <img
      src={toolData?.image?.toString()}
      alt={toolData?.name || "Integration"}
      height={60}
      width={60}
      className="size-14 rounded-lg object-contain"
    />

    {/* Connection Status */}
    <div
      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-0.5 ${
        isConnected
          ? "bg-green-200 text-green-600 dark:bg-green-950/60 dark:text-green-400"
          : "bg-red-200 text-red-600 dark:bg-red-950/60 dark:text-red-400"
      }`}
    >
      <span
        className={`size-2 rounded-full ${
          isConnected
            ? "bg-green-600 dark:bg-green-400"
            : "bg-red-600 dark:bg-red-400"
        }`}
      />
      <h1 className="text-sm font-semibold">
        {isConnected ? "Connected" : "Not Connected"}
      </h1>
    </div>
  </div>

  {/* Tool Info */}
  <div className="flex w-full flex-col items-start justify-center">
    <div className="flex items-center gap-2">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-purple-50">
        {toolData?.name}
      </h1>

      <p className="text-sm text-gray-600 dark:text-purple-300/70">
        ({toolData?.category})
      </p>
    </div>

    <p className="text-sm text-foreground dark:text-purple-200/75">
      {toolData?.description}
    </p>
  </div>

  {/* Capabilities */}
  {toolData?.capabilities?.length > 0 && (
    <div className="mt-2 flex flex-col justify-center">
      <h2 className="text-base font-semibold text-gray-900 dark:text-purple-100">
        Use For
      </h2>

      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-1 py-2">
        {toolData.capabilities.map((item: any) => (
          <div
            key={item}
            className="
              cursor-pointer
              rounded-xl
              border
              border-gray-400
              bg-gray-100
              px-3
              text-base
              text-gray-800
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-md

              dark:border-[#4A2670]
              dark:bg-[#24103D]
              dark:text-purple-200
              dark:hover:border-purple-500
              dark:hover:bg-[#321451]
              dark:hover:text-purple-50
              dark:hover:shadow-[0_0_12px_rgba(139,92,246,0.2)]
            "
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Action */}
  <div
    className="
      mt-5
      flex
      w-full
      items-center
      justify-center
      gap-2
      border-t
      border-gray-200
      pt-5
      dark:border-[#432663]
    "
  >
    {!isConnected ? (
      <button
        type="button"
        disabled={isLoading}
        onClick={() => connectTool(toolData)}
        className="
          flex
          flex-1
          items-center
          justify-center
          gap-3
          rounded-xl
          border
          border-purple-400
          bg-gradient-to-r
          from-purple-500
          to-pink-500
          px-4
          py-2
          text-white
          transition-all
          duration-300
          hover:scale-105
          hover:bg-gradient-to-l
          hover:shadow-lg
          hover:shadow-purple-200
          dark:hover:shadow-purple-950/50
          active:scale-95
          disabled:cursor-not-allowed
          disabled:scale-100
          disabled:opacity-60
        "
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span className="text-lg font-medium">
              Connecting...
            </span>
          </>
        ) : (
          <>
            <Link className="size-5" />
            <span className="text-lg font-medium">
              Connect
            </span>
          </>
        )}
      </button>
    ) : (
      <button
        type="button"
        disabled={isLoading}
        onClick={() => disConnectTool(toolData)}
        className="
          flex
          flex-1
          items-center
          justify-center
          gap-3
          rounded-xl
          border
          border-red-400
          bg-gradient-to-r
          from-red-500
          to-rose-500
          px-4
          py-2
          text-white
          transition-all
          duration-300
          hover:scale-105
          hover:bg-gradient-to-l
          hover:shadow-lg
          hover:shadow-red-200
          dark:hover:shadow-red-950/50
          active:scale-95
          disabled:cursor-not-allowed
          disabled:scale-100
          disabled:opacity-60
        "
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span className="text-lg font-medium">
              Disconnecting...
            </span>
          </>
        ) : (
          <>
            <Unlink className="size-5" />
            <span className="text-lg font-medium">
              Disconnect
            </span>
          </>
        )}
      </button>
    )}
  </div>
</div>
  );
};

export default ToolCard;