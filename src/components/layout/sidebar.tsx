'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Truck,
  ArrowLeftRight,
  ClipboardMinus,
  BookOpen,
  Warehouse,
  BarChart3,
  ChevronLeft,
  Box,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import { usePermission } from '@/hooks/usePermission';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'DASHBOARD_VIEW' as const },
  { label: 'Products', href: '/products', icon: Package, permission: 'PRODUCT_VIEW' as const },
  { label: 'Receipts', href: '/receipts', icon: ClipboardList, permission: 'RECEIPT_CREATE' as const },
  { label: 'Deliveries', href: '/deliveries', icon: Truck, permission: 'DELIVERY_CREATE' as const },
  { label: 'Transfers', href: '/transfers', icon: ArrowLeftRight, permission: 'TRANSFER_CREATE' as const },
  { label: 'Adjustments', href: '/adjustments', icon: ClipboardMinus, permission: 'ADJUSTMENT_CREATE' as const },
  { label: 'Stock Ledger', href: '/stock-ledger', icon: BookOpen, permission: 'MOVE_HISTORY_VIEW' as const },
  { type: 'separator' as const },
  { label: 'Warehouses', href: '/warehouses', icon: Warehouse, permission: 'WAREHOUSE_MANAGE' as const },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, permission: 'DASHBOARD_VIEW' as const },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { can } = usePermission();

  const filteredNavItems = navItems.filter(item => {
    if ('type' in item && item.type === 'separator') return true;
    if ('permission' in item && item.permission) {
      return can(item.permission);
    }
    return true;
  });

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex h-screen flex-col border-r border-border bg-card"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Box className="h-5 w-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap text-lg font-bold tracking-tight"
            >
              CoreInventory
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <Separator />

      {/* Nav Links */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {filteredNavItems.map((item, index) => {
            if ('type' in item && item.type === 'separator') {
              return <Separator key={`sep-${index}`} className="my-3" />;
            }

            if (!('href' in item)) return null;

            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className={cn('h-4.5 w-4.5 shrink-0', isActive && 'text-primary-foreground')} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );

            if (!sidebarOpen) {
              return (
                <Tooltip key={item.href} >
                  <TooltipTrigger>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Toggle */}
      <Separator />
      <div className="p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center"
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>
    </motion.aside>
  );
}
