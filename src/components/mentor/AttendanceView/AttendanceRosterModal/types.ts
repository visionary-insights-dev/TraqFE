import type { AttendanceStatus, Meeting, MentorScholar } from "@/lib/types";

export interface AttendanceRosterModalProps {
  meeting: Meeting | null;
  scholars: MentorScholar[];
  open: boolean;
  onClose: () => void;
  onSave: (
    meetingId: string,
    records: Array<{ scholarId: string; attendance: AttendanceStatus }>
  ) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
}
