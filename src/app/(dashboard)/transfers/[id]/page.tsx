'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight,
  Warehouse, 
  Calendar, 
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Truck,
  Boxes,
  MapPin,
  RefreshCcw,
  Navigation
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
import { transferService, formatDate } from '@/services';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notification-store';

export default function TransferDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const transferId = id as string;

  const { data: transfer, isLoading } = useQuery({
    queryKey: ['transfers', transferId],
    queryFn: () => transferService.getById(transferId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: 'confirmed' | 'done' | 'cancelled') =>
      transferService.updateStatus(transferId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfers', transferId] });
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Transfer status updated');
      addNotification({
        type: variables === 'cancelled' ? 'warning' : 'success',
        title: `Transfer ${variables.charAt(0).toUpperCase() + variables.slice(1)}`,
        message: `Internal transfer ${data.reference} has been ${variables}.`,
      });
    },
    onError: () => toast.error('Failed to update status'),
  });

  if (isLoading) return <PageLoader />;
  if (!transfer) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Internal Transfer not found</h2>
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
              <h1 className="text-2xl font-bold tracking-tight">{transfer.reference}</h1>
              <StatusBadge status={transfer.status} />
            </div>
            <p className="text-muted-foreground font-medium">Internal Stock Movement</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(transfer.status === 'draft' || transfer.status === 'confirmed') && (
            <Button 
              variant="outline" 
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
              onClick={() => statusMutation.mutate('cancelled')}
              disabled={statusMutation.isPending}
            >
              Cancel
            </Button>
          )}
          {transfer.status === 'draft' && (
            <Button 
              className="bg-primary"
              onClick={() => statusMutation.mutate('confirmed')}
              disabled={statusMutation.isPending}
            >
              Confirm Transfer
            </Button>
          )}
          {transfer.status === 'confirmed' && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={() => statusMutation.mutate('done')}
              disabled={statusMutation.isPending}
            >
              <CheckCircle2 className="h-4 w-4" /> Finalize Transfer
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Items to Move</CardTitle>
            <CardDescription>Product lines requested for this internal transfer</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfer.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{line.productName}</span>
                        <span className="text-xs text-muted-foreground font-mono">ID: {line.productId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">{line.quantity}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{line.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {transfer.notes && (
              <div className="p-4 bg-muted/30 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Internal Notes</p>
                <p className="text-sm italic text-muted-foreground">"{transfer.notes}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Navigation className="h-12 w-12" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Route Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Warehouse className="h-5 w-5" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">From Source</span>
                  <span className="text-sm font-bold truncate">{transfer.sourceWarehouseName}</span>
                </div>
              </div>

              <div className="flex justify-center py-0">
                <div className="h-8 w-px bg-gradient-to-b from-blue-500 to-emerald-500 relative">
                  <ArrowRight className="h-3 w-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-primary" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Warehouse className="h-5 w-5" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">To Destination</span>
                  <span className="text-sm font-bold truncate">{transfer.destinationWarehouseName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Scheduled</span>
                  <span className="text-sm font-medium">{formatDate(transfer.scheduledDate)}</span>
                </div>
              </div>
              {transfer.completedDate && (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase text-emerald-500">Completed</span>
                    <span className="text-sm font-medium">{formatDate(transfer.completedDate)}</span>
                  </div>
                </div>
              )}
              {transfer.status === 'draft' && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase text-amber-500">Wait for Approval</span>
                    <span className="text-sm font-medium italic">Pending Confirmation</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
