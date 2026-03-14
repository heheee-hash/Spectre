'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Eye, Filter } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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
import { receiptService, formatDate } from '@/services';
import { mockWarehouses } from '@/data';
import { mockProducts } from '@/data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notification-store';

const receiptSchema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
  warehouseId: z.string().min(1, 'Warehouse is required'),
  scheduledDate: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
  productId: z.string().min(1, 'Product is required'),
  expectedQty: z.number().min(1, 'Must be at least 1'),
});

type ReceiptForm = z.infer<typeof receiptSchema>;

import { Suspense } from 'react';

function ReceiptsContent() {
  const { can } = usePermission();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';
  
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data: receipts, isLoading } = useQuery({
    queryKey: ['receipts'],
    queryFn: () => receiptService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: ReceiptForm) =>
      receiptService.create({
        supplier: data.supplier,
        warehouseId: data.warehouseId,
        scheduledDate: data.scheduledDate,
        notes: data.notes,
        lines: [{ productId: data.productId, expectedQty: data.expectedQty }],
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast.success('Receipt created');
      addNotification({
        type: 'success',
        title: 'New Receipt',
        message: `Receipt ${data.reference} for ${data.supplier} has been created in draft.`,
      });
      setOpen(false);
      form.reset();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'confirmed' | 'done' | 'cancelled' }) =>
      receiptService.updateStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast.success('Status updated');
      addNotification({
        type: variables.status === 'cancelled' ? 'warning' : 'success',
        title: `Receipt ${variables.status.charAt(0).toUpperCase() + variables.status.slice(1)}`,
        message: `Receipt ${data.reference} has been ${variables.status}.`,
      });
    },
  });

  const form = useForm<ReceiptForm>({
    resolver: zodResolver(receiptSchema),
    defaultValues: { supplier: '', warehouseId: '', scheduledDate: '', notes: '', productId: '', expectedQty: 1 },
  });

  const filtered = receipts?.filter((r) => {
    const searchLower = search.toLowerCase();
    const matchSearch = 
      r.reference.toLowerCase().includes(searchLower) || 
      r.supplier.toLowerCase().includes(searchLower) ||
      r.warehouseName.toLowerCase().includes(searchLower);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Receipts"
        description="Manage incoming stock from suppliers"
        action={<Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> New Receipt</Button>}
      />

      <Card>
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search receipts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                  <TableHead>Supplier</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filtered?.map((receipt, i) => (
                    <motion.tr key={receipt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b hover:bg-muted/50">
                     <TableCell className="font-medium font-mono text-sm">
                        <Link href={`/receipts/${receipt.id}`} className="hover:text-primary hover:underline transition-colors">
                          {receipt.reference}
                        </Link>
                      </TableCell>
                      <TableCell>{receipt.supplier}</TableCell>
                      <TableCell className="text-muted-foreground">{receipt.warehouseName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(receipt.scheduledDate)}</TableCell>
                      <TableCell><StatusBadge status={receipt.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {(receipt.status === 'draft' || receipt.status === 'confirmed') && can('RECEIPT_VALIDATE') && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => statusMutation.mutate({ id: receipt.id, status: 'cancelled' })}
                            >
                              Cancel
                            </Button>
                          )}
                          {receipt.status === 'draft' && can('RECEIPT_VALIDATE') && (
                            <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: receipt.id, status: 'confirmed' })}>Confirm</Button>
                          )}
                          {receipt.status === 'confirmed' && can('RECEIPT_VALIDATE') && (
                            <Button size="sm" variant="outline" className="text-emerald-500" onClick={() => statusMutation.mutate({ id: receipt.id, status: 'done' })}>Receive</Button>
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
            <DialogTitle>New Receipt</DialogTitle>
            <DialogDescription>Create a new incoming stock receipt.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Input {...form.register('supplier')} placeholder="Supplier name" />
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
                <Label>Expected Qty</Label>
                <Input {...form.register('expectedQty', { valueAsNumber: true })} type="number" min={1} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea {...form.register('notes')} placeholder="Optional notes" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating...' : 'Create Receipt'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ReceiptsPage() {
  return (
    <Suspense fallback={<div className="p-6"><TableSkeleton rows={5} cols={6} /></div>}>
      <ProtectedRoute permission="RECEIPT_CREATE">
        <ReceiptsContent />
      </ProtectedRoute>
    </Suspense>
  );
}
