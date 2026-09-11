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
        "glass-surface glass-edge flex h-full w-64 shrink-0 flex-col border-r border-white/40 dark:border-white/8",
        className
      )}
      {...props}
    >
      {brand ? (
        <div className="flex h-16 items-center border-b border-white/40 px-5 dark:border-white/5">
          {brand}
        </div>
      ) : null}
      <nav
        className="flex-1 space-y-1.5 overflow-y-auto p-3"
        aria-label="Main navigation"
      >
        {items.map((item, index) => (
          <SidebarNavItem key={item.href} item={item} index={index} />
        ))}
      </nav>
      {footer ? (
        <div className="border-t border-white/40 p-3 dark:border-white/5">
          {footer}
        </div>
      ) : null}
    </aside>
  );
};

export const SidebarNavItem = ({
  item,
  index = 0,
}: {
  item: NavItem;
  index?: number;
}) => {
  const Icon = item.icon;
  const delay = ["dash-1", "dash-2", "dash-3", "dash-4", "dash-5"][
    index % 5
  ];
  return (
    <a
      href={item.href}
      aria-current={item.active ? "page" : undefined}
      className={cn(
        "dash-enter group flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98]",
        delay,
        item.active
          ? "ember-glow bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md shadow-amber-500/30"
          : "text-neutral-700 hover:bg-white/60 hover:text-neutral-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
      )}
    >
      {Icon ? (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
            item.active
              ? "bg-white/25 text-amber-950"
              : "bg-white/50 text-neutral-500 group-hover:bg-white/80 group-hover:text-neutral-800 dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-white/10 dark:group-hover:text-slate-200"
          )}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
      ) : null}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? item.badge : null}
    </a>
  );
};

export type { NavItem };