import { create } from 'zustand';

import { DoujinSearchResult } from '@/app/api/nhentai/search/route';

export interface DoujinStoreState {
  doujin: Map<string, DoujinSearchResult>;
  recent: Set<string>;
  popular: Set<string>;
  popularToday: Set<string>;
  popularWeek: Set<string>;
  fetchHome(sort?: string): Promise<DoujinSearchResult[]>;
}

export const useDoujinStore = create<DoujinStoreState>((set, get) => ({
  doujin: new Map(),
  recent: new Set(),
  popular: new Set(),
  popularToday: new Set(),
  popularWeek: new Set(),
  async fetchHome(sort: string = 'recent') {
    const response = await fetch(`/api/nhentai/search?q=*&sort=${sort}`);
    if (!response.ok) throw await response.text();

    const data = await response.json() as DoujinSearchResult[];

    const state = get();

    for (const item of data) {
      state.doujin.set(item.id, item);
    }

    if (sort) {
      const ids = new Set(data.map((d) => d.id));

      switch (sort) {
        case 'recent':
          state.recent = ids;
          break;

        case 'popular':
          state.popular = ids;
          break;

        case 'popular-today':
          state.popularToday = ids;
          break;

        case 'popular-week':
          state.popularWeek = ids;
          break;

        default:
          break;
      }
    }

    state.doujin = new Map(state.doujin.entries());

    set(state);

    return data;
  },
}));
