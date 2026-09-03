"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import type { AttendanceStatus } from "@/lib/types";
import type { AttendanceRosterModalProps } from "./types";

const OPTIONS: Array<{ value: AttendanceStatus; label: string }> = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "EXCUSED", label: "Excused" },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export const AttendanceRosterModal = ({
  meeting,
  scholars,
  open,
  onClose,
  onSave,
  isSubmitting,
  error,
}: AttendanceRosterModalProps) => {
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});

  const setAttendance = (scholarId: string, value: AttendanceStatus) => {
    setRecords((prev) => ({ ...prev, [scholarId]: value }));
  };

  const count = {
    PRESENT: scholars.filter((s) => records[s.id] === "PRESENT").length,
    ABSENT: scholars.filter((s) => records[s.id] === "ABSENT").length,
    EXCUSED: scholars.filter((s) => records[s.id] === "EXCUSED").length,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meeting || isSubmitting) return;
    const roster = scholars.map((s) => ({
      scholarId: s.id,
      attendance: records[s.id] ?? "ABSENT",
    }));
    await onSave(meeting.id, roster);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setRecords({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Attendance Roster"
      description={
        meeting ? `Mark attendance for “${meeting.title}”.` : "Mark attendance"
      }
      size="xl"
    >
      <form onSubmit={handleSubmit}>
        <p className="mb-3 text-xs text-neutral-500">
          Excused scholars are excluded from the attendance rate calculation.
        </p>
        <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
          {scholars.map((scholar) => (
            <li
              key={scholar.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 bg-neutral-50/60 px-3 py-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-semibold text-neutral-700">
                  {initials(scholar.name)}
                </span>
                <span className="text-sm font-medium text-neutral-800">
                  {scholar.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5" role="group" aria-label={`Attendance for ${scholar.name}`}>
                {OPTIONS.map((opt) => {
                  const active = records[scholar.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAttendance(scholar.id, opt.value)}
                      aria-pressed={active}
                      className={`inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        active
                          ? opt.value === "PRESENT"
                            ? "bg-success-dark text-white"
                            : opt.value === "ABSENT"
                              ? "bg-danger-dark text-white"
                              : "bg-warning-dark text-white"
                          : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-600">
          <div className="flex items-center gap-1.5">
            <dt className="flex h-3 w-3 rounded-full bg-success-dark" aria-label="Present" />
            <dd>Present {count.PRESENT}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="flex h-3 w-3 rounded-full bg-danger-dark" aria-label="Absent" />
            <dd>Absent {count.ABSENT}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="flex h-3 w-3 rounded-full bg-warning-dark" aria-label="Excused" />
            <dd>Excused {count.EXCUSED}</dd>
          </div>
        </dl>

        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save Attendance
          </Button>
        </div>
      </form>
    </Modal>
  );
};
