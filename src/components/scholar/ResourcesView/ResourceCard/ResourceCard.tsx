import { FileText, Link2, File, Video, ExternalLink, Lock, type LucideIcon } from "lucide-react";
import { Badge, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dates";
import type { ResourceType } from "@/lib/types";
import type { ResourceCardProps } from "./types";

const RESOURCE_ICONS: Record<ResourceType, LucideIcon> = {
  PDF: FileText,
  LINK: Link2,
  FILE: File,
  VIDEO: Video,
};

const RESOURCE_ACCENT: Record<ResourceType, string> = {
  PDF: "bg-gradient-to-br from-danger-light to-danger/15 text-danger-dark",
  LINK: "bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800",
  FILE: "bg-gradient-to-br from-neutral-200 to-neutral-300/60 text-neutral-700",
  VIDEO: "bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-800",
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  PDF: "PDF",
  LINK: "Link",
  FILE: "File",
  VIDEO: "Video",
};

export const ResourceCard = ({ resource }: ResourceCardProps) => {
  const Icon = RESOURCE_ICONS[resource.type];
  const isExternal = resource.type === "LINK";

  return (
    <Card className="group glass-card glass-edge relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      {/* Type accent rail */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-1 bg-gradient-to-b",
          resource.type === "PDF" && "from-danger to-rose-400",
          resource.type === "LINK" && "from-brand-500 to-violet-500",
          resource.type === "FILE" && "from-neutral-400 to-neutral-600",
          resource.type === "VIDEO" && "from-secondary-500 to-secondary-700"
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />

      <CardContent className="flex items-start gap-4 py-5 pl-6">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105",
            RESOURCE_ACCENT[resource.type]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className="min-w-0 truncate font-medium text-neutral-900 dark:text-white"
              title={resource.name}
            >
              {resource.name}
            </p>
            {resource.visibility === "PRIVATE" ? (
              <Badge variant="amber">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Private
              </Badge>
            ) : null}
          </div>
          <p className="mt-0.5 text-sm text-neutral-600 dark:text-slate-400">
            {resource.courseName ?? RESOURCE_TYPE_LABELS[resource.type]}
            {resource.courseName ? ` · ${RESOURCE_TYPE_LABELS[resource.type]}` : ""} ·{" "}
            {formatDate(resource.uploadedAt)}
          </p>
        </div>
        {resource.url ? (
          <a
            href={resource.url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            download={!isExternal}
            aria-label={
              isExternal
                ? `Open ${resource.name} in a new tab`
                : `Download ${resource.name}`
            }
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl text-neutral-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-95 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-brand-300"
          >
            <ExternalLink className="h-5 w-5" aria-hidden="true" />
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
};
