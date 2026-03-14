'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Warehouse, 
  Calendar, 
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Truck,
  Boxes,
  MapPin
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
import { deliveryService, formatDate } from '@/services';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notification-store';

export default function DeliveryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const deliveryId = id as string;

  const { data: delivery, isLoading } = useQuery({
    queryKey: ['deliveries', deliveryId],
    queryFn: () => deliveryService.getById(deliveryId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: 'confirmed' | 'done' | 'cancelled') =>
      deliveryService.updateStatus(deliveryId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries', deliveryId] });
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      toast.success('Transfer status updated');
      addNotification({
        type: variables === 'cancelled' ? 'warning' : 'success',
        title: `Delivery ${variables.charAt(0).toUpperCase() + variables.slice(1)}`,
        message: `Delivery order ${data.reference} has been ${variables}.`,
      });
    },
    onError: () => toast.error('Failed to update status'),
  });

  if (isLoading) return <PageLoader />;
  if (!delivery) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Delivery Order not found</h2>
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
              <h1 className="text-2xl font-bold tracking-tight">{delivery.reference}</h1>
              <StatusBadge status={delivery.status} />
            </div>
            <p className="text-muted-foreground font-medium">Delivery to {delivery.customer}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(delivery.status === 'draft' || delivery.status === 'confirmed') && (
            <Button 
              variant="outline" 
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
              onClick={() => statusMutation.mutate('cancelled')}
              disabled={statusMutation.isPending}
            >
              Cancel
            </Button>
          )}
          {delivery.status === 'draft' && (
            <Button 
              className="bg-primary"
              onClick={() => statusMutation.mutate('confirmed')}
              disabled={statusMutation.isPending}
            >
              Confirm Order
            </Button>
          )}
          {delivery.status === 'confirmed' && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              onClick={() => statusMutation.mutate('done')}
              disabled={statusMutation.isPending}
            >
              <Truck className="h-4 w-4" /> Ship Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
            <CardDescription>Products allocated for this delivery</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Ordered</TableHead>
                  <TableHead className="text-right">Shipped</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delivery.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{line.productName}</span>
                        <span className="text-xs text-muted-foreground font-mono">ID: {line.productId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{line.demandQty} {line.unit}</TableCell>
                    <TableCell className="text-right font-semibold text-blue-500">{line.deliveredQty} {line.unit}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={line.deliveredQty === line.demandQty ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}>
                        {line.deliveredQty === line.demandQty ? 'Complete' : 'Pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {delivery.notes && (
              <div className="p-4 bg-muted/30 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Shipping Instructions</p>
                <p className="text-sm italic text-muted-foreground">"{delivery.notes}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10 text-blue-500">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Customer</span>
                  <span className="text-sm font-medium">{delivery.customer}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-500/10 text-zinc-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Origin Warehouse</span>
                  <span className="text-sm font-medium">{delivery.warehouseName}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/10 text-amber-500">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Scheduled Ship Date</span>
                  <span className="text-sm font-medium">{formatDate(delivery.scheduledDate)}</span>
                </div>
              </div>
              {delivery.completedDate && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Shipped On</span>
                    <span className="text-sm font-medium">{formatDate(delivery.completedDate)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium uppercase">Fulfillment</span>
                  <span className="font-bold">
                    {delivery.lines.every(l => l.deliveredQty === l.demandQty) ? '100%' : 'In Progress'}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ 
                      width: `${(delivery.lines.reduce((acc, l) => acc + l.deliveredQty, 0) / delivery.lines.reduce((acc, l) => acc + l.demandQty, 0)) * 100}%` 
                    }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-1 border-t pt-4">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Status Trace</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] h-5 capitalize">
                    {delivery.status}
                  </Badge>
                  {delivery.status === 'done' && (
                    <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Fully Shipped
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
