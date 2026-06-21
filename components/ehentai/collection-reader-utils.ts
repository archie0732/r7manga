import type { FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';

export const buildCollectionReadQueue = (items: FavoriteDoujinItem[]) => [...items];
