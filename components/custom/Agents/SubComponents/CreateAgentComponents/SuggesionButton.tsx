import { Button } from "@/components/ui/button";
import React from "react";

const SuggesionButton = ({ label, prompt, setPrompt }: any) => {
  return (
   <Button
  onClick={() => setPrompt(prompt)}
  variant={"outline"}
  className="cursor-pointer border-gray-500 bg-gray-200 transition-all duration-300 hover:border-purple-700 hover:bg-purple-200 hover:text-purple-700 hover:shadow-xl dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-200 dark:hover:border-purple-500 dark:hover:bg-purple-950/50 dark:hover:text-purple-300 dark:hover:shadow-purple-950/40"
>
  {label}
</Button>
  );
};

export default React.memo(SuggesionButton);
