'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
  href?: string;
}

export function KPICard({ title, value, change, changeLabel, icon: Icon, iconColor = 'text-primary', delay = 0, href }: KPICardProps) {
  const content = (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200",
      href && "hover:shadow-md hover:border-primary/50 cursor-pointer group"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {change !== undefined && (
              <p className={cn('flex items-center gap-1 text-xs font-medium', change >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                {changeLabel && <span className="text-muted-foreground"> {changeLabel}</span>}
              </p>
            )}
          </div>
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors',
            href && "group-hover:bg-primary/20",
            iconColor
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {href ? <Link href={href}>{content}</Link> : content}
    </motion.div>
  );
}
