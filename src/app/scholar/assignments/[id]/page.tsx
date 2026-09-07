import { AssignmentsView } from "@/components/scholar/AssignmentsView";

export default async function ScholarAssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void id;
  return <AssignmentsView />;
}
