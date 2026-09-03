import { Suspense } from "react";
import { MagicLinkSentView } from "@/components/auth/MagicLinkSentView";
import { LoadingSpinner } from "@/components/ui";

export default function MagicLinkSentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner label="Loading..." />
        </div>
      }
    >
      <MagicLinkSentView />
    </Suspense>
  );
}
