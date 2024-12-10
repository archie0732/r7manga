import { create } from 'zustand';

import { DoujinData } from '@/app/api/nhentai/search/route';

interface MangaStoreState {
  doujin: Map<string, DoujinData>;
  fetchHome(): Promise<void>;
}

export const useNHentaiHomeStore = create<MangaStoreState>((set, get) => ({
  doujin: new Map(),
  async fetchHome() {
    const response = await fetch('/api/nhentai/search?q=*');
    if (!response.ok) throw await response.text();

    const data = await response.json() as DoujinData[];

    const doujin = get().doujin;

    for (const item of data) {
      doujin.set(item.id, item);
    }

    set({ doujin });
  },
}));
