import { load } from 'cheerio';
import { formatId, getPicture } from '../_lib/util';

type Params = Readonly<{
  params: Promise<{ doujin: string }>;
}>;

export interface Album {
  id: string;
  title: string;
  cover: string;
  type: string;
  page: string;
  tag: string[];
  view: string[];
  readPage: string[];
}

export async function GET(req: Request, { params }: Params) {
  const id = (await params).doujin;

  const response = await fetch(`https://www.wnacg.com/photos-index-aid-${id}.html`);

  if (!response.ok) {
    return new Response('fetch wnacg error', {
      status: 500,
    });
  }

  const $ = load(await response.text());
  const title = $('#bodywrap h2').text();
  const cover = $('.asTBcell.uwthumb img').attr('src') ?? '';
  const $elements = $('.asTBcell.uwconn').find('label');
  const type = $elements.eq(0).text().split('：').pop();
  const page = $elements.eq(1).text().split('：').pop()?.replace('P', '');
  const tag: string[] = [];
  $('.addtags a.tagshow').each((_, element) => {
    tag.push($(element).text());
  });
  const view: string[] = [];

  $('.gallary_wrap a img').each((_, element) => {
    const p = $(element).attr('src');
    if (p) {
      view.push(p);
    }
  });

  if (title === '' && cover === '' && type === '' && page == '') {
    return Response.json('this album is not exist', { status: 500 });
  }

  const extension = cover.split('.').pop() ?? 'webp';

  const readPage = getPicture(formatId(id), Number(page), extension);

  return Response.json({
    id,
    title,
    cover,
    type,
    page,
    tag,
    view,
    readPage,
  } as Album);
}
