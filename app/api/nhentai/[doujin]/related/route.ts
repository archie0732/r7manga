import { APISearchResultData } from '../../_model/apitypes';
import { DoujinSearchResult } from '../../search/route';
import { toThumbnailUrl } from '../../_model/_lib/util';

import { languageMap } from '../../_model/_lib/util';

interface Params {
  params: Promise<{ doujin: string }>;
}

export const GET = async (req: Request, { params }: Params) => {
  const id = (await params).doujin;
  const response = await fetch(`https://nhentai.net/api/gallery/${id}/related`, { headers: {
    'cookie':
        'cf_clearance=oSXhICF7I0Q7Nr4D8MHx0b3nYgnA47Cn1GiEcSnJdT4-1738478995-1.2.1.1-YfZpT6cGnE21mi0.sLcZ7WNrIPK2w_shdZl.LOXAnDTnwKoABZfaOTCe4pBlMe.uADLTDiky7IPPBzasv5D2MQKht9Vi_zZE5Z.aXuo5l67tXPWnyePE13.dnTWZYv3VQhFUBsXvegB7QFHO80_51ZTZ6aScdYEJlfxZ_Bjv7G0TBXiEpZAtSwxgFVgjOf0dPtGEqnKjgmYPUxSek0wsT40cSIemvlWd6blFU2IgRed2DAqMpPi7IMdh9AgiSx3uJBXQVuogbqoLDkRi0PDGq3CkL_6qsliXAs_0BMc0lQQmKSWmChLrI0xaFHgjxnRLiD5ywHXMs2OFtSiVJlomDQ',
    'referer':
        'https://nhentai.net/',
    'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
  } });
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
