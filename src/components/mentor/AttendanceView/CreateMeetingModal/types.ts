export interface CreateMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: {
    title: string;
    startsAt: string;
    courseId?: string;
  }) => Promise<void>;
  courses: Array<{ id: string; name: string }>;
  isSubmitting: boolean;
  error?: string | null;
}
