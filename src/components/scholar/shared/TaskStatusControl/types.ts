import type { AssignmentStatus } from "@/lib/types";

export interface TaskStatusControlProps {
  taskId: string;
  status: AssignmentStatus;
}