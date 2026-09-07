import type { Assignment } from "@/lib/types";
import type { ReactNode } from "react";

export interface AssignmentCardProps {
  assignment: Assignment;
  detailAction?: ReactNode;
  onOpen?: () => void;
}
