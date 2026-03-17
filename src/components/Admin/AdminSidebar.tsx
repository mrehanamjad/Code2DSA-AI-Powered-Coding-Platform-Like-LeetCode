"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileCode2, 
  PlusCircle, 
  ChevronLeft,
  Code2,
  Menu,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Problems",
    href: "/admin/problems",
    icon: FileCode2,
  },
  {
    title: "Add Problem",
    href: "/admin/problems/add",
    icon: PlusCircle,
  },
  {
    title: "User Access",
    href: "/admin/users",
    icon: Users,
  },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 ease-in-out shadow-sm",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header / Logo Area */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all", collapsed && "w-0 opacity-0")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="whitespace-nowrap text-lg font-bold tracking-tight text-foreground">
            Code2DSA
          </span>
        </div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "h-8 w-8 transition-transform duration-300",
            collapsed && "rotate-180 mx-auto"
          )}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 p-3">
        {navItems.map((item) => {
          // Precise match for dashboard, startWith for others (e.g., /admin/problems/edit/1)
          const isActive = 
            item.href === "/admin" 
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-transform group-hover:scale-110", 
                isActive && "text-primary"
              )} />
              
              {!collapsed && (
                <span className="transition-opacity duration-300">{item.title}</span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-14 z-50 rounded-md bg-foreground px-2 py-1.5 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Admin Badge */}
      <div className="absolute bottom-6 left-0 w-full px-4">
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          collapsed ? "opacity-0 h-0" : "opacity-100 h-auto"
        )}>
          <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Admin Mode</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Full access to platform management and analytics.
            </p>
          </div>
        </div>
        
        {/* Simple Dot for Collapsed Mode */}
        {collapsed && (
          <div className="mx-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
        )}
      </div>
    </aside>
  );
}