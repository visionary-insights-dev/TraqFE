import { cn } from "@/lib/utils";

export interface AdminAvatarProps {
  name: string;
  avatarUrl?: string;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminAvatar({ name, avatarUrl, className }: AdminAvatarProps) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`${name}'s avatar`}
        className={cn("h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-neutral-200", className)}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200 text-sm font-semibold text-brand-800 ring-1 ring-brand-200",
        className
      )}
    >
      {initials(name) || "?"}
    </div>
  );
}