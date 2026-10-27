import { users } from "@/db";
import { InferSelectModel } from "drizzle-orm";

export type UserData = InferSelectModel<typeof users>;
export type QuickSuggetionSchema = { lable: String; prompt: String }[];
export type TempletSchema = {
  title: string;
  description: string;
  icon: any;
  iconBG: string;
  iconColor: string;
  border: string;
  glow: string;
}[];

export type ClarificationQuestion = {
  id: string;
  question: string;
  type: "single_select" | "multi_select" | "text" | "number" | "date" | "time";
  options: string[];
  allowCustom: boolean;
  customPlaceholder: string;
};

export type AgentConfig = {
  name: string;
  description: string;
  instructions: string;
  objective: string;
  tools: string[];
  skills: string[];
  schedule: {
    type: "once" | "recurring"| "manual";
    frequency: string;
    time: string;
  };
  outputFormat: string;
};

export type CreateAgentType = {
  id: number;
  userEmail: string | null;
  agentId: string;
  name: string | null;
  agentImage: string | null;
  description: string | null;
  instructions: string | null;
  objective: string | null;
  tools: string[];
  skills: string[];
  schedule: AgentSchedule;
  outputFormate: string | null;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  composioSessionId: string | null;
};

export type AgentSchedule={
  type: "once"| "recurring"| "manual",
  frequency: "hourly"| "daily"|"weekly"| "monthly",
  time?:string,
  timezone?:string
}
export type Tool = {
  name: string;
  connected: boolean;
  slug: string;
  logo: string;
  type?:string ,
  connectedAccountId: string | null;
};


export type AgentRunType = {
  id: string;
  agentId: string;
  userEmail: string;
  scheduledFor: Date;
  timezone: string;
  status: string;
  output: unknown;
  error: string | null;
  queuedAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;

  // Agent config details
  agentName: string | null;
  agentImage: string | null;
  agentDescription: string | null;
};
export type AgentRunPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AgentRunResponse = {
  success: boolean;
  message: string;
  data: AgentRunType[];
  pagination: AgentRunPagination;
};

export type Integration = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  type: string;
  provider: string | null;
  status: string;
  requiresAuth: boolean;
  authType: string | null;
  authProvider: string | null;
  capabilities: any;
  image: string | null;
  account: ComposioConnectedAccount | null;
  connected: boolean;
};

export type ComposioConnectedAccount = {
  id: string;
  status: string;
  toolkit: {
    slug: string;
  };
};

export type DashboardData = {
  completed: number;
  failed: number;
  scheduled: number;
  running: number;
};

export type BriefData = {
  brief: string;
  generatedAt: string | Date | null;
};