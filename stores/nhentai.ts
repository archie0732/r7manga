import { APIfetchError, archieAPI } from '@/lib/util/fetchAPI';
import { create } from 'zustand';

import Manga from '@/lib/util/manga.interface';

interface MangaStoreState {
  manga: Manga[];
  fetch(name: string): Promise<void>;
}

export const useNHentaiArtistStore = create<MangaStoreState>((set) => ({
  manga: [],
  async fetch(name: string) {
    const data = await archieAPI('nhentai').artist(name);
    if (!data.success) throw new APIfetchError('nhentai', 'manga type error', 200);
    else {
      set({
        manga: data.data,
      });
    }
  },
}));
