'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Truck, 
  Warehouse, 
  Calendar, 
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Boxes
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { StatusBadge, PageLoader } from '@/components/shared';
import { receiptService, formatDate } from '@/services';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notification-store';

export default function ReceiptDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const receiptId = id as string;

  const { data: receipt, isLoading } = useQuery({
    queryKey: ['receipts', receiptId],
    queryFn: () => receiptService.getById(receiptId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: 'confirmed' | 'done' | 'cancelled') =>
      receiptService.updateStatus(receiptId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['receipts', receiptId] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast.success('Status updated successfully');
      addNotification({
        type: variables === 'cancelled' ? 'warning' : 'success',
        title: `Receipt ${variables.charAt(0).toUpperCase() + variables.slice(1)}`,
        message: `Receipt ${data.reference} has been ${variables}.`,
      });
    },
    onError: () => toast.error('Failed to update status'),
  });

  if (isLoading) return <PageLoader />;
  if (!receipt) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Receipt not found</h2>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{receipt.reference}</h1>
              <StatusBadge status={receipt.status} />
            </div>
            <p className="text-muted-foreground font-medium">Receipt from {receipt.supplier}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(receipt.status === 'draft' || receipt.status === 'confirmed') && (
            <Button 
              variant="outline" 
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
              onClick={() => statusMutation.mutate('cancelled')}
              disabled={statusMutation.isPending}
            >
              Cancel
            </Button>
          )}
          {receipt.status === 'draft' && (
            <Button 
              className="bg-primary"
              onClick={() => statusMutation.mutate('confirmed')}
              disabled={statusMutation.isPending}
            >
              Confirm Receipt
            </Button>
          )}
          {receipt.status === 'confirmed' && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => statusMutation.mutate('done')}
              disabled={statusMutation.isPending}
            >
              Mark as Received
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Items Received</CardTitle>
            <CardDescription>Product lines included in this receipt</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Expected</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{line.productName}</span>
                        <span className="text-xs text-muted-foreground font-mono">ID: {line.productId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{line.expectedQty} {line.unit}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-500">{line.receivedQty} {line.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${line.receivedQty >= line.expectedQty ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${(line.receivedQty / line.expectedQty) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{((line.receivedQty / line.expectedQty) * 100).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {receipt.notes && (
              <div className="p-4 bg-muted/30 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Notes</p>
                <p className="text-sm italic text-muted-foreground">"{receipt.notes}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10 text-blue-500">
                  <Warehouse className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Destination</span>
                  <span className="text-sm font-medium">{receipt.warehouseName}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/10 text-amber-500">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Scheduled</span>
                  <span className="text-sm font-medium">{formatDate(receipt.scheduledDate)}</span>
                </div>
              </div>
              {receipt.completedDate && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Completed On</span>
                    <span className="text-sm font-medium">{formatDate(receipt.completedDate)}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-500/10 text-zinc-500">
                  <Truck className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Supplier</span>
                  <span className="text-sm font-medium">{receipt.supplier}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Lines</span>
                <span className="font-semibold">{receipt.lines.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Qty</span>
                <span className="font-semibold">
                  {receipt.lines.reduce((acc, l) => acc + l.expectedQty, 0)} units
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className="capitalize text-[10px] h-5">
                  {receipt.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
