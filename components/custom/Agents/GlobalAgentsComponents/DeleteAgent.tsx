import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import { useTheme } from "@/context/ThemeContext";
import { CreateAgentType } from "@/lib/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  openAlert: boolean;
  onClose: () => void;
  agent: CreateAgentType | null;

  // For agent list page
  allAgents?: CreateAgentType[];
  setAgents?: React.Dispatch<React.SetStateAction<CreateAgentType[]>>;

  // For CreateAgents page
  onDeleted?: () => void;
};

const DeleteAgent = ({
  openAlert,
  onClose,
  agent,
  allAgents,
  setAgents,
  onDeleted,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAgent = async () => {
    if (!agent?.id || isDeleting) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await axios.delete("/api/agent/config", {
        data: {
          agentId: agent.id,
        },
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || "Failed to delete agent");
      }

      toast.add({
        type: "success",
        title: `"${agent.name}" deleted successfully`,
      });

      // Update agent list if provided
      if (setAgents && allAgents) {
        setAgents(allAgents.filter((item) => item.id !== agent.id));
      }

      // Notify parent
      onDeleted?.();

      // Close dialog
      onClose();
    } catch (error) {
      console.error("Failed to delete agent:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to delete agent."
        : error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setError(message);

      toast.add({
        type: "error",
        title: message,
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const theme = useTheme();

  return (
    <AlertDialog open={openAlert}>
      <AlertDialogContent
        data-theme={theme.theme}
        className="
    border-purple-200
    bg-white
    text-gray-900
    transition-colors duration-300

    dark:border-[#432663]
    dark:bg-[#1A0B2E]
    dark:text-purple-50
  "
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            className="
        text-muted-foreground
        dark:text-purple-200
      "
          >
            <span
              className="
          text-xl font-semibold
          text-red-600
          dark:text-red-400
        "
            >
              Delete "{agent?.name}"
            </span>
            ?
          </AlertDialogTitle>

          <AlertDialogDescription
            className="
        text-gray-600
        transition-colors duration-300
        dark:text-purple-200/70
      "
          >
            This will permanently delete the agent and remove all of its
            scheduled executions and configuration. You won't be able to recover
            this agent after deletion.
          </AlertDialogDescription>

          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="dark:bg-purple-900">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isDeleting}
            className="
        cursor-pointer
        border-gray-200
        bg-white
        text-gray-700
        transition-colors duration-300
        hover:bg-gray-100

        dark:border-[#432663]
        dark:bg-[#150822]
        dark:text-purple-200
        dark:hover:bg-[#2A1245]
        dark:hover:text-purple-50
      "
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeleteAgent}
            variant="destructive"
            disabled={isDeleting}
            className="
        cursor-pointer
        bg-red-600
        text-white
        transition-colors duration-300
        hover:bg-red-700
        dark:bg-red-600
        dark:hover:bg-red-500
      "
          >
            {isDeleting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAgent;
