import { MentorLayout } from "@/components/layouts";

export default function MentorLayoutGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MentorLayout>{children}</MentorLayout>;
}
