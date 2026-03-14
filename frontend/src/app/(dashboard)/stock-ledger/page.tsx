'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpCircle, ArrowDownCircle, ArrowLeftRight, ClipboardMinus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { TableSkeleton } from '@/components/shared/skeletons';
import { stockService, formatDate, formatNumber } from '@/services';

const typeConfig = {
  receipt: { label: 'Receipt', icon: ArrowDownCircle, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  delivery: { label: 'Delivery', icon: ArrowUpCircle, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  transfer_in: { label: 'Transfer In', icon: ArrowLeftRight, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  transfer_out: { label: 'Transfer Out', icon: ArrowLeftRight, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  adjustment: { label: 'Adjustment', icon: ClipboardMinus, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
};

export default function StockLedgerPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: ledger, isLoading } = useQuery({
    queryKey: ['stockLedger'],
    queryFn: () => stockService.getStockLedger(),
  });

  const filtered = ledger?.filter((entry) => {
    const matchSearch = entry.productName.toLowerCase().includes(search.toLowerCase()) || entry.reference.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || entry.operationType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title="Stock Ledger" description="Complete history of all stock movements across warehouses" />

      <Card>
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by product or reference..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v || 'all')}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Operation Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="receipt">Receipts</SelectItem>
              <SelectItem value="delivery">Deliveries</SelectItem>
              <SelectItem value="transfer_in">Transfers In</SelectItem>
              <SelectItem value="transfer_out">Transfers Out</SelectItem>
              <SelectItem value="adjustment">Adjustments</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><TableSkeleton rows={8} cols={7} /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Qty Change</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered?.map((entry, i) => {
                  const config = typeConfig[entry.operationType];
                  return (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <TableCell className="text-muted-foreground text-sm">{formatDate(entry.date)}</TableCell>
                      <TableCell className="font-medium">{entry.productName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={config.color}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{entry.reference}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.warehouseName}</TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={entry.quantityChange > 0 ? 'text-emerald-500' : 'text-red-500'}>
                          {entry.quantityChange > 0 ? '+' : ''}{formatNumber(entry.quantityChange)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatNumber(entry.balanceAfter)}</TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
