"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Feed" },
  { href: "/saved", label: "Saved" },
];

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-lg">
          Reading Hub
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isOnline ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
            {isOnline ? "Online" : "Offline"}
          </div>
        </nav>
      </div>
    </header>
  );
}
