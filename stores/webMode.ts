import { create } from 'zustand';

interface WebMode {
  light: boolean;
  protect: boolean;
  change(this: void, name: string): void;
}

export const useWebMode = create<WebMode>((set) => ({
  light: false,
  protect: true,

  change: (name: 'light' | 'protect') => {
    set((state) => ({ [name]: !state[name] }));
  },
}));
