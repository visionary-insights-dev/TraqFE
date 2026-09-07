import type { MentorAssignment } from "@/lib/types";

export interface AssignmentRowProps {
  assignment: MentorAssignment;
  now: number;
  onOpen: (id: string) => void;
  onRequestChange: (assignment: MentorAssignment) => void;
}
