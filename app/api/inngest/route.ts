import { serve } from "inngest/next";

import { ExecuteScheduledAgent, ProcessScheduledAgent, ExecuteScheduledAgentDashboard } from "@/inngest/functions";

import { inngest } from "@/inngest/client";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [ProcessScheduledAgent, ExecuteScheduledAgent, ExecuteScheduledAgentDashboard],
});