import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { UserRole } from '@/lib/auth/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: User[]; // Mock database of registered users
  login: (user: User) => void;
  logout: () => void;
  registerUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      // Default users with roles
      registeredUsers: [
        {
          id: 'usr_admin',
          name: 'Admin Johnson',
          email: 'admin@coreinventory.com',
          role: UserRole.INVENTORY_MANAGER,
        },
        {
          id: 'usr_staff',
          name: 'Warehouse staff',
          email: 'staff@coreinventory.com',
          role: UserRole.WAREHOUSE_STAFF,
        },
      ],
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      registerUser: (user) =>
        set((state) => ({
          registeredUsers: [...state.registeredUsers, user],
        })),
    }),
    {
      name: 'coreinventory-auth-storage',
    }
  )
);
