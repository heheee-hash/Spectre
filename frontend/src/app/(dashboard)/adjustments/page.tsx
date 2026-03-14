'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { TableSkeleton } from '@/components/shared/skeletons';
import { adjustmentService, formatDate } from '@/services';
import { mockWarehouses, mockProducts } from '@/data';
import { AdjustmentReason } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notification-store';

const reasons: { value: AdjustmentReason; label: string }[] = [
  { value: 'count_correction', label: 'Count Correction' },
  { value: 'damage', label: 'Damage' },
  { value: 'theft', label: 'Theft' },
  { value: 'expiry', label: 'Expiry' },
  { value: 'quality_control', label: 'Quality Control' },
  { value: 'other', label: 'Other' },
];

const schema = z.object({
  warehouseId: z.string().min(1, 'Warehouse is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
  productId: z.string().min(1, 'Product is required'),
  newQty: z.number().min(0, 'Must be 0 or more'),
  reason: z.string().min(1, 'Reason is required'),
});

type FormData = z.infer<typeof schema>;

export default function AdjustmentsPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data: adjustments, isLoading } = useQuery({
    queryKey: ['adjustments'],
    queryFn: () => adjustmentService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      adjustmentService.create({
        warehouseId: data.warehouseId,
        date: data.date,
        notes: data.notes,
        lines: [{ productId: data.productId, newQty: data.newQty, reason: data.reason as AdjustmentReason }],
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adjustments'] });
      toast.success('Adjustment created');
      addNotification({
        type: 'success',
        title: 'New Adjustment',
        message: `Inventory adjustment ${data.reference} for ${data.warehouseName} has been created.`,
      });
      setOpen(false);
      form.reset();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'confirmed' | 'done' | 'cancelled' }) =>
      adjustmentService.updateStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adjustments'] });
      toast.success('Status updated');
      addNotification({
        type: variables.status === 'cancelled' ? 'warning' : 'success',
        title: `Adjustment ${variables.status.charAt(0).toUpperCase() + variables.status.slice(1)}`,
        message: `Inventory adjustment ${data.reference} has been ${variables.status}.`,
      });
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { warehouseId: '', date: '', notes: '', productId: '', newQty: 0, reason: '' },
  });

  const filtered = adjustments?.filter((a) => {
    const searchLower = search.toLowerCase();
    const matchSearch = 
      a.reference.toLowerCase().includes(searchLower) || 
      a.warehouseName.toLowerCase().includes(searchLower) ||
      a.lines.some(l => l.productName.toLowerCase().includes(searchLower));
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Inventory Adjustments"
        description="Correct stock levels and record discrepancies"
        action={<Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> New Adjustment</Button>}
      />

      <Card>
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search adjustments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || 'all')}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><TableSkeleton rows={3} cols={6} /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filtered?.map((adj, i) => (
                    <motion.tr key={adj.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b hover:bg-muted/50">
                     <TableCell className="font-medium font-mono text-sm">
                        <Link href={`/adjustments/${adj.id}`} className="hover:text-primary hover:underline transition-colors">
                          {adj.reference}
                        </Link>
                      </TableCell>
                      <TableCell>{adj.warehouseName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(adj.date)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {adj.lines.map((line) => (
                            <Badge key={line.id} variant="outline" className="text-xs">
                              {line.productName}: <span className={line.difference < 0 ? 'text-red-500' : 'text-emerald-500'}>{line.difference > 0 ? '+' : ''}{line.difference}</span>
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={adj.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {(adj.status === 'draft' || adj.status === 'confirmed') && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => statusMutation.mutate({ id: adj.id, status: 'cancelled' })}
                            >
                              Cancel
                            </Button>
                          )}
                          {adj.status === 'draft' && (
                            <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: adj.id, status: 'confirmed' })}>Confirm</Button>
                          )}
                          {adj.status === 'confirmed' && (
                            <Button size="sm" variant="outline" className="text-emerald-500" onClick={() => statusMutation.mutate({ id: adj.id, status: 'done' })}>Apply</Button>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Adjustment</DialogTitle>
            <DialogDescription>Record a stock level correction.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Warehouse</Label>
                <Select value={form.watch('warehouseId') || ''} onValueChange={(v) => form.setValue('warehouseId', v || '')}>
                  <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                  <SelectContent>{mockWarehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input {...form.register('date')} type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={form.watch('productId') || ''} onValueChange={(v) => form.setValue('productId', v || '')}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{mockProducts.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} ({p.totalStock} {p.unit})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>New Quantity</Label>
                <Input {...form.register('newQty', { valueAsNumber: true })} type="number" min={0} />
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Select value={form.watch('reason') || ''} onValueChange={(v) => form.setValue('reason', v || '')}>
                  <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                  <SelectContent>{reasons.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea {...form.register('notes')} placeholder="Optional notes" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating...' : 'Create Adjustment'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
