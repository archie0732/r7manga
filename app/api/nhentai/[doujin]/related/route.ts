import { fetchNhentai, langFromTagIds, listItemThumbnailUrl } from '../../_model/_lib/util';

import type { APIRelatedResultData } from '../../_model/apitypes';
import type { DoujinSearchResult } from '../../search/route';

interface Params {
  params: Promise<{ doujin: string }>;
}

export const GET = async (_req: Request, { params }: Params) => {
  const id = (await params).doujin;
  const response = await fetchNhentai(`/galleries/${id}/related`);
  if (!response.ok) {
    return new Response('failure', { status: 400 });
  }
  const raw = await response.json() as APIRelatedResultData;

  const doujinlist: DoujinSearchResult[] = [];

  for (const doujin of raw.result) {
    const banTag: string[] = [];

    doujinlist.push({
      title: doujin.japanese_title ?? doujin.english_title,
      id: doujin.id.toString(),
      thumbnail: await listItemThumbnailUrl(doujin),
      lang: langFromTagIds(doujin.tag_ids),
      page: doujin.num_pages ?? 0,
      banTag,
    });
  }

  return Response.json(doujinlist);
};
