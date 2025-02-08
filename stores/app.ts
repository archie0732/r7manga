import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';
export type NhentaiURL = 'https://i1.nhentai.net/galleries' | 'https://i2.nhentai.net/galleries' | 'https://i3.nhentai.net/galleries';
export type ProtectImage = '/img/1210.png' | '/img/1280.png' | '/img/20250108.jpg' | '/img/8_20250113-2.jpg';
export type ReadMode = 'scroll' | 'pagination';

interface AppStoreState {
  light: boolean;
  protect: boolean;
  commandPanelVisible: boolean;
  nhentaiImageURL: NhentaiURL;
  protectImage: ProtectImage;
  readMode: ReadMode;
  readModeCheck: boolean;
  kindkey: string;
  offline: boolean;
  toggleProtect(this: void, state?: boolean): void;
  setTheme(this: void, theme: ThemeMode): void;
  setCommandPanelVisible(this: void, visible: boolean): void;
  setNImageURL(this: void, state: NhentaiURL): void;
  setProtectImage(this: void, state: ProtectImage): void;
  setReadMode(this: void, state: ReadMode): void;
  showreadModeCheck(this: void, state?: boolean): void;
  setKindKey(this: void, state: string): void;
  setOffline(this: void): void;
}

export const useAppStore = create(
  persist<AppStoreState>(
    (set, get) => ({
      light: false,
      protect: true,
      commandPanelVisible: false,
      nhentaiImageURL: 'https://i1.nhentai.net/galleries',
      protectImage: '/img/1210.png',
      readMode: 'scroll',
      readModeCheck: true,
      kindkey: '',
      offline: false,

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
      setNImageURL(url) {
        set({
          nhentaiImageURL: url,
        });
      },
      setProtectImage(img) {
        set({
          protectImage: img,
        });
      },
      setReadMode(state) {
        set({
          readMode: state,
        });
      },
      showreadModeCheck(state) {
        set({
          readModeCheck: state ?? !get().readModeCheck,
        });
      },
      setKindKey(state) {
        set({ kindkey: state });
      },
      setOffline() {
        set({
          offline: !get().offline,
        });
      },

    }),
    {
      name: 'app',
    },
  ),
);
