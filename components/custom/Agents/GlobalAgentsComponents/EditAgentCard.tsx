import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateAgentType } from "@/lib/types";
import { Loader, Plus, Shuffle, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import ConnectedTools from "../SubComponents/CreateAgentComponents/ConnectedTools";
import { toast } from "@/components/ui/toast";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  children?: any;
  createdAgent: CreateAgentType | null;
  setUpdatedAgent: any;
  openSheet_?:boolean,
  closeSheet?:any
};

const EditAgentCard = ({ children, createdAgent, setUpdatedAgent, openSheet_=false, closeSheet=()=>{} }: Props) => {
  const [openSheet, setOpenSheet] = useState(openSheet_);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<CreateAgentType | null>(
    createdAgent,
  );
  const [skill, setSkill] = useState("");
  const addSkill = () => {
    setSelectedAgent((prev) => {
      if (!prev) return null;
      if (
        prev.skills.some(
          (item) => item.toLocaleLowerCase() === skill.toLocaleLowerCase(),
        )
      )
        return prev;
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedAgent((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        skills: prev.skills.filter(
          (item) => item.toLowerCase() !== skillToRemove.toLowerCase(),
        ),
      };
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleShuffleImage = () => {
    const randomSeed = crypto.randomUUID();
    const newImage = `https://api.dicebear.com/10.x/gaze/svg?tags=animation&seed=${randomSeed}`;
    setSelectedAgent((prev: any) => ({ ...prev, agentImage: newImage }));
  };
  const theme=useTheme()
  const updateSelectedAgent = (key: string, value: string) =>
    setSelectedAgent((prev: any) => ({ ...prev, [key]: value }));
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedAgent) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const { data } = await axios.put("/api/agent/config", {
        updatedData: selectedAgent,
      });

      setUpdatedAgent(data.agent);
      setSelectedAgent(data.agent);

      setOpenSheet(false);
      closeSheet(false);

      toast.add({
        type: "success",
        title: "Agent Updated",
        description: "Changes have been saved successfully.",
      });
    } catch (error: any) {
      console.error("Update agent error:", error);

      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update agent.";

      setUpdateError(message);

      toast.add({
        type: "error",
        title: "Update Failed",
        description: message,
      });
    } finally {
      setIsUpdating(false);
    }
  };
  const items = [
    { label: "Once", value: "once" },
    { label: "Manual", value: "manual" },
    { label: "Recurring", value: "recurring" },
  ];
  const frequencyItems = [
    { label: "Hourly", value: "hourly" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  return (
   <Sheet
  open={openSheet}
  onOpenChange={(v: boolean) => {
    setOpenSheet(v);
    closeSheet(v);
  }}
>
  <SheetTrigger>{children}</SheetTrigger>

  <form
    onSubmit={handleFormSubmit}
    id="update-agent-form"
    className="min-h-0 flex-1 flex-col"
  >
   <SheetContent
  data-theme={theme.theme}
  className="
    flex h-full flex-col overflow-hidden
    bg-background text-foreground
    border-border
    transition-colors duration-300

    dark:border-[#302044]
    dark:bg-[#100A1F]
    dark:text-purple-50
  "
>
      <SheetHeader className="border-b border-gray-200 py-4 shadow-md transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29]">
        <div className="flex items-center gap-3 pr-14">
          <div>
            <Image
              src={"/logo.svg"}
              alt="logo"
              width={40}
              height={40}
            />
          </div>

          <div>
            <SheetTitle className="text-gray-900 dark:text-purple-50">
              Are you absolutely sure?
            </SheetTitle>

            <SheetDescription className="line-clamp-1 dark:text-purple-200/60">
              Update how this agent look, works and more...
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <ScrollArea className="min-h-0 w-full flex-1 px-4 py-2">
        {/* Agent Image */}
        <section className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-2 transition-colors duration-300 hover:border-gray-400 dark:border-[#302044] dark:bg-[#170D29] dark:hover:border-purple-800">
          <div>
            <img
              src={selectedAgent?.agentImage?.toString()}
              alt={selectedAgent?.name ?? ""}
              height={80}
              width={80}
              className="size-20 rounded-xl border bg-slate-200 object-center p-3 transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F]"
            />
          </div>

          <div className="space-y-1">
            <p className="font-medium text-gray-900 dark:text-purple-50">
              Agent Image
            </p>

            <p className="text-xs text-muted-foreground dark:text-purple-200/60">
              Shuffle to generate new look.
            </p>

            <Button
              variant={"outline"}
              onClick={handleShuffleImage}
              className="cursor-pointer transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-200 dark:hover:bg-purple-950/40 dark:hover:text-purple-50"
            >
              <Shuffle />
              Suffle Image
            </Button>
          </div>
        </section>

        {/* Agent Name */}
        <section className="mt-5">
          <Label
            htmlFor="agent-name"
            className="text-lg font-semibold text-gray-900 dark:text-purple-50"
          >
            Agent Name
          </Label>

          <Input
            id="agent-name"
            value={selectedAgent?.name?.toString()}
            onChange={(e) =>
              updateSelectedAgent("name", e.target.value)
            }
            className="px-2 py-1 text-base font-medium transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29] dark:text-purple-50 dark:placeholder:text-purple-300/40 dark:focus:border-purple-500"
            placeholder="write your Agent name."
          />
        </section>

        {/* Objective */}
        <section className="mt-5 space-y-2">
          <Label
            htmlFor="agent-prompt"
            className="text-lg font-semibold text-gray-900 dark:text-purple-50"
          >
            Objective
          </Label>

          <Textarea
            id="agent-prompt"
            value={selectedAgent?.objective?.toString()}
            onChange={(e) =>
              updateSelectedAgent("objective", e.target.value)
            }
            placeholder="Describe how the result should look like."
            className="min-h-24 resize-y transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29] dark:text-purple-50 dark:placeholder:text-purple-300/40 dark:focus:border-purple-500"
          />
        </section>

        {/* Instructions */}
        <section className="mt-5 space-y-2">
          <Label
            htmlFor="instructions"
            className="text-lg font-semibold text-gray-900 dark:text-purple-50"
          >
            Instructions
          </Label>

          <Textarea
            id="instructions"
            value={selectedAgent?.instructions?.toString()}
            onChange={(e) =>
              updateSelectedAgent("instructions", e.target.value)
            }
            placeholder="Describe how the result should look like."
            className="min-h-24 resize-y text-base font-medium transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29] dark:text-purple-50 dark:placeholder:text-purple-300/40 dark:focus:border-purple-500"
          />
        </section>

        {/* Schedule */}
        <section className="mt-5 flex w-full flex-col gap-3 rounded-xl border border-gray-300 p-3 transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29] sm:p-4">
          {/* Header */}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-purple-50">
              Schedule
            </h1>

            <p className="text-sm font-normal text-gray-500 dark:text-purple-200/60">
              Choose when and how often this agent runs.
            </p>
          </div>

          {/* Run Type + Time */}
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            {/* Run Type */}
            <div className="flex w-full flex-col gap-1 sm:w-auto">
              <h2 className="text-sm font-medium text-gray-900 dark:text-purple-100">
                Run type
              </h2>

              <Select
                items={items}
                value={selectedAgent?.schedule?.type ?? ""}
                onValueChange={(value) => {
                  setSelectedAgent((prev) => {
                    if (!prev) return null;

                    return {
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        type: value as "once" | "recurring" | "manual",

                        ...(value === "manual"
                          ? {
                              time: undefined,
                              frequency: undefined,
                            }
                          : {}),

                        ...(value === "once"
                          ? {
                              frequency: undefined,
                            }
                          : {}),
                      },
                    };
                  });
                }}
              >
                <SelectTrigger className="w-full transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-50 sm:w-[180px]">
                  <SelectValue placeholder="Run type" />
                </SelectTrigger>

                <SelectContent className="dark:border-[#302044] dark:bg-[#170D29]">
                  {items.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="dark:text-purple-100 dark:focus:bg-purple-950/50"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            {selectedAgent?.schedule?.type !== "manual" && (
              <div className="flex w-full flex-col gap-1">
                <h2 className="text-sm font-medium text-gray-900 dark:text-purple-100">
                  Time
                </h2>

                <Input
                  type="time"
                  className="w-full transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-50 dark:[color-scheme:dark]"
                  value={
                    selectedAgent?.schedule?.time === "now"
                      ? `${String(new Date().getHours()).padStart(
                          2,
                          "0",
                        )}:${String(
                          new Date().getMinutes(),
                        ).padStart(2, "0")}`
                      : (selectedAgent?.schedule?.time ?? "")
                  }
                  onChange={(e) => {
                    setSelectedAgent((prev) => {
                      if (!prev) return null;

                      return {
                        ...prev,
                        schedule: {
                          ...prev.schedule,
                          time: e.target.value,
                        },
                      };
                    });
                  }}
                />
              </div>
            )}
          </div>

          {/* Frequency */}
          {selectedAgent?.schedule?.type === "recurring" && (
            <div className="flex w-full flex-col gap-1">
              <h2 className="text-sm font-medium text-gray-900 dark:text-purple-100">
                Frequency
              </h2>

              <Select
                items={frequencyItems}
                value={selectedAgent?.schedule?.frequency ?? ""}
                onValueChange={(value) => {
                  setSelectedAgent((prev) => {
                    if (!prev) return null;

                    return {
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        frequency: value as
                          | "hourly"
                          | "daily"
                          | "weekly"
                          | "monthly",
                      },
                    };
                  });
                }}
              >
                <SelectTrigger className="w-full transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-50">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>

                <SelectContent className="dark:border-[#302044] dark:bg-[#170D29]">
                  {frequencyItems.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="dark:text-purple-100 dark:focus:bg-purple-950/50"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </section>

        {/* Skills */}
        <div className="mt-5 w-full max-w-md space-y-2 rounded-xl border border-gray-200 p-3 transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29]">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-purple-50">
              Skills
            </h1>

            <p className="-mt-1.5 text-sm font-normal text-gray-500 dark:text-purple-200/60">
              Add or Remove capabilities this agent should use.
            </p>
          </div>

          {/* Skills container */}
          <div className="min-h-20 rounded-xl border bg-background p-2 transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F]">
            <div className="flex flex-wrap gap-2">
              {(selectedAgent?.skills ?? []).map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="rounded-full px-3 py-1.5 text-xs font-normal dark:bg-purple-950/50 dark:text-purple-100"
                >
                  {item}

                  <button
                    type="button"
                    onClick={() => removeSkill(item)}
                    className="ml-1 rounded-full opacity-60 transition-opacity hover:opacity-100"
                    aria-label={`Remove ${item}`}
                  >
                    <X className="size-3 cursor-pointer" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Add skill */}
          <div className="flex gap-2">
            <Input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a skill"
              className="h-9 rounded-lg transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-50 dark:placeholder:text-purple-300/40 dark:focus:border-purple-500"
            />

            <Button
              type="button"
              onClick={addSkill}
              variant="outline"
              className="h-9 shrink-0 cursor-pointer rounded-lg px-4 transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-200 dark:hover:bg-purple-950/40 dark:hover:text-purple-50"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <ConnectedTools selectedAgent={selectedAgent} />

        {/* Output Format */}
        <section className="mt-5 space-y-2">
          <Label
            htmlFor="output-formate"
            className="text-lg font-semibold text-gray-900 dark:text-purple-50"
          >
            Output Formate
          </Label>

          <Textarea
            id="output-formate"
            value={selectedAgent?.outputFormate?.toString()}
            onChange={(e) =>
              updateSelectedAgent("outputFormate", e.target.value)
            }
            placeholder="Describe how the result should look like."
            className="min-h-24 resize-y transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29] dark:text-purple-50 dark:placeholder:text-purple-300/40 dark:focus:border-purple-500"
          />
        </section>
      </ScrollArea>

      {/* Footer */}
      <SheetFooter className="border border-gray-200 py-2 transition-colors duration-300 dark:border-[#302044] dark:bg-[#170D29]">
        <div className="flex w-full items-center gap-4">
          <Button
            variant={"outline"}
            className="flex-1/2 cursor-pointer px-4 py-2 transition-colors duration-300 dark:border-[#302044] dark:bg-[#100A1F] dark:text-purple-200 dark:hover:bg-purple-950/40 dark:hover:text-purple-50"
            onClick={() => setOpenSheet(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>

          <button
            type="submit"
            form="update-agent-form"
            disabled={isUpdating}
            className="flex-1/2 cursor-pointer rounded-xl bg-linear-to-r from-purple-500 to-pink-500 px-4 py-2 text-white transition-all duration-300 hover:bg-linear-to-l hover:shadow-lg hover:shadow-purple-950/30 focus:ring-purple-200 dark:focus:ring-purple-800"
          >
            {isUpdating ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="size-6 animate-spin text-white" />
                Updating...
              </div>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </SheetFooter>
    </SheetContent>
  </form>
</Sheet>
  );
};

export default EditAgentCard;
