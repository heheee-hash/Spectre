'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Warehouse, 
  Calendar, 
  FileText,
  CheckCircle2,
  AlertCircle,
  Package,
  TrendingDown,
  TrendingUp,
  Scale
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
import { adjustmentService, formatDate } from '@/services';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notification-store';

export default function AdjustmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const adjustmentId = id as string;

  const { data: adjustment, isLoading } = useQuery({
    queryKey: ['adjustments', adjustmentId],
    queryFn: () => adjustmentService.getById(adjustmentId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: 'confirmed' | 'done' | 'cancelled') =>
      adjustmentService.updateStatus(adjustmentId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adjustments', adjustmentId] });
      queryClient.invalidateQueries({ queryKey: ['adjustments'] });
      toast.success('Adjustment status updated');
      addNotification({
        type: variables === 'cancelled' ? 'warning' : 'success',
        title: `Adjustment ${variables.charAt(0).toUpperCase() + variables.slice(1)}`,
        message: `Inventory adjustment ${data.reference} has been ${variables}.`,
      });
    },
    onError: () => toast.error('Failed to update status'),
  });

  if (isLoading) return <PageLoader />;
  if (!adjustment) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Inventory Adjustment not found</h2>
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
              <h1 className="text-2xl font-bold tracking-tight">{adjustment.reference}</h1>
              <StatusBadge status={adjustment.status} />
            </div>
            <p className="text-muted-foreground font-medium">Stock Level Correction</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(adjustment.status === 'draft' || adjustment.status === 'confirmed') && (
            <Button 
              variant="outline" 
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
              onClick={() => statusMutation.mutate('cancelled')}
              disabled={statusMutation.isPending}
            >
              Cancel
            </Button>
          )}
          {adjustment.status === 'draft' && (
            <Button 
              className="bg-primary"
              onClick={() => statusMutation.mutate('confirmed')}
              disabled={statusMutation.isPending}
            >
              Confirm Adjustment
            </Button>
          )}
          {adjustment.status === 'confirmed' && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={() => statusMutation.mutate('done')}
              disabled={statusMutation.isPending}
            >
              <Scale className="h-4 w-4" /> Apply Correction
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Adjustment Lines</CardTitle>
            <CardDescription>Product corrections recorded in this session</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Corrected</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustment.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{line.productName}</span>
                        <span className="text-xs text-muted-foreground font-mono">ID: {line.productId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{line.currentQty} {line.unit}</TableCell>
                    <TableCell className="text-right font-bold">{line.newQty} {line.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 font-bold ${line.difference > 0 ? 'text-emerald-500' : line.difference < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                        {line.difference > 0 ? <TrendingUp className="h-3 w-3" /> : line.difference < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                        {line.difference > 0 ? '+' : ''}{line.difference}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize text-[10px] h-5">
                        {line.reason.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {adjustment.notes && (
              <div className="p-4 bg-muted/30 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Investigation Notes</p>
                <p className="text-sm italic text-muted-foreground">"{adjustment.notes}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-500/10 text-zinc-500">
                  <Warehouse className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Location</span>
                  <span className="text-sm font-medium">{adjustment.warehouseName}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/10 text-amber-500">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Effective Date</span>
                  <span className="text-sm font-medium">{formatDate(adjustment.date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10 text-blue-500">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Total Lines</span>
                  <span className="text-sm font-medium">{adjustment.lines.length} items</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/20 p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Difference</span>
                  <span className={`font-bold ${adjustment.lines.reduce((acc, l) => acc + l.difference, 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {adjustment.lines.reduce((acc, l) => acc + l.difference, 0) > 0 ? '+' : ''}
                    {adjustment.lines.reduce((acc, l) => acc + l.difference, 0)} units
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Accuracy Impact</span>
                  <span className="font-bold">{adjustment.status === 'done' ? 'Applied' : 'Pending'}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                <p className="text-[10px] text-amber-500 leading-relaxed">
                  Inventory adjustments modify the stock ledger directly once applied. Ensure all physical counts are verified.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
