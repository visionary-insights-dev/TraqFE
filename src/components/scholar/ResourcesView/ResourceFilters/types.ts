import type { ResourceType } from "@/lib/types";

export type ResourceTypeFilter = "ALL" | ResourceType;

export interface ResourceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: ResourceTypeFilter;
  onTypeChange: (value: ResourceTypeFilter) => void;
}
