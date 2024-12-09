import { APIfetchError, createArchieAPI } from '@/lib/util/fetchAPI';
import { create } from 'zustand';

import Manga from '@/lib/util/manga.interface';

interface MangaStoreState {
  homeManga: Manga[];
  fetchHome(): Promise<void>;
}

export const useNHentaiArtistStore = create<MangaStoreState>((set) => ({
  homeManga: [],
  async fetchHome() {
    const data = await createArchieAPI('nhentai').getHomepageManga();
    if (!data.success) throw new APIfetchError('nhentai', 'manga type error', 200);
    else {
      set({
        homeManga: data.data,
      });
    }
  },
}));
