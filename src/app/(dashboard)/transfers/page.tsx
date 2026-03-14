'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { TableSkeleton } from '@/components/shared/skeletons';
import { transferService, formatDate } from '@/services';
import { mockWarehouses, mockProducts } from '@/data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notification-store';

const schema = z.object({
  sourceWarehouseId: z.string().min(1, 'Source is required'),
  destinationWarehouseId: z.string().min(1, 'Destination is required'),
  scheduledDate: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Must be at least 1'),
});

type FormData = z.infer<typeof schema>;

export default function TransfersPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data: transfers, isLoading } = useQuery({
    queryKey: ['transfers'],
    queryFn: () => transferService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      transferService.create({
        sourceWarehouseId: data.sourceWarehouseId,
        destinationWarehouseId: data.destinationWarehouseId,
        scheduledDate: data.scheduledDate,
        notes: data.notes,
        lines: [{ productId: data.productId, quantity: data.quantity }],
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Transfer created');
      addNotification({
        type: 'success',
        title: 'New Transfer',
        message: `Internal transfer ${data.reference} from ${data.sourceWarehouseName} to ${data.destinationWarehouseName} has been created.`,
      });
      setOpen(false);
      form.reset();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'confirmed' | 'done' | 'cancelled' }) =>
      transferService.updateStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Status updated');
      addNotification({
        type: variables.status === 'cancelled' ? 'warning' : 'success',
        title: `Transfer ${variables.status.charAt(0).toUpperCase() + variables.status.slice(1)}`,
        message: `Internal transfer ${data.reference} has been ${variables.status}.`,
      });
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sourceWarehouseId: '', destinationWarehouseId: '', scheduledDate: '', notes: '', productId: '', quantity: 1 },
  });

  const filtered = transfers?.filter((t) => {
    const searchLower = search.toLowerCase();
    const matchSearch = 
      t.reference.toLowerCase().includes(searchLower) || 
      t.sourceWarehouseName.toLowerCase().includes(searchLower) ||
      t.destinationWarehouseName.toLowerCase().includes(searchLower);
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Internal Transfers"
        description="Move stock between warehouses"
        action={<Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> New Transfer</Button>}
      />

      <Card>
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search transfers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
            <div className="p-6"><TableSkeleton rows={4} cols={6} /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filtered?.map((transfer, i) => (
                    <motion.tr key={transfer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b hover:bg-muted/50">
                     <TableCell className="font-medium font-mono text-sm">
                        <Link href={`/transfers/${transfer.id}`} className="hover:text-primary hover:underline transition-colors">
                          {transfer.reference}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <span>{transfer.sourceWarehouseName}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span>{transfer.destinationWarehouseName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(transfer.scheduledDate)}</TableCell>
                      <TableCell className="text-muted-foreground">{transfer.lines.length} item{transfer.lines.length > 1 ? 's' : ''}</TableCell>
                      <TableCell><StatusBadge status={transfer.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {(transfer.status === 'draft' || transfer.status === 'confirmed') && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => statusMutation.mutate({ id: transfer.id, status: 'cancelled' })}
                            >
                              Cancel
                            </Button>
                          )}
                          {transfer.status === 'draft' && (
                            <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: transfer.id, status: 'confirmed' })}>Confirm</Button>
                          )}
                          {transfer.status === 'confirmed' && (
                            <Button size="sm" variant="outline" className="text-emerald-500" onClick={() => statusMutation.mutate({ id: transfer.id, status: 'done' })}>Complete</Button>
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
            <DialogTitle>New Transfer</DialogTitle>
            <DialogDescription>Create a new internal stock transfer.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Warehouse</Label>
                <Select value={form.watch('sourceWarehouseId') || ''} onValueChange={(v) => form.setValue('sourceWarehouseId', v || '')}>
                  <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                  <SelectContent>{mockWarehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To Warehouse</Label>
                <Select value={form.watch('destinationWarehouseId') || ''} onValueChange={(v) => form.setValue('destinationWarehouseId', v || '')}>
                  <SelectTrigger><SelectValue placeholder="Destination" /></SelectTrigger>
                  <SelectContent>{mockWarehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Scheduled Date</Label>
              <Input {...form.register('scheduledDate')} type="date" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={form.watch('productId') || ''} onValueChange={(v) => form.setValue('productId', v || '')}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>{mockProducts.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input {...form.register('quantity', { valueAsNumber: true })} type="number" min={1} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea {...form.register('notes')} placeholder="Optional notes" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating...' : 'Create Transfer'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
