import { toCoverUrl, toImageUrl, toThumbnailUrl } from '../_model/_lib/util';
import { APIDoujinData, APIDoujinTagData } from '../_model/apitypes';

export interface TagData {
  id: number;
  type: string;
  name: string;
  url: string;
  count: number;
}

export interface Doujin extends Omit<APIDoujinData, 'id' | 'media_id' | 'images' | 'num_pages'> {
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
}

type Params = Readonly<{
  params: Promise<{ doujin: string }>;
}>;

export async function GET(req: Request, { params }: Params) {
  const id = (await params).doujin;

  const response = await fetch(`https://nhentai.net/api/gallery/${id}`);

  if (!response.ok) {
    return new Response(
      'failure', { status: 400 },
    );
  }

  const json = await response.json() as APIDoujinData;
  const images: string[] = [];
  const category = json.tags.filter((t) => t.type == 'category');
  const parody = json.tags.filter((t) => t.type == 'parody');
  const language = json.tags.filter((t) => t.type == 'language' && t.name != 'tranlated');
  const artists = json.tags.filter((t) => t.type == 'artist');
  const characters = json.tags.filter((t) => t.type == 'character');

  for (const i of [...Array(json.num_pages).keys()]) {
    images.push(toImageUrl(json, i, true));
  }

  const { num_pages, media_id, ...data } = json;
  void [num_pages, media_id];

  return Response.json(<Doujin>{
    ...data,
    id: data.id.toString(),
    tags: data.tags.filter((t) => t.type == 'tag'),
    images,
    category,
    parody,
    language,
    artists,
    characters,
    translated: !!data.tags.find((t) => t.name == 'translated'),
    thumbnail: toThumbnailUrl(json),
    cover: toCoverUrl(json),
  });
}
