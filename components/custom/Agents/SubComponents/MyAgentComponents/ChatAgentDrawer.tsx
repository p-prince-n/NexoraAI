"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CreateAgentType, Tool } from "@/lib/types";
import axios from "axios";

import { useEffect, useRef, useState, KeyboardEvent } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { ArrowUp, Loader2, Plus, Bot, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  agent: CreateAgentType | null;
  openSheet_?: boolean;
  closeSheet?: (open: boolean) => void;
};

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
};

const ChatAgentDrawer = ({
  openSheet_ = false,
  agent,
  closeSheet = () => {},
}: Props) => {
  const [openSheet, setOpenSheet] = useState(openSheet_);

  const [tools, setTools] = useState<Tool[]>([]);
  const [serverTools, setServerTools] = useState<Tool[]>([]);
  const [connectedTools, setConnectedTools] = useState<Tool[]>([]);

  const [fetchToolsLoadingTool, setFetchToolsLoadingTool] = useState(false);

  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!agent?.agentId) return;

    const fetchTools = async () => {
      setFetchToolsLoadingTool(true);

      try {
        const response = await axios.post(
          `/api/agent/tools?agentId=${agent.agentId}`,
        );

        const data = response.data.tools;
        setServerTools(data);

        const integrationTools = data.filter(
          (tool:Tool) => tool.type === "integration",
        );

        console.log("Integration Tools:", integrationTools);

        setTools(integrationTools);

        setConnectedTools(integrationTools.filter((tool:Tool) => tool.connected));
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      } finally {
        setFetchToolsLoadingTool(false);
      }
    };

    fetchTools();
  }, [agent?.agentId]);

  useEffect(() => {
    setOpenSheet(openSheet_);
  }, [openSheet_]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const buildConversationContext = (previousMessages: Message[]) => {
    if (previousMessages.length === 0) {
      return "No previous conversation.";
    }

    return previousMessages
      .map((message) => {
        const role = message.role === "user" ? "User" : "Agent";

        return `${role}: ${message.content}`;
      })
      .join("\n");
  };

  const onSubmitHandle = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || loading || !agent?.agentId) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedPrompt,
      timestamp: new Date(),
    };

    const previousContext = buildConversationContext(messages);

    setMessages((prev) => [...prev, userMessage]);

    setPrompt("");
    setLoading(true);
    

    try {
      const response = await axios.post("/api/agent/run", {
        agentId: agent.agentId,
        //@ts-ignore
       availableTools: serverTools?.tools,

        input: `
Previous conversation:
${previousContext}

Current user request:
${trimmedPrompt}
          `.trim(),
      });

      const agentOutput =
        response.data?.finalOutput ??
        response.data?.message ??
        response.data?.content;

      const agentMessage: Message = {
        id: crypto.randomUUID(),
        role: "agent",
        content:
          typeof agentOutput === "string"
            ? agentOutput
            : "I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error("Agent run error:", error);

      let errorMessage =
        "Sorry, something went wrong while processing your request.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error ?? errorMessage;
      }

      const agentErrorMessage: Message = {
        id: crypto.randomUUID(),
        role: "agent",
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentErrorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      onSubmitHandle();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const theme = useTheme();

  return (
    <Sheet
      open={openSheet}
      onOpenChange={(value) => {
        setOpenSheet(value);
        closeSheet(value);
      }}
    >
      <SheetContent
        data-theme={theme.theme}
        side="right"
        className="
    flex w-full flex-col gap-0 overflow-hidden p-0
    bg-white text-gray-900
    transition-colors duration-300
    dark:border-[#302044]
    dark:bg-[#100A1F]
    dark:text-purple-50
    sm:max-w-lg
    md:max-w-xl
    lg:max-w-2xl
  "
      >
        <SheetHeader
          className="
    shrink-0
    border-b border-gray-200
    bg-white
    px-4 py-3
    shadow-sm
    transition-colors duration-300
    dark:border-[#302044]
    dark:bg-[#170D29]
    sm:px-5
    sm:py-4
  "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
    size-11 shrink-0 overflow-hidden rounded-xl
    border border-gray-300
    bg-gray-100
    transition-colors duration-300
    dark:border-[#302044]
    dark:bg-[#100A1F]
    sm:size-12
  "
            >
              {agent?.agentImage ? (
                <img
                  src={agent.agentImage.toString()}
                  alt={agent?.name?.toString() || "Agent"}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Bot className="size-6 text-gray-500 dark:text-purple-300" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 text-left">
              <SheetTitle
                className="
    truncate
    text-base font-semibold
    text-gray-800
    transition-colors duration-300
    dark:text-purple-50
    sm:text-lg
  "
              >
                {agent?.name?.toString() || "AI Agent"}
              </SheetTitle>

              <SheetDescription
                className="
    truncate
    text-xs
    text-gray-500
    transition-colors duration-300
    dark:text-purple-200/60
    sm:text-sm
  "
              >
                Chat with your agent and give it tasks.
              </SheetDescription>
            </div>

            {/* Connected Tools */}

            {/* {connectedTools.length > 0 && (
              <div
                className="
                  hidden
                  shrink-0
                  rounded-full
                  border
                  bg-gray-50
                  px-2.5
                  py-1
                  text-xs
                  text-gray-600
                  sm:block
                "
              >
                {connectedTools.length} tools
              </div>
            )} */}
          </div>
        </SheetHeader>

        {/* ================= CHAT AREA ================= */}

        <ScrollArea className="min-h-0 flex-1">
          <div
            className="
              flex
              min-h-full
              flex-col
              px-3
              py-4
              sm:px-5
            "
          >
            {/* Loading Tools */}

            {fetchToolsLoadingTool && (
             <div className="flex flex-1 items-center justify-center py-10">
  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-purple-300">
    <Loader2 className="size-5 animate-spin" />
    Fetching tools...
  </div>
</div>
            )}

            {/* Empty State */}

            {!fetchToolsLoadingTool && messages.length === 0 && (
              <div
                className="
                    flex
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    px-4
                    py-10
                    text-center
                  "
              >
               <div
  className="
    mb-4 flex size-14 items-center justify-center rounded-2xl
    bg-purple-100
    transition-colors duration-300
    dark:bg-purple-950/50
  "
>
  <Bot className="size-7 text-purple-600 dark:text-purple-300" />
</div>

               <h3
  className="
    text-base font-semibold
    text-gray-800
    transition-colors duration-300
    dark:text-purple-50
    sm:text-lg
  "
>
                  Start a conversation
                </h3>

           <p
  className="
    mt-1 max-w-sm
    text-xs
    text-muted-foreground
    transition-colors duration-300
    dark:text-purple-200/60
    sm:text-sm
  "
>
                  Ask your agent to perform a task, answer a question, search
                  information, or work with your connected tools.
                </p>

                {connectedTools.length > 0 && (
                  <div
                    className="
                        mt-4
                        flex
                        max-w-full
                        flex-wrap
                        justify-center
                        gap-2
                      "
                  >
                    {connectedTools.map((tool) => (
                     <span key={tool.slug}
  className="
    rounded-full
    border border-gray-200
    bg-gray-50
    px-2.5 py-1
    text-xs text-gray-600
    transition-colors duration-300
    dark:border-[#302044]
    dark:bg-[#170D29]
    dark:text-purple-200
  "
>
  {tool.name}
</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!fetchToolsLoadingTool && messages.length > 0 && (
              <div className="flex flex-col gap-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`
                        flex
                        w-full
                        gap-2.5
                        ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }
                      `}
                  >
                    {/* Agent Avatar */}

                    {message.role === "agent" && (
                    <div
  className="
    mt-1 flex size-8 shrink-0 items-center justify-center
    rounded-lg
    bg-purple-100
    transition-colors duration-300
    dark:bg-purple-950/50
  "
>
                        <img
                          src={agent?.agentImage?.toString()}
                          alt={agent?.name?.toString()}
                        />
                      </div>
                    )}

                    <div
                      className={`
    flex
    max-w-[82%]
    flex-col
    gap-1
    sm:max-w-[75%]
    ${message.role === "user" ? "items-end" : "items-start"}
  `}
                    >
                      <div
                        className={`
      rounded-2xl
      px-3.5
      py-2.5
      text-sm
      leading-relaxed
      ${
        message.role === "user"
          ? "rounded-br-md bg-purple-600 text-white dark:bg-purple-600 dark:text-white"
          : "rounded-bl-md border border-gray-200 bg-gray-50 text-gray-800 transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29] dark:text-purple-100"
      }
    `}
                      >
                        {message.role === "user" ? (
                          <div className="whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none break-words text-gray-800 dark:prose-invert dark:text-purple-100">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>

                    <span className="px-1 text-[10px] text-gray-400 dark:text-purple-300/50">
  {formatTime(message.timestamp)}
</span>
                    </div>

                    {/* User Avatar */}

                    {message.role === "user" && (
                      <div
  className="
    mt-1 flex size-8 shrink-0 items-center justify-center
    rounded-lg
    bg-gray-200
    transition-colors duration-300
    dark:bg-[#302044]
  "
>
  <User className="size-4 text-gray-600 dark:text-purple-200" />
</div>
                    )}
                  </div>
                ))}

                {/* THINKING STATE */}

                {loading && (
                  <div className="flex items-start gap-2.5">
                  <div
  className="
    flex size-8 shrink-0 items-center justify-center
    rounded-lg
    bg-purple-100
    transition-colors duration-300
    dark:bg-purple-950/50
  "
>
  <Bot className="size-4 text-purple-600 dark:text-purple-300" />
</div>

                   <div
  className="
    rounded-2xl
    rounded-bl-md
    border border-gray-200
    bg-gray-50
    px-4 py-3
    transition-colors duration-300
    dark:border-[#302044]
    dark:bg-[#170D29]
  "
>
                      <div className="flex items-center gap-1">
                       <span className="size-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-purple-400" />
                        <span
                          className="
                              size-1.5
                              animate-bounce
                              rounded-full
                              bg-gray-400
                              [animation-delay:150ms]
                            "
                        />

                        <span
                          className="
                              size-1.5
                              animate-bounce
                              rounded-full
                              bg-gray-400
                              [animation-delay:300ms]
                            "
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* ================= FOOTER ================= */}

        <SheetFooter
  className="
    shrink-0
    border-t border-gray-200
    bg-white
    p-3
    transition-colors duration-300
    dark:border-[#302044]
    dark:bg-[#170D29]
    sm:p-4
  "
>
          <div className="w-full">
            {/* Input Container */}

            <div
  className="
    w-full rounded-2xl
    border border-purple-500
    bg-white
    p-2
    shadow-lg
    transition-colors duration-300
    focus-within:ring-2
    focus-within:ring-purple-100
    dark:bg-[#100A1F]
    dark:focus-within:ring-purple-950/60
  "
>
              {/* Textarea */}

              <textarea
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  onKeyDown={handleKeyDown}
  disabled={loading || fetchToolsLoadingTool}
  placeholder={
    loading
      ? "Agent is thinking..."
      : "Ask your agent to do something..."
  }
  rows={2}
  className="
    max-h-32
    min-h-14
    w-full
    resize-none
    bg-transparent
    px-2 py-2
    text-sm
    text-gray-900
    outline-none
    transition-colors duration-300
    placeholder:text-gray-400
    disabled:cursor-not-allowed
    disabled:opacity-60
    dark:text-purple-50
    dark:placeholder:text-purple-300/40
  "
/>

              {/* Footer Actions */}

              <div className="flex items-center justify-between">
                {/* Left */}

                <Button
  type="button"
  variant="ghost"
  size="icon"
  disabled={loading}
  className="
    size-9
    cursor-pointer
    rounded-full
    text-gray-600
    transition-colors duration-300
    hover:bg-gray-100
    hover:text-gray-900
    dark:text-purple-300
    dark:hover:bg-purple-950/50
    dark:hover:text-purple-50
  "
>
  <Plus className="size-5" />
</Button>

                {/* Right */}

              <Button
  type="button"
  disabled={loading || fetchToolsLoadingTool || !prompt.trim()}
  onClick={onSubmitHandle}
  size="icon"
  className="
    size-9
    cursor-pointer
    rounded-full
    bg-purple-600
    text-white
    transition-colors duration-300
    hover:bg-purple-700
    dark:bg-purple-600
    dark:hover:bg-purple-500
    disabled:cursor-not-allowed
  "
>
                  {loading ? (
                    <Loader2 className="size-4 animate-spin text-white" />
                  ) : (
                    <ArrowUp className="size-4 text-white" />
                  )}
                </Button>
              </div>
            </div>

            {/* Helper */}

           <p
  className="
    mt-1.5
    text-center
    text-[10px]
    text-muted-foreground
    transition-colors duration-300
    dark:text-purple-300/60
    sm:text-xs
  "
>
  Enter to send · Shift + Enter for a new line
</p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ChatAgentDrawer;
