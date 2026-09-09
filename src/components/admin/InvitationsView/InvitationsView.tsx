"use client";

import { useState } from "react";
import { Send, WifiOff } from "lucide-react";
import { AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { Badge, Button, ErrorState, Input, Label, Modal } from "@/components/ui";
import {
  useConnectivity,
  useInvitations,
  useInviteUser,
  useResendInvitation,
  useRevokeInvitation,
} from "@/hooks";
import { inviteSchema } from "@/validators";
import { relativeTime } from "@/lib/utils";
import type { Invitation, InvitationStatus } from "@/lib/types";

const STATUS_CONFIG: Record<InvitationStatus, { label: string; variant: "amber" | "blue" | "green" | "red" | "neutral" }> = {
  PENDING: { label: "Pending", variant: "amber" },
  SENT: { label: "Sent", variant: "blue" },
  ACCEPTED: { label: "Accepted", variant: "green" },
  EXPIRED: { label: "Expired", variant: "neutral" },
  REVOKED: { label: "Revoked", variant: "red" },
};

export const InvitationsView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useInvitations();
  const inviteMutation = useInviteUser();
  const resendMutation = useResendInvitation();
  const revokeMutation = useRevokeInvitation();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"SCHOLAR" | "MENTOR">("SCHOLAR");
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const terminal = (status: InvitationStatus) =>
    status === "ACCEPTED" || status === "EXPIRED" || status === "REVOKED";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsed = inviteSchema.safeParse({ email, role });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }
    try {
      await inviteMutation.mutateAsync({ email: parsed.data.email, role: parsed.data.role });
      setEmail("");
      setOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not send the invite.");
    }
  };

  const handleResend = async (invitationId: string) => {
    setActionError(null);
    try {
      await resendMutation.mutateAsync(invitationId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not resend the invite.");
    }
  };

  const handleRevoke = async (invitationId: string, emailAddress: string) => {
    setActionError(null);
    if (!window.confirm(`Revoke the invitation for ${emailAddress}?`)) return;
    try {
      await revokeMutation.mutateAsync(invitationId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not revoke the invite.");
    }
  };

  if (isLoading) {
    return <InvitationsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Invitations"
          description="Invite scholars and mentors to your organization."
        />
        <ErrorState
          title="Could not load invitations"
          message="Something went wrong while loading invitations. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const invitations = data ?? [];

  const columns: Array<DataTableColumn<Invitation>> = [
    {
      key: "email",
      header: "Email",
      sortValue: (i) => i.email,
      render: (i) => (
        <p className="font-medium text-neutral-900">{i.email}</p>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortValue: (i) => i.role,
      render: (i) =>
        i.role === "MENTOR" ? <Badge variant="blue">Mentor</Badge> : <Badge variant="green">Scholar</Badge>,
    },
    {
      key: "status",
      header: "Status",
      sortValue: (i) => i.status,
      render: (i) => {
        const config = STATUS_CONFIG[i.status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "expires",
      header: "Expires",
      sortValue: (i) => i.expiresAt,
      render: (i) => (
        <span className="text-neutral-600">
          {i.status === "EXPIRED" || i.status === "REVOKED"
            ? "—"
            : relativeTime(i.expiresAt)}
        </span>
      ),
    },
    {
      key: "by",
      header: "Invited by",
      sortValue: (i) => i.invitedByName ?? "",
      render: (i) => (
        <span className="text-neutral-600">{i.invitedByName ?? "—"}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (i) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            disabled={terminal(i.status) || !isOnline}
            onClick={() => handleResend(i.id)}
            className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Resend
          </button>
          <button
            type="button"
            disabled={terminal(i.status) || !isOnline}
            onClick={() => handleRevoke(i.id, i.email)}
            className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-danger-light hover:text-danger-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:cursor-not-allowed disabled:opacity-40"
          >
            Revoke
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Invitations"
        description="Invite scholars and mentors to your organization."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Send className="h-4 w-4" aria-hidden="true" />
            New invite
          </Button>
        }
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Invitations can&apos;t be sent right now.
        </div>
      ) : null}

      {actionError ? (
        <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark">
          {actionError}
        </p>
      ) : null}

      <DataTable<Invitation>
        caption="Invitations"
        rows={invitations}
        rowKey={(i) => i.id}
        columns={columns}
        emptyTitle="No invitations yet"
        emptyDescription="Invite the first scholar or mentor to join."
        emptyAction={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Send className="h-4 w-4" aria-hidden="true" />
            New invite
          </Button>
        }
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite someone"
        description="They'll receive an email with a link that expires in 48 hours."
        size="md"
      >
        <form onSubmit={handleInvite} className="space-y-4" noValidate>
          <Input
            id="invite-email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="scholar@example.com"
            autoComplete="email"
          />
          <div>
            <Label htmlFor="invite-role">Role</Label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as "SCHOLAR" | "MENTOR")}
              className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <option value="SCHOLAR">Scholar</option>
              <option value="MENTOR">Mentor</option>
            </select>
          </div>

          {formError ? (
            <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark">
              {formError}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={inviteMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" loading={inviteMutation.isPending}>
              Send invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

function InvitationsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading invitations">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-72 rounded" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 px-4 py-4">
            <div className="skeleton-shimmer h-4 w-56 rounded" />
            <div className="skeleton-shimmer h-5 w-16 rounded-full" />
            <div className="skeleton-shimmer h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}