import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateAgents from "@/components/custom/Agents/CreateAgents";
import MyAgents from "@/components/custom/Agents/MyAgents";

const AgentPage = () => {
  return (
    <div className="w-full flex justify-center  transition-colors duration-300">
  <div className="max-w-6xl w-full px-6 pt-5 lg:pt-20 pb-16">
    <Tabs defaultValue="create-agents">

      <TabsList
        className="
          bg-purple-100
          dark:bg-[#1A0B2E]
          border
          border-purple-200
          dark:border-[#432663]
          transition-colors duration-300
        "
      >
        <TabsTrigger
          value="create-agents"
          className="
            text-purple-700
            dark:text-purple-300
            data-[state=active]:bg-white
            data-[state=active]:text-purple-900
            dark:data-[state=active]:bg-[#321451]
            dark:data-[state=active]:text-purple-50
            dark:hover:text-white
            transition-colors duration-300
          "
        >
          Create Agents
        </TabsTrigger>

        <TabsTrigger
          value="my-agents"
          className="
            text-purple-700
            dark:text-purple-300
            data-[state=active]:bg-white
            data-[state=active]:text-purple-900
            dark:data-[state=active]:bg-[#321451]
            dark:data-[state=active]:text-purple-50
            dark:hover:text-white
            transition-colors duration-300
          "
        >
          My Agents
        </TabsTrigger>
      </TabsList>

      <TabsContent value="create-agents">
        <CreateAgents />
      </TabsContent>

      <TabsContent value="my-agents">
        <MyAgents />
      </TabsContent>

    </Tabs>
  </div>
</div>
  );
};

export default AgentPage;
