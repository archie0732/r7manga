import { fetchNhentai, toCoverUrl, toImagePath, toThumbnailUrl } from '../_model/_lib/util';

import type { APIDoujinData, APIDoujinTagData } from '../_model/apitypes';

export interface TagData {
  id: number;
  type: string;
  name: string;
  url: string;
  count: number;
}

export interface Doujin extends Omit<APIDoujinData, 'id' | 'media_id' | 'images' | 'num_pages' | 'cover' | 'thumbnail' | 'pages'> {
  id: string;
  images: string[];
  category: APIDoujinTagData[];
  parody: APIDoujinTagData[];
  language: APIDoujinTagData[];
  artists: APIDoujinTagData[];
  characters: APIDoujinTagData[];
  translated: boolean;
  thumbnail: string;
  cover: string;
  banTag: APIDoujinTagData[];
}

type Params = Readonly<{
  params: Promise<{ doujin: string }>;
}>;

let cacheId = '', cache: Doujin | null = null, lastestTime = 0;

export async function GET(_req: Request, { params }: Params) {
  const id = (await params).doujin;

  if (cache && cacheId == id && Date.now() - lastestTime <= 6_000) {
    return Response.json((cache));
  }

  const response = await fetchNhentai(`/galleries/${id}`);
  cacheId = id;

  if (!response.ok) {
    return new Response('failure', { status: response.status });
  }

  const json = await response.json() as APIDoujinData;
  const images: string[] = [];
  const category = json.tags.filter((t) => t.type == 'category');
  const parody = json.tags.filter((t) => t.type == 'parody');
  const language = json.tags.filter((t) => t.type == 'language' && t.name != 'translated');
  const artists = json.tags.filter((t) => t.type == 'artist');
  const characters = json.tags.filter((t) => t.type == 'character');

  for (const i of [...Array(json.num_pages).keys()]) {
    const imagePath = toImagePath(json, i);
    if (imagePath) {
      images.push(imagePath);
    }
  }

  const { num_pages, media_id, title, ...data } = json;
  void [num_pages, media_id];

  const banTag = json.tags.reduce((acc, val) => {
    if (val.name === 'male only' || val.name === 'males only') {
      acc.push(val);
    }
    return acc;
  }, [] as APIDoujinTagData[]);

  const normalizedTitle = {
    ...title,
    japanese: title.japanese ?? undefined,
    pretty: title.pretty ?? title.japanese ?? title.english,
  };

  const [thumbnail, cover] = await Promise.all([
    toThumbnailUrl(json),
    toCoverUrl(json),
  ]);

  cache = ({
    ...data,
    title: normalizedTitle,
    id: data.id.toString(),
    tags: data.tags.filter((t) => t.type == 'tag'),
    images,
    category,
    parody,
    language,
    artists,
    characters,
    translated: !!data.tags.find((t) => t.name == 'translated'),
    thumbnail,
    cover,
    banTag,
  } as Doujin);

  lastestTime = Date.now();

  return Response.json(({
    ...data,
    title: normalizedTitle,
    id: data.id.toString(),
    tags: data.tags.filter((t) => t.type == 'tag'),
    images,
    category,
    parody,
    language,
    artists,
    characters,
    translated: !!data.tags.find((t) => t.name == 'translated'),
    thumbnail,
    cover,
    banTag,
  } as Doujin));
}
