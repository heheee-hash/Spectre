import { mockActivity, mockChartData, mockStockLedger } from '@/data';
import type { StockLedgerEntry } from '@/data';
import type { ActivityItem, ChartDataPoint } from '@/types';
import { simulateDelay } from './utils';

export const stockService = {
  async getStockLedger(): Promise<StockLedgerEntry[]> {
    const res = await fetch('/api/move-history');
    if (!res.ok) throw new Error('Failed to fetch stock ledger');
    return res.json();
  },

  async getActivity(): Promise<ActivityItem[]> {
    const res = await fetch('/api/dashboard');
    if (!res.ok) throw new Error('Failed to fetch activity');
    const data = await res.json();
    return data.operations;
  },

  async getChartData(): Promise<ChartDataPoint[]> {
    const res = await fetch('/api/dashboard');
    if (!res.ok) throw new Error('Failed to fetch chart data');
    const data = await res.json();
    return data.trend;
  },
};
