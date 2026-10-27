
import { Loader2 } from "lucide-react";
import React from "react";

type EmptyDataProps = {
  data: string;

  bgColor?: string;
  textColor?: string;
  borderColor?: string;

  className?: string;
};

const AgentLoader = ({

  data,

  bgColor = "bg-gray-50",
  textColor = "text-gray-600",
  borderColor = "border-gray-300",



  className = "",
}: EmptyDataProps) => {
  return (
    <div
      className={`flex w-full mt-3 flex-col items-start justify-center gap-3 ${className}`}
    >
     
      {/* Empty State */}

        <div
          className={`flex w-full items-center justify-start gap-4 rounded-xl border border-dashed p-3 ${borderColor} ${bgColor} ${textColor}`}
        >
          <Loader2 className="size-5 animate-spin" />

          <p className="text-sm sm:text-base">
            {data}
          </p>
        </div>
 
    </div>
  );
};

export default AgentLoader;
