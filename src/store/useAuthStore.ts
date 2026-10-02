import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  fullname: string;
  createdAt: string;
  avatarUrl: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start loading as true so we don't flash unauthenticated state on refresh
  error: null,

  setUser: (user) => set({ user }),

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/auth/me');
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (res.ok && data.user) {
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch {
      set({ user: null, isLoading: false, error: 'Failed to authenticate' });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      set({ user: null, isLoading: false, error: null });
      // Redirect to login page at root /
      window.location.href = '/';
    } catch {
      set({ isLoading: false, error: 'Failed to logout' });
    }
  },
}));
