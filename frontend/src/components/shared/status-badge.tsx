'use client';

import { Badge } from '@/components/ui/badge';
import { Status } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<Status, { label: string; variant: string; className: string }> = {
  draft: { label: 'Draft', variant: 'secondary', className: 'bg-muted text-muted-foreground' },
  confirmed: { label: 'Confirmed', variant: 'default', className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  done: { label: 'Done', variant: 'default', className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'Cancelled', variant: 'destructive', className: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20' },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
