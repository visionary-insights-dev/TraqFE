import type { UpcomingMeeting } from "@/lib/types";

export interface MeetingsViewProps {
  meetings: UpcomingMeeting[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}