import { APISearchResultData } from '../../_model/apitypes';
import { DoujinSearchResult } from '../../search/route';
import { toThumbnailUrl } from '../../_model/_lib/util';

import { languageMap } from '../../_model/_lib/util';

interface Params {
  params: Promise<{ doujin: string }>;
}

export const GET = async (req: Request, { params }: Params) => {
  const id = (await params).doujin;
  const response = await fetch(`https://nhentai.net/api/gallery/${id}/related`);
  if (!response.ok) {
    return new Response('failure', { status: 400 });
  }
  const raw = await response.json() as APISearchResultData;

  const doujinlist: DoujinSearchResult[] = [];

  for (const doujin of raw.result) {
    const langTag = doujin.tags.find((t) => t.type == 'language');
    const banTag = doujin.tags.reduce((acc, val) => {
      if (val.type === 'tag' && val.name === 'male only') {
        acc.push(val.name);
      }
      return acc;
    }, [] as string[]);

    doujinlist.push({
      title: doujin.title.japanese ?? doujin.title.english,
      id: doujin.id.toString(),
      thumbnail: toThumbnailUrl(doujin),
      lang: langTag ? languageMap[langTag.id] ?? 'ja' : 'ja',
      banTag,
    });
  }

  return Response.json(doujinlist);
};
