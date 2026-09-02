import { ScholarLayout } from "@/components/layouts";

export default function ScholarLayoutGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ScholarLayout>{children}</ScholarLayout>;
}
