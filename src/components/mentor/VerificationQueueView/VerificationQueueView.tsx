"use client";

import { useState } from "react";
import { Inbox, WifiOff } from "lucide-react";
import {
  useVerificationQueue,
  useVerifySubmission,
  useRequestResubmission,
  useConnectivity,
  useSocketEvents,
} from "@/hooks";
import { queryKeys } from "@/hooks/keys";
import { EmptyState, ErrorState } from "@/components/ui";
import { QueueItem } from "./QueueItem";
import { ResubmissionModal } from "./ResubmissionModal";
import type { VerificationItem } from "@/lib/types";

export const VerificationQueueView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useVerificationQueue();
  const verifyMutation = useVerifySubmission();
  const resubmitMutation = useRequestResubmission();
  const [resubmitItem, setResubmitItem] = useState<VerificationItem | null>(
    null
  );

  useSocketEvents(["assignment.verified"], {
    invalidateKeys: [queryKeys.verificationQueue],
  });

  const handleVerify = (id: string) => {
    verifyMutation.mutate({ submissionId: id });
  };

  const handleResubmit = async (item: VerificationItem, comment: string) => {
    await resubmitMutation.mutateAsync({
      submissionId: item.id,
      comment,
    });
    setResubmitItem(null);
  };

  if (isLoading) {
    return <VerificationSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header />
        <ErrorState
          title="Could not load the verification queue"
          message="Something went wrong while loading pending submissions. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. You can&apos;t verify submissions until you
          reconnect.
        </div>
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-7 w-7" aria-hidden="true" />}
          title="Queue is clear"
          description="You have no submissions waiting for verification right now."
        />
      ) : (
        <ul className="space-y-4">
          {data?.map((item) => (
            <li key={item.id}>
              <QueueItem
                item={item}
                isVerifying={
                  verifyMutation.isPending &&
                  verifyMutation.variables?.submissionId === item.id
                }
                onVerify={handleVerify}
                onRequestResubmission={setResubmitItem}
              />
            </li>
          ))}
        </ul>
      )}

      <ResubmissionModal
        item={resubmitItem}
        open={resubmitItem !== null}
        onClose={() => setResubmitItem(null)}
        onRequest={handleResubmit}
        isSubmitting={resubmitMutation.isPending}
        error={
          resubmitMutation.isError
            ? "Couldn't send the request. Please try again."
            : null
        }
      />

      <p className="sr-only" role="status" aria-live="polite">
        {data?.length ?? 0} submission{data?.length === 1 ? "" : "s"} pending
        review
      </p>
    </div>
  );
};

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        Verification Queue
      </h1>
      <p className="mt-1 text-neutral-600">
        Review and verify submissions from your scholars.
      </p>
    </div>
  );
}

function VerificationSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading verification queue"
    >
      <div className="skeleton-shimmer h-8 w-52 rounded-lg" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="skeleton-shimmer h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton-shimmer h-4 w-1/2 rounded-md" />
                <div className="skeleton-shimmer h-3 w-2/3 rounded-md" />
              </div>
              <div className="skeleton-shimmer h-11 w-28 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
