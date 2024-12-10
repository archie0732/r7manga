import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppStoreState {
  light: boolean;
  protect: boolean;
  toggleProtect(state?: boolean): void;
  setTheme(theme: ThemeMode): void;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  light: false,
  protect: true,
  toggleProtect(state) {
    set({
      protect: state ?? !get().protect,
    });
  },
  setTheme(theme) {
    set({
      light: theme == 'light',
    });
  },
}));
