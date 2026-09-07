import {
  CircleDashed,
  CircleDot,
  Clock,
  CheckCircle2,
  RotateCcw,
  CircleAlert,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui";
import type { AssignmentStatus } from "@/lib/types";
import type { AssignmentStatusBadgeProps } from "./types";

interface StatusConfig {
  label: string;
  variant: "neutral" | "blue" | "amber" | "green" | "orange" | "red";
  icon: LucideIcon;
}

export const assignmentStatusConfig: Record<
  AssignmentStatus,
  StatusConfig
> = {
  NOT_STARTED: {
    label: "Not started",
    variant: "neutral",
    icon: CircleDashed,
  },
  IN_PROGRESS: {
    label: "In progress",
    variant: "blue",
    icon: CircleDot,
  },
  PENDING_VERIFICATION: {
    label: "Pending review",
    variant: "amber",
    icon: Clock,
  },
  VERIFIED: {
    label: "Completed",
    variant: "green",
    icon: CheckCircle2,
  },
  VERIFIED_LATE: {
    label: "Completed (late)",
    variant: "green",
    icon: CheckCircle2,
  },
  RESUBMISSION_REQUIRED: {
    label: "Changes requested",
    variant: "orange",
    icon: RotateCcw,
  },
  OVERDUE: {
    label: "Overdue",
    variant: "red",
    icon: CircleAlert,
  },
};

export const AssignmentStatusBadge = ({
  status,
  showIcon = true,
}: AssignmentStatusBadgeProps) => {
  const config = assignmentStatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant}>
      {showIcon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      <span>{config.label}</span>
    </Badge>
  );
};
