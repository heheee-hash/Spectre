'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { KPISkeleton } from '@/components/shared/skeletons';
import { warehouseService } from '@/services';
import { Warehouse, WarehouseZone } from '@/types';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const zoneColors: Record<string, { fill: string; stroke: string; label: string }> = {
  storage: { fill: 'fill-blue-500/20', stroke: 'stroke-blue-500', label: 'Storage' },
  receiving: { fill: 'fill-emerald-500/20', stroke: 'stroke-emerald-500', label: 'Receiving' },
  shipping: { fill: 'fill-amber-500/20', stroke: 'stroke-amber-500', label: 'Shipping' },
  staging: { fill: 'fill-purple-500/20', stroke: 'stroke-purple-500', label: 'Staging' },
};

function WarehouseMap({ warehouse }: { warehouse: Warehouse }) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(zoneColors).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-sm border ${config.stroke.replace('stroke-', 'border-')} ${config.fill.replace('fill-', 'bg-')}`} />
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      <svg viewBox="0 0 340 260" className="w-full max-w-2xl border rounded-xl bg-muted/30 p-4">
        {warehouse.zones.map((zone) => {
          const colors = zoneColors[zone.type];
          const utilization = Math.round((zone.usedCapacity / zone.capacity) * 100);
          const isHovered = hoveredZone === zone.id;

          return (
            <g key={zone.id}>
              <motion.rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                rx={6}
                className={`${colors.fill} ${colors.stroke} stroke-2 cursor-pointer transition-all`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: isHovered ? 1.02 : 1 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
              />
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2 - 8}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-medium pointer-events-none"
              >
                {zone.name}
              </text>
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2 + 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px] pointer-events-none"
              >
                {utilization}% used
              </text>
              {/* Utilization bar */}
              <rect
                x={zone.x + 8}
                y={zone.y + zone.height - 14}
                width={zone.width - 16}
                height={4}
                rx={2}
                className="fill-muted-foreground/20"
              />
              <motion.rect
                x={zone.x + 8}
                y={zone.y + zone.height - 14}
                width={0}
                height={4}
                rx={2}
                className={colors.stroke.replace('stroke-', 'fill-')}
                animate={{ width: ((zone.width - 16) * utilization) / 100 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </g>
          );
        })}
      </svg>

      {hoveredZone && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border bg-card p-3"
        >
          {(() => {
            const zone = warehouse.zones.find((z) => z.id === hoveredZone);
            if (!zone) return null;
            return (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{zone.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{zone.type} zone</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{zone.usedCapacity} / {zone.capacity}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((zone.usedCapacity / zone.capacity) * 100)}% utilization</p>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}

export default function WarehousesPage() {
  const { data: warehouses, isLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehouseService.getAll(),
  });

  return (
    <ProtectedRoute permission="WAREHOUSE_MANAGE">
      <div className="space-y-6 pb-8">
      <PageHeader title="Warehouses" description="View warehouse layouts and capacity utilization" />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <KPISkeleton key={i} />)}
        </div>
      ) : (
        <>
          {/* Warehouse Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {warehouses?.map((wh, i) => {
              const utilization = Math.round((wh.usedCapacity / wh.capacity) * 100);
              return (
                <motion.div key={wh.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                          <Link href={`/warehouses/${wh.id}`} className="hover:text-primary hover:underline transition-colors">
                            <p className="font-semibold">{wh.name}</p>
                          </Link>
                          <p className="text-xs text-muted-foreground">{wh.code} · {wh.manager}</p>
                        <Badge variant={utilization > 80 ? 'destructive' : 'outline'} className={utilization > 80 ? '' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}>
                          {utilization}%
                        </Badge>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <motion.div
                          className={`h-2 rounded-full ${utilization > 80 ? 'bg-red-500' : utilization > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${utilization}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {wh.usedCapacity.toLocaleString()} / {wh.capacity.toLocaleString()} units · {wh.zones.length} zones
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Warehouse Maps */}
          <Tabs defaultValue={warehouses?.[0]?.id} className="space-y-4">
            <TabsList>
              {warehouses?.map((wh) => (
                <TabsTrigger key={wh.id} value={wh.id}>{wh.name}</TabsTrigger>
              ))}
            </TabsList>
            {warehouses?.map((wh) => (
              <TabsContent key={wh.id} value={wh.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{wh.name} — Floor Map</CardTitle>
                    <CardDescription>{wh.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WarehouseMap warehouse={wh} />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
    </ProtectedRoute>
  );
}
