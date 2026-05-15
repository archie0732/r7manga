import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LangTagLike {
  id?: number | string;
  name?: string;
}

const languageTagIdMap: Record<string, 'ja' | 'zh' | 'en'> = {
  6346: 'ja',
  29963: 'zh',
  12227: 'en',
};

export function langFilter(tags?: LangTagLike[] | null): 'ja' | 'zh' | 'en' {
  if (!tags || tags.length === 0) {
    return 'ja';
  }

  for (const tag of tags) {
    const id = tag.id?.toString();
    if (id && languageTagIdMap[id]) {
      return languageTagIdMap[id];
    }
  }

  for (const tag of tags) {
    const name = tag.name?.toLowerCase();
    if (name === 'chinese' || name === 'zh') {
      return 'zh';
    }
    if (name === 'english' || name === 'en') {
      return 'en';
    }
    if (name === 'japanese' || name === 'ja') {
      return 'ja';
    }
  }

  return 'ja';
}
