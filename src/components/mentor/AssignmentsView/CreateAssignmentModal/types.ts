export interface CreateAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: {
    title: string;
    description: string;
    dueAt: string;
    courseId: string;
    audience: string;
  }) => Promise<void>;
  courses: Array<{ id: string; name: string }>;
  isSubmitting: boolean;
  error?: string | null;
}
