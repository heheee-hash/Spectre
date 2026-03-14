'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productService, receiptService, deliveryService } from '@/services';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Truck,
  ArrowLeftRight,
  ClipboardMinus,
  BookOpen,
  Warehouse,
  BarChart3,
  Plus,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const pages = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Receipts', href: '/receipts', icon: ClipboardList },
  { label: 'Deliveries', href: '/deliveries', icon: Truck },
  { label: 'Transfers', href: '/transfers', icon: ArrowLeftRight },
  { label: 'Adjustments', href: '/adjustments', icon: ClipboardMinus },
  { label: 'Stock Ledger', href: '/stock-ledger', icon: BookOpen },
  { label: 'Warehouses', href: '/warehouses', icon: Warehouse },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const quickActions = [
  { label: 'New Product', href: '/products?action=create', icon: Plus },
  { label: 'New Receipt', href: '/receipts?action=create', icon: Plus },
  { label: 'New Delivery', href: '/deliveries?action=create', icon: Plus },
  { label: 'New Transfer', href: '/transfers?action=create', icon: Plus },
  { label: 'New Adjustment', href: '/adjustments?action=create', icon: Plus },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState('');

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
    enabled: commandPaletteOpen,
  });

  const { data: receipts } = useQuery({
    queryKey: ['receipts'],
    queryFn: () => receiptService.getAll(),
    enabled: commandPaletteOpen,
  });

  const { data: deliveries } = useQuery({
    queryKey: ['deliveries'],
    queryFn: () => deliveryService.getAll(),
    enabled: commandPaletteOpen,
  });

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.sku.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5) || [];

  const filteredReceipts = receipts?.filter(r => 
    r.reference.toLowerCase().includes(query.toLowerCase()) || 
    r.supplier.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5) || [];

  const filteredDeliveries = deliveries?.filter(d => 
    d.reference.toLowerCase().includes(query.toLowerCase()) || 
    d.customer.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5) || [];

  const hasResults = query.length > 0 && (filteredProducts.length > 0 || filteredReceipts.length > 0 || filteredDeliveries.length > 0);

  const handleSelect = useCallback(
    (href: string) => {
      setCommandPaletteOpen(false);
      router.push(href);
    },
    [router, setCommandPaletteOpen]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  return (
    <CommandDialog 
      open={commandPaletteOpen} 
      onOpenChange={(open) => {
        setCommandPaletteOpen(open);
        if (!open) setQuery('');
      }}
    >
      <Command 
        shouldFilter={false}
        className="[&_[cmdk-list]]:max-h-[400px]"
      >
        <CommandInput 
          placeholder="Type to search products, receipts, orders..." 
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {hasResults && (
            <>
              {filteredProducts.length > 0 && (
                <CommandGroup heading="Products">
                  {filteredProducts.map((p) => (
                    <CommandItem key={p.id} value={`product-${p.id}`} onSelect={() => handleSelect(`/products/${p.id}`)}>
                      <Package className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">{p.sku}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {filteredReceipts.length > 0 && (
                <CommandGroup heading="Receipts">
                  {filteredReceipts.map((r) => (
                    <CommandItem key={r.id} value={`receipt-${r.id}`} onSelect={() => handleSelect(`/receipts/${r.id}`)}>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{r.reference}</span>
                        <span className="text-[10px] text-muted-foreground">{r.supplier}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {filteredDeliveries.length > 0 && (
                <CommandGroup heading="Deliveries">
                  {filteredDeliveries.map((d) => (
                    <CommandItem key={d.id} value={`delivery-${d.id}`} onSelect={() => handleSelect(`/deliveries/${d.id}`)}>
                      <Truck className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{d.reference}</span>
                        <span className="text-[10px] text-muted-foreground">{d.customer}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandSeparator />
            </>
          )}

          {!query && (
            <>
              <CommandGroup heading="Pages">
                {pages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <CommandItem
                      key={page.href}
                      value={page.label}
                      onSelect={() => handleSelect(page.href)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {page.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Quick Actions">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <CommandItem
                      key={action.href}
                      value={action.label}
                      onSelect={() => handleSelect(action.href)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
