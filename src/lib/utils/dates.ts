import { format, formatDistanceToNow, isPast, parseISO } from "date-fns";

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy · h:mm a");
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), "h:mm a");
}

export function relativeTime(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true });
}

export function isOverdue(iso: string): boolean {
  return isPast(parseISO(iso));
}
