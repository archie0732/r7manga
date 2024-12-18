import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppStoreState {
  light: boolean;
  protect: boolean;
  commandPanelVisible: boolean;
  toggleProtect(this: void, state?: boolean): void;
  setTheme(this: void, theme: ThemeMode): void;
  setCommandPanelVisible(this: void, visible: boolean): void;
}

export const useAppStore = create(
  persist<AppStoreState>(
    (set, get) => ({
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
    }),
    {
      name: 'app',
    },
  ),
);
