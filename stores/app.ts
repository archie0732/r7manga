import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppStoreState {
  light: boolean;
  protect: boolean;
  commandPanelVisible: boolean;
  toggleProtect(this: void, state?: boolean): void;
  setTheme(this: void, theme: ThemeMode): void;
  setCommandPanelVisible(this: void, visible: boolean): void;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  light: false,
  protect: true,
  commandPanelVisible: false,
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
  setCommandPanelVisible(visible: boolean) {
    set({
      commandPanelVisible: visible,
    });
  },
}));
