import type { ReactNode } from "react";

export type AssignmentFilter =
  | "ALL"
  | "PENDING"
  | "AWAITING"
  | "COMPLETED"
  | "OVERDUE";

export interface AssignmentsViewProps {
  children?: ReactNode;
}
