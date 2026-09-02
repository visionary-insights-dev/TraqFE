import { cn } from "@/lib/utils";
import type { SidebarProps, NavItem } from "./types";

export const Sidebar = ({
  items,
  footer,
  brand,
  className,
  ...props
}: SidebarProps) => {
  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-neutral-200 bg-white",
        className
      )}
      {...props}
    >
      {brand ? (
        <div className="flex h-16 items-center border-b border-neutral-200 px-5">
          {brand}
        </div>
      ) : null}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main navigation">
        {items.map((item) => (
          <SidebarNavItem key={item.href} item={item} />
        ))}
      </nav>
      {footer ? (
        <div className="border-t border-neutral-200 p-3">{footer}</div>
      ) : null}
    </aside>
  );
};

export const SidebarNavItem = ({ item }: { item: NavItem }) => {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      aria-current={item.active ? "page" : undefined}
      className={cn(
        "flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        item.active
          ? "bg-brand-50 text-brand-700"
          : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
      )}
    >
      {Icon ? <Icon className="h-5 w-5 shrink-0" aria-hidden="true" /> : null}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? item.badge : null}
    </a>
  );
};

export type { NavItem };
