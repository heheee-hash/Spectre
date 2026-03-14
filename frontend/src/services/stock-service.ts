import { mockActivity, mockChartData, mockStockLedger } from '@/data';
import type { StockLedgerEntry } from '@/data';
import type { ActivityItem, ChartDataPoint } from '@/types';
import { simulateDelay } from './utils';

export const stockService = {
  async getStockLedger(): Promise<StockLedgerEntry[]> {
    await simulateDelay(300);
    return [...mockStockLedger].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  async getActivity(): Promise<ActivityItem[]> {
    await simulateDelay(200);
    return [...mockActivity].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  async getChartData(): Promise<ChartDataPoint[]> {
    await simulateDelay(200);
    return [...mockChartData];
  },
};
