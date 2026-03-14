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
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { TableSkeleton } from '@/components/shared/skeletons';
import { deliveryService, formatDate } from '@/services';
import { mockWarehouses, mockProducts } from '@/data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notification-store';

const schema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  warehouseId: z.string().min(1, 'Warehouse is required'),
  scheduledDate: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
  productId: z.string().min(1, 'Product is required'),
  demandQty: z.number().min(1, 'Must be at least 1'),
});

type FormData = z.infer<typeof schema>;

export default function DeliveriesPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data: deliveries, isLoading } = useQuery({
    queryKey: ['deliveries'],
    queryFn: () => deliveryService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      deliveryService.create({
        customer: data.customer,
        warehouseId: data.warehouseId,
        scheduledDate: data.scheduledDate,
        notes: data.notes,
        lines: [{ productId: data.productId, demandQty: data.demandQty }],
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      toast.success('Delivery order created');
      addNotification({
        type: 'success',
        title: 'New Delivery Order',
        message: `Delivery ${data.reference} for ${data.customer} has been created.`,
      });
      setOpen(false);
      form.reset();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'confirmed' | 'done' | 'cancelled' }) =>
      deliveryService.updateStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      toast.success('Status updated');
      addNotification({
        type: variables.status === 'cancelled' ? 'warning' : 'success',
        title: `Delivery ${variables.status.charAt(0).toUpperCase() + variables.status.slice(1)}`,
        message: `Delivery ${data.reference} has been ${variables.status}.`,
      });
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { customer: '', warehouseId: '', scheduledDate: '', notes: '', productId: '', demandQty: 1 },
  });

  const filtered = deliveries?.filter((d) => {
    const searchLower = search.toLowerCase();
    const matchSearch = 
      d.reference.toLowerCase().includes(searchLower) || 
      d.customer.toLowerCase().includes(searchLower) ||
      d.warehouseName.toLowerCase().includes(searchLower);
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Delivery Orders"
        description="Manage outgoing stock to customers"
        action={<Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> New Delivery</Button>}
      />

      <Card>
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search deliveries..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
            <div className="p-6"><TableSkeleton rows={5} cols={6} /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filtered?.map((delivery, i) => (
                    <motion.tr key={delivery.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b hover:bg-muted/50">
                     <TableCell className="font-medium font-mono text-sm">
                        <Link href={`/deliveries/${delivery.id}`} className="hover:text-primary hover:underline transition-colors">
                          {delivery.reference}
                        </Link>
                      </TableCell>
                      <TableCell>{delivery.customer}</TableCell>
                      <TableCell className="text-muted-foreground">{delivery.warehouseName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(delivery.scheduledDate)}</TableCell>
                      <TableCell><StatusBadge status={delivery.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {(delivery.status === 'draft' || delivery.status === 'confirmed') && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => statusMutation.mutate({ id: delivery.id, status: 'cancelled' })}
                            >
                              Cancel
                            </Button>
                          )}
                          {delivery.status === 'draft' && (
                            <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: delivery.id, status: 'confirmed' })}>Confirm</Button>
                          )}
                          {delivery.status === 'confirmed' && (
                            <Button size="sm" variant="outline" className="text-emerald-500" onClick={() => statusMutation.mutate({ id: delivery.id, status: 'done' })}>Ship</Button>
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
            <DialogTitle>New Delivery Order</DialogTitle>
            <DialogDescription>Create a new outgoing delivery order.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Input {...form.register('customer')} placeholder="Customer name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Warehouse</Label>
                <Select value={form.watch('warehouseId') || ''} onValueChange={(v) => form.setValue('warehouseId', v || '')}>
                  <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                  <SelectContent>{mockWarehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Scheduled Date</Label>
                <Input {...form.register('scheduledDate')} type="date" />
              </div>
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
                <Label>Demand Qty</Label>
                <Input {...form.register('demandQty', { valueAsNumber: true })} type="number" min={1} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea {...form.register('notes')} placeholder="Optional notes" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating...' : 'Create Delivery'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
