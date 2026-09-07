"use client";

import { ErrorState } from "@/components/ui";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <ErrorState
        title="Could not load meetings"
        message="Something went wrong. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
