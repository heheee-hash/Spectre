import { create } from 'zustand';

interface InventoryFilters {
  search: string;
  status: string;
  warehouse: string;
  category: string;
  dateRange: { from: string; to: string } | null;
}

interface InventoryState {
  filters: InventoryFilters;
  selectedItems: string[];
  setFilter: <K extends keyof InventoryFilters>(key: K, value: InventoryFilters[K]) => void;
  resetFilters: () => void;
  toggleSelectItem: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
}

const defaultFilters: InventoryFilters = {
  search: '',
  status: 'all',
  warehouse: 'all',
  category: 'all',
  dateRange: null,
};

export const useInventoryStore = create<InventoryState>((set) => ({
  filters: { ...defaultFilters },
  selectedItems: [],
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
  toggleSelectItem: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.includes(id)
        ? state.selectedItems.filter((i) => i !== id)
        : [...state.selectedItems, id],
    })),
  selectAll: (ids) => set({ selectedItems: ids }),
  clearSelection: () => set({ selectedItems: [] }),
}));
