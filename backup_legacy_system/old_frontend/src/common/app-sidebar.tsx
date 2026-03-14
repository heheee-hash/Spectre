"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Package,
  Home,
  Tags,
  ArrowRightLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings2,
  Building2,
  MapPin,
  ClipboardList,
  LayoutDashboard,
  Boxes,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard, group: "Dashboard" },
  { title: "Products", url: "/products", icon: Package, group: "Master Data" },
  { title: "Categories", url: "/categories", icon: Tags, group: "Master Data" },
  { title: "Warehouses", url: "/warehouses", icon: Building2, group: "Master Data" },
  { title: "Locations", url: "/locations", icon: MapPin, group: "Master Data" },
  { title: "Receipts", url: "/receipts", icon: ArrowDownToLine, group: "Operations" },
  { title: "Deliveries", url: "/deliveries", icon: ArrowUpFromLine, group: "Operations" },
  { title: "Transfers", url: "/transfers", icon: ArrowRightLeft, group: "Operations" },
  { title: "Adjustments", url: "/adjustments", icon: Settings2, group: "Operations" },
  { title: "Move History", url: "/history", icon: ClipboardList, group: "Reports" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const isManager = user?.role === "ADMIN" || user?.role === "MANAGER";

  // Filter out setup menus for STAFF
  const filteredNavItems = navItems.filter(item => {
    if (!isManager && ["Categories", "Warehouses", "Locations"].includes(item.title)) {
      return false;
    }
    return true;
  });

  const groupedItems = filteredNavItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar">
        {/* Branding */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/30">
            <Boxes className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground tracking-tight">
              Core Inventory
            </span>
            <span className="text-[10px] text-sidebar-foreground/50 tracking-wide uppercase">
              Management System
            </span>
          </div>
        </div>

        {/* Nav groups */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          {Object.entries(groupedItems).map(([group, items]) => (
            <SidebarGroup key={group} className="mb-1">
              <SidebarGroupLabel className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 mb-0.5">
                {group}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          isActive={isActive}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <Link href={item.url} className="flex items-center gap-3 w-full">
                            <span className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                                : "bg-sidebar-foreground/8 text-sidebar-foreground/60 group-hover:bg-sidebar-foreground/12"
                            )}>
                              <item.icon className="h-3.5 w-3.5" />
                            </span>
                            <span>{item.title}</span>
                            {isActive && (
                              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
              {user?.name?.substring(0, 2).toUpperCase() || "US"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-sidebar-foreground truncate">{user?.name || "Loading..."}</span>
              <span className="text-[10px] text-sidebar-foreground/40 truncate">{user?.email || ""}</span>
              <span className="text-[10px] font-bold text-primary truncate mt-0.5">{user?.role || ""}</span>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
