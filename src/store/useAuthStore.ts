import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
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
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType?.includes("application/json")) {
        const data = await res.json();
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (err) {
      set({ user: null, isLoading: false, error: 'Failed to authenticate' });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      set({ user: null, isLoading: false, error: null });
      // In a real app, you might want to redirect to the login page here
      window.location.href = '/login';
    } catch (err) {
      set({ isLoading: false, error: 'Failed to logout' });
    }
  },
}));
