import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateAgentType } from "@/lib/types";
import {
  CalendarClock,
  Edit2,
  Ellipsis,
  Pause,
  Pencil,
  Play,
  PlaySquareIcon,
  Trash2,
} from "lucide-react";
import EditAgentCard from "../../GlobalAgentsComponents/EditAgentCard";

type Props = {
  createdAgent: CreateAgentType | null;
  setUpdatedAgent: any;
  onDelete: any;
  updateAgentStatus: any;
  setCloseEidtSheet:any;
  setSelectAgentToUpdate:any;
};

const NewAgentCard = ({
  createdAgent,
  setUpdatedAgent,
  onDelete,
  updateAgentStatus,
  setCloseEidtSheet,
  setSelectAgentToUpdate,
}: Props) => {
  const isActive = createdAgent?.status === "active";

  return (
    <div
      className="
    mt-5 flex w-full cursor-pointer flex-col gap-3 rounded-xl
    border border-gray-300 bg-white p-3 shadow-md
    transition-all duration-300
    hover:border-gray-400 hover:shadow-xl

    dark:border-[#302044]
    dark:bg-[#170D29]
    dark:hover:border-[#6D28D9]
    dark:hover:bg-[#1B1030]
    dark:hover:shadow-[0_0_20px_rgba(109,40,217,0.18)]

    sm:p-4
    md:flex-row md:items-center md:justify-between
    xl:gap-8
  "
    >
      <div className="flex w-full min-w-0 items-start gap-3">
        <img
          src={createdAgent?.agentImage?.toString()}
          alt={createdAgent?.name?.toString()}
          className="
        size-12 shrink-0 rounded-xl
        bg-gray-200 p-2 object-contain
        transition-colors duration-300
        dark:bg-[#100A1F]
        sm:size-14
        md:size-16
      "
        />

        <div className="min-w-0 flex-1">
          {/* Name + Status */}
          <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <h1
              className="
            truncate text-lg font-bold
            text-gray-900
            transition-colors duration-300
            dark:text-purple-50
            sm:text-xl
          "
            >
              {createdAgent?.name}
            </h1>

            <div
              className={`
            flex w-fit shrink-0 items-center justify-center
            rounded-xl border px-2.5 py-0.5
            transition-colors duration-300
            ${
              isActive
                ? "border-green-900 bg-green-300 dark:border-green-800 dark:bg-green-950/50"
                : "border-yellow-600 bg-yellow-200 dark:border-yellow-800 dark:bg-yellow-950/40"
            }
          `}
            >
              <p
                className={`
              text-sm font-semibold
              transition-colors duration-300
              ${
                isActive
                  ? "text-green-800 dark:text-green-300"
                  : "text-yellow-500 dark:text-yellow-300"
              }
            `}
              >
                {createdAgent?.status}
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className="
          mt-1 line-clamp-2 text-sm font-medium
          text-gray-600
          transition-colors duration-300
          dark:text-purple-200/70
          sm:text-base
        "
          >
            {createdAgent?.description}
          </p>

          {/* Schedule Information */}
          <div
            className="
          mt-2 flex flex-col gap-1
          text-sm text-muted-foreground
          transition-colors duration-300
          dark:text-purple-200/60
          sm:flex-row sm:items-center sm:justify-between sm:gap-3
        "
          >
            <div className="flex min-w-0 items-center gap-1">
              <CalendarClock
                className="
              size-4 shrink-0
              text-gray-400
              dark:text-purple-400/60
              sm:size-5
            "
              />

              <p className="truncate">
                Next run on{" "}
                {createdAgent?.schedule?.time === "now"
                  ? `${String(new Date().getHours()).padStart(2, "0")}:${String(
                      new Date().getMinutes(),
                    ).padStart(2, "0")}`
                  : createdAgent?.schedule?.time || ""}
              </p>
            </div>

            <p className="shrink-0">
              Runs {createdAgent?.schedule?.frequency || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="
      flex w-full items-center justify-end gap-1
      border-t border-gray-200 pt-2
      transition-colors duration-300
      dark:border-[#302044]
      md:w-auto md:shrink-0
      md:border-t-0 md:pt-0
    "
      >
        <EditAgentCard
          createdAgent={createdAgent}
          setUpdatedAgent={setUpdatedAgent}
        >
          <Button
            variant="ghost"
            size="icon"
            className="
          cursor-pointer
          text-gray-600
          transition-all duration-300
          hover:bg-gray-100
          hover:text-gray-900
          hover:scale-105

          dark:text-purple-200
          dark:hover:bg-[#2A1245]
          dark:hover:text-purple-50
        "
          >
            <Pencil className="size-4" />
          </Button>
        </EditAgentCard>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="
              cursor-pointer
              text-gray-600
              transition-all duration-300
              hover:bg-gray-100
              hover:text-gray-900
              hover:scale-105

              dark:text-purple-200
              dark:hover:bg-[#2A1245]
              dark:hover:text-purple-50
            "
                size="icon"
              />
            }
          >
            <Ellipsis className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="
          border-gray-200
          bg-white
          text-gray-900
          shadow-lg

          dark:border-[#432663]
          dark:bg-[#170D29]
          dark:text-purple-50
          dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
        "
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="
              cursor-pointer
              transition-colors duration-200
              hover:bg-purple-50
              hover:text-purple-700

              dark:text-purple-100
              dark:hover:bg-[#2A1245]
              dark:hover:text-purple-50
              dark:focus:bg-[#2A1245]
              dark:focus:text-purple-50
            "
              >
                <Play className="text-gray-600 dark:text-purple-300" />
                Run New
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => updateAgentStatus(createdAgent)}
                className="
              cursor-pointer
              transition-colors duration-200
              hover:bg-purple-50
              hover:text-purple-700

              dark:text-purple-100
              dark:hover:bg-[#2A1245]
              dark:hover:text-purple-50
              dark:focus:bg-[#2A1245]
              dark:focus:text-purple-50
            "
              >
                {isActive ? (
                  <>
                    <Pause className="text-gray-600 dark:text-purple-300" />
                    Pause Agent
                  </>
                ) : (
                  <>
                    <PlaySquareIcon className="text-gray-600 dark:text-purple-300" />
                    Activate Agent
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
              onClick={()=>{
                setCloseEidtSheet(true);
                setSelectAgentToUpdate(createdAgent)
              }}
                className="
              cursor-pointer
              transition-colors duration-200
              hover:bg-purple-50
              hover:text-purple-700

              dark:text-purple-100
              dark:hover:bg-[#2A1245]
              dark:hover:text-purple-50
              dark:focus:bg-[#2A1245]
              dark:focus:text-purple-50
            "
              >
                <Edit2 className="text-gray-600 dark:text-purple-300" />
                Edit Agent
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#302044]" />

            <DropdownMenuGroup onClick={() => onDelete(true)}>
              <DropdownMenuItem
                variant="destructive"
                className="
              cursor-pointer
              transition-colors duration-200
              dark:focus:bg-red-950/40
            "
              >
                <Trash2 />
                Delete Agent
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NewAgentCard;
