import { FileText, Link2, File, Video, ExternalLink, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
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
    <Card className="group glass-card transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl">
      <CardContent className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
            RESOURCE_ACCENT[resource.type]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-neutral-900" title={resource.name}>
            {resource.name}
          </p>
          <p className="mt-0.5 text-sm text-neutral-600">
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
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg text-neutral-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-95"
          >
            <ExternalLink className="h-5 w-5" aria-hidden="true" />
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
};
