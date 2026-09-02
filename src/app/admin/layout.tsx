import { AdminLayout } from "@/components/layouts";

export default function AdminLayoutGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
