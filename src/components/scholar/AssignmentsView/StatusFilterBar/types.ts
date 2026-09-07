import type { AssignmentFilter } from "../types";

export interface StatusFilterBarProps {
  active: AssignmentFilter;
  counts: Partial<Record<AssignmentFilter, number>>;
  onChange: (filter: AssignmentFilter) => void;
}
