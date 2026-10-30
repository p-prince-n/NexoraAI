
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  CalendarDays,
  Check,
  Clock3,
  Code2,
  Database,
  Github,
  Layers3,
  Mail,
  MessageSquare,
  Network,
  NotepadText,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
  ListTodo,
  CalendarCheck,
  Blocks,
  Plug,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export const integrations: {
  name: string;
  category: string;
  description: string;
  capabilities: string[];
  icon: LucideIcon;
  color: string;
}[] = [
  {
    name: "Slack",
    category: "Communication",
    description:
      "Connect your Slack workspace to communicate, access conversations and manage team interactions.",
    capabilities: ["Messages", "Channels", "Users", "Notifications"],
    icon: MessageSquare,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    name: "GitHub",
    category: "Development",
    description:
      "Give your agents access to repositories and development workflows.",
    capabilities: ["Repositories", "Issues", "Pull requests"],
    icon: Github,
    color: "text-gray-700 dark:text-white bg-gray-500/10",
  },
  {
    name: "Notion",
    category: "Productivity",
    description:
      "Access and manage your Notion workspace, pages and structured information.",
    capabilities: ["Pages", "Databases", "Search", "Blocks"],
    icon: NotepadText,
    color: "text-gray-700 dark:text-white bg-gray-500/10",
  },
  {
    name: "Gmail",
    category: "Communication",
    description:
      "Let agents search, read, send and organize your Gmail conversations.",
    capabilities: ["Emails", "Search", "Attachments", "Labels"],
    icon: Mail,
    color: "text-red-500 bg-red-500/10",
  },
  {
    name: "Google Calendar",
    category: "Productivity",
    description:
      "Manage your calendar, access events and organize your daily schedule.",
    capabilities: ["Events", "Calendars", "Scheduling"],
    icon: CalendarDays,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    name: "Google Tasks",
    category: "Productivity",
    description:
      "Create, read, update and organize tasks through your AI agent.",
    capabilities: ["Tasks", "Task management", "Todo"],
    icon: ListTodo,
    color: "text-green-500 bg-green-500/10",
  },
  {
    name: "Outlook",
    category: "Communication",
    description:
      "Connect Microsoft Outlook to work with emails, calendars, contacts and tasks.",
    capabilities: ["Emails", "Calendar", "Contacts", "Tasks"],
    icon: Mail,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    name: "Todoist",
    category: "Productivity",
    description:
      "Organize tasks and projects while keeping your work structured.",
    capabilities: ["Tasks", "Projects", "Labels"],
    icon: Check,
    color: "text-red-500 bg-red-500/10",
  },
  {
    name: "Cal.com",
    category: "Productivity",
    description:
      "Handle scheduling, bookings and calendar availability.",
    capabilities: ["Calendar", "Scheduling", "Booking"],
    icon: CalendarCheck,
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    name: "CalendarHero",
    category: "Productivity",
    description:
      "Coordinate meetings and manage your scheduling workflows.",
    capabilities: ["Calendar", "Scheduling", "Meetings"],
    icon: Clock3,
    color: "text-violet-500 bg-violet-500/10",
  },
];

export const workflowSteps = [
  {
    number: "01",
    title: "Define your objective",
    description:
      "Tell your agent what you want to accomplish. Provide a clear objective, instructions and expected output.",
    icon: BrainCircuit,
  },
  {
    number: "02",
    title: "Connect integrations",
    description:
      "Select the tools your agent needs. Composio provides the integration and tool collection layer.",
    icon: Plug,
  },
  {
    number: "03",
    title: "Execute the workflow",
    description:
      "Your agent understands the request, selects relevant tools and executes the required actions.",
    icon: Workflow,
  },
  {
    number: "04",
    title: "Receive the result",
    description:
      "Get the final result in your chosen output format, directly inside your application.",
    icon: Sparkles,
  },
];

export const agentFeatures = [
  {
    title: "Custom Instructions",
    description:
      "Define exactly how your agent should think, behave and complete its assigned tasks.",
    icon: NotepadText,
  },
  {
    title: "Connected Tools",
    description:
      "Connect multiple external services and give your agent access to the capabilities it needs.",
    icon: Blocks,
  },
  {
    title: "Reusable Skills",
    description:
      "Add specific capabilities that help your agent perform specialized tasks.",
    icon: Zap,
  },
  {
    title: "Flexible Scheduling",
    description:
      "Run agents manually, once or on recurring schedules such as hourly, daily, weekly or monthly.",
    icon: Clock3,
  },
  {
    title: "Custom Output",
    description:
      "Define how your agent should structure and present its final results.",
    icon: Layers3,
  },
  {
    title: "Configurable Agents",
    description:
      "Update the agent's identity, objective, instructions, skills and integrations whenever needed.",
    icon: Bot,
  },
];

export default function AgentLandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-gray-900 transition-colors duration-300 dark:bg-[#100A1F] dark:text-purple-50">

   

      {/* ================= AGENTS ================= */}
      <section
        id="agents"
        className="scroll-mt-28 relative px-4 pb-24 pt-24 sm:px-6 sm:pt-32 lg:px-8"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[130px] dark:bg-purple-600/15" />

        <div className="relative mx-auto max-w-5xl text-center">

          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
            <Sparkles size={14} />
            INTRODUCING NEXORA AI AGENTS
          </div>

          <h1 className="animate-fade-up animation-delay-100 mx-auto mt-8 max-w-4xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
            Your work deserves
            <span className="block bg-gradient-to-r from-purple-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              an intelligent agent.
            </span>
          </h1>

          <p className="animate-fade-up animation-delay-200 mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-600 dark:text-purple-200/65 sm:text-lg">
            Create intelligent AI agents that understand your goals,
            connect with your favorite applications, and execute
            meaningful workflows. Automate everyday work with agents
            designed around the way you work.
          </p>

          <div className="animate-fade-up animation-delay-300 mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#workflow"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-500/20"
            >
              Explore how it works
              <ArrowRight size={18} />
            </a>
            <a
              href="#integrations"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-purple-400 dark:border-[#302044] dark:bg-[#170D29] dark:hover:border-purple-500"
            >
              <Plug size={17} />
              View integrations
            </a>
          </div>

          {/* Agent preview */}
          <div className="animate-fade-up animation-delay-400 mx-auto mt-20 max-w-4xl rounded-3xl border border-gray-200 bg-gray-50/80 p-3 shadow-2xl shadow-purple-500/5 dark:border-[#302044] dark:bg-[#170D29] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4 dark:border-[#302044]">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-600/10 p-3 text-purple-600 dark:text-purple-300">
                  <Bot size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Research Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-purple-200/50">
                    Custom AI Agent
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                ● Ready to execute
              </span>
            </div>

            <div className="grid gap-4 py-6 text-left sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#302044] dark:bg-[#100A1F]">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BrainCircuit size={17} className="text-purple-500" />
                  Agent objective
                </div>
                <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-purple-200/65">
                  Research project updates, collect relevant information
                  and organize the findings into a structured report.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#302044] dark:bg-[#100A1F]">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Plug size={17} className="text-purple-500" />
                  Connected integrations
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Slack", "Notion", "Gmail", "GitHub"].map((name) => (
                    <span
                      key={name}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium dark:border-[#302044] dark:bg-[#170D29]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-purple-600/5 p-4 text-left dark:bg-purple-500/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                <Sparkles size={16} />
                Agent capabilities
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Research", "Information retrieval", "Task automation", "Reporting"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white px-3 py-1.5 text-xs text-gray-600 dark:bg-[#100A1F] dark:text-purple-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Agent features */}
        <div className="relative mx-auto mt-28 max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
              Built around your workflow
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              More than just a chatbot.
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-purple-200/60 sm:text-base">
              An agent is configured to achieve a specific objective,
              follow instructions, use connected tools and deliver
              structured results.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agentFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-fade-up group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5 dark:border-[#302044] dark:bg-[#170D29] dark:hover:border-purple-500/40"
                >
                  <div className="mb-5 inline-flex rounded-xl bg-purple-500/10 p-3 text-purple-600 transition-transform duration-300 group-hover:scale-110 dark:text-purple-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-purple-200/60">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}
      <section
        id="workflow"
        className="scroll-mt-28 border-y border-gray-200 bg-gray-50 px-4 py-24 dark:border-[#302044] dark:bg-[#140C22] sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
              <Workflow size={14} />
              HOW IT WORKS
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
              From an idea to
              <span className="text-purple-600 dark:text-purple-400">
                {" "}an automated workflow.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-purple-200/60 sm:text-base">
              Build your agent once, configure its capabilities and let
              it work toward your objective through a structured execution process.
            </p>
          </div>

          {/* Workflow steps */}
          <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  style={{ animationDelay: `${index * 120}ms` }}
                  className="animate-fade-up group relative rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl dark:border-[#302044] dark:bg-[#170D29] dark:hover:border-purple-500/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-widest text-purple-500">
                      {step.number}
                    </span>
                    <div className="rounded-xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-300">
                      <Icon size={22} />
                    </div>
                  </div>

                  <h3 className="mt-8 text-lg font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-purple-200/60">
                    {step.description}
                  </p>

                  {index !== workflowSteps.length - 1 && (
                    <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 text-purple-400 lg:block" size={24} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Workflow configuration */}
          <div className="mt-16 grid gap-6 rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 dark:border-purple-500/20 dark:from-[#211238] dark:to-[#170D29] sm:p-10 lg:grid-cols-2 lg:items-center">

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-300">
                Execution control
              </span>
              <h3 className="mt-4 text-2xl font-bold sm:text-3xl">
                Your agent. Your rules.
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-purple-200/65">
                Choose how your agent executes its work. Configure the
                execution schedule, add capabilities and define the
                expected result.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {["Manual", "Once", "Recurring"].map((item) => (
                  <span
                    key={item}
                    className="rounded-xl border border-purple-200 bg-white px-4 py-2 text-sm font-medium text-purple-700 dark:border-purple-500/20 dark:bg-[#100A1F] dark:text-purple-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                ["Run manually", "Start the agent whenever you need it."],
                ["Run once", "Configure a one-time execution."],
                ["Recurring schedule", "Hourly, daily, weekly or monthly."],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-[#302044] dark:bg-[#100A1F]"
                >
                  <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-300">
                    <Check size={17} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{title}</h4>
                    <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-purple-200/50">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTEGRATIONS ================= */}
      <section
        id="integrations"
        className="scroll-mt-28 relative px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="pointer-events-none absolute right-0 top-20 -z-0 h-80 w-80 rounded-full bg-purple-500/10 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
              <Network size={14} />
              CONNECT YOUR WORKSPACE
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
              Everything you use.
              <span className="block text-purple-600 dark:text-purple-400">
                Connected to your agents.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-purple-200/60 sm:text-base">
              Bring your favorite applications into one intelligent
              workspace. Connect integrations and let your agents
              interact with the services you already use.
            </p>
          </div>

          {/* Composio explanation */}
          <div className="mt-14 flex flex-col gap-5 rounded-2xl border border-purple-200 bg-purple-50/70 p-5 dark:border-purple-500/20 dark:bg-purple-500/5 sm:flex-row sm:items-center sm:p-7">
            <div className="shrink-0 rounded-2xl bg-purple-600 p-4 text-white">
              <Database size={28} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold">
                Powered by Composio
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-purple-200/60">
                Nexora AI uses Composio as its integration and tool
                collection layer. It helps connect external applications
                and expose their available tools to your AI agents,
                allowing them to interact with connected services
                through configured integrations.
              </p>
            </div>

            <a
              href="https://composio.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-200"
            >
              Explore Composio
              <ArrowUpRight size={17} />
            </a>
          </div>

          {/* Integration count */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Available integrations</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-purple-200/50">
                Connect the services that power your workflow.
              </p>
            </div>

            <span className="rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
              {integrations.length} integrations
            </span>
          </div>

          {/* Integration cards */}
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;

              return (
                <article
                  key={integration.name}
                  style={{ animationDelay: `${index * 70}ms` }}
                  className="animate-fade-up group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5 dark:border-[#302044] dark:bg-[#170D29] dark:hover:border-purple-500/40 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`rounded-xl p-3 ${integration.color}`}>
                      <Icon size={23} />
                    </div>

                    <span className="rounded-full border border-gray-200 px-3 py-1 text-[10px] font-medium text-gray-500 dark:border-[#302044] dark:text-purple-200/50">
                      {integration.category}
                    </span>
                  </div>

                  <h4 className="mt-5 text-lg font-bold">
                    {integration.name}
                  </h4>

                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-gray-600 dark:text-purple-200/60">
                    {integration.description}
                  </p>

                  <div className="mt-5 border-t border-gray-100 pt-4 dark:border-[#302044]">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-purple-200/40">
                      Available capabilities
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {integration.capabilities.map((capability) => (
                        <span
                          key={capability}
                          className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 dark:bg-[#100A1F] dark:text-purple-200/70"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-purple-600 transition-colors group-hover:text-purple-800 dark:text-purple-300 dark:group-hover:text-purple-200">
                    <Check size={15} />
                    Integration supported
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-violet-700 to-indigo-800 px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 size-96 rounded-full border border-white/10" />

          <div className="relative">
            <Sparkles className="mx-auto mb-5" size={32} />

            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              Turn your ideas into intelligent workflows.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-purple-100 sm:text-base">
              Build your first AI agent, connect your applications
              and experience a smarter way to get work done.
            </p>

            <a
              href="/dashboard/agents/create"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-purple-700 transition-all duration-300 hover:-translate-y-1 hover:bg-purple-50 hover:shadow-xl"
            >
              Create your agent
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
