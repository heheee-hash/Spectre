'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Eye, Activity } from 'lucide-react';
import Link from 'next/link';
import { usePermission } from '@/hooks/usePermission';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { TableSkeleton } from '@/components/shared/skeletons';
import { productService, formatCurrency } from '@/services';
import { Product, productCategories, productUnits } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notification-store';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  unit: z.string().min(1, 'Unit is required'),
  costPrice: z.number().min(0, 'Must be positive'),
  salePrice: z.number().min(0, 'Must be positive'),
  reorderLevel: z.number().min(0, 'Must be positive'),
});

type ProductForm = z.infer<typeof productSchema>;

import { Suspense } from 'react';

function ProductsContent() {
  const { can } = usePermission();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState(initialFilter);
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
      addNotification({
        type: 'success',
        title: 'Product Created',
        message: `New product "${data.name}" has been added to the catalog.`,
      });
      form.reset();
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const prev = queryClient.getQueryData<Product[]>(['products']);
      queryClient.setQueryData<Product[]>(['products'], (old) => old?.filter((p) => p.id !== id));
      return { prev };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['products'], context?.prev);
      toast.error('Failed to delete product');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    onSuccess: (_data, id) => {
      toast.success('Product deleted');
      addNotification({
        type: 'info',
        title: 'Product Deleted',
        message: `Product with ID ${id} has been removed from the system.`,
      });
    },
  });

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '', sku: '', category: '', description: '', unit: 'pcs', costPrice: 0, salePrice: 0, reorderLevel: 0,
    },
  });

  const filtered = products?.filter((p) => {
    const searchLower = search.toLowerCase();
    const matchSearch = 
      p.name.toLowerCase().includes(searchLower) || 
      p.sku.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower);
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStock = stockFilter === 'all' || (stockFilter === 'low-stock' && p.availableStock <= p.reorderLevel);
    return matchSearch && matchCategory && matchStock;
  });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Products"
        description="Manage your product catalog and stock levels"
        action={
          can('PRODUCT_CREATE') && (
            <Button onClick={() => setOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          )
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v || 'all')}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {productCategories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={(v) => setStockFilter(v || 'all')}>
            <SelectTrigger className="w-[160px]">
              <Activity className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Stock Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><TableSkeleton rows={5} cols={7} /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filtered?.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        <Link href={`/products/${product.id}`} className="hover:text-primary hover:underline transition-colors">
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                      <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                      <TableCell className="text-right">{formatCurrency(product.costPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.salePrice)}</TableCell>
                      <TableCell className="text-right">
                        <span className={product.availableStock <= product.reorderLevel ? 'text-red-500 font-medium' : ''}>
                          {product.availableStock.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground"> / {product.totalStock.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {product.availableStock <= product.reorderLevel ? (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Low Stock</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">In Stock</Badge>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Add a new product to your inventory catalog.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...form.register('name')} placeholder="Product name" />
                {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input {...form.register('sku')} placeholder="e.g. STL-ROD-001" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.watch('category') || ''} onValueChange={(v) => form.setValue('category', v || '')}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {productCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={form.watch('unit') || ''} onValueChange={(v) => form.setValue('unit', v || '')}>
                  <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                  <SelectContent>
                    {productUnits.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...form.register('description')} placeholder="Product description" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cost Price</Label>
                <Input {...form.register('costPrice', { valueAsNumber: true })} type="number" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Sale Price</Label>
                <Input {...form.register('salePrice', { valueAsNumber: true })} type="number" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Reorder Level</Label>
                <Input {...form.register('reorderLevel', { valueAsNumber: true })} type="number" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-6"><TableSkeleton rows={5} cols={7} /></div>}>
      <ProtectedRoute permission="PRODUCT_VIEW">
        <ProductsContent />
      </ProtectedRoute>
    </Suspense>
  );
}
