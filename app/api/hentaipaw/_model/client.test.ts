import { describe, expect, test } from 'bun:test';

import {
  HentaipawClient,
  buildListingQuery,
  mapHentaipawLanguage,
} from './client';

const listingHtml = `
  <main class="my-5">
    <a class="group" href="/articles/3407674">
      <div title="Sample Title"></div>
      <img class="h-full" src="https://cdn.imagedeliveries.com/123/abc/cover.webp" alt="Sample Title, cover" />
      <div class="w-fit">
        <span class="fi fi-cn"></span>
      </div>
    </a>
  </main>
`;

const homeHtml = `
  <main class="my-5">
    <h2>熱門區塊</h2>
    <div class="grid grid-cols-2">
      <a class="group" href="/articles/1111111">
        <div title="Wrong Section"></div>
        <img class="h-full" src="https://cdn.imagedeliveries.com/111/wrong/cover.webp" />
        <div class="w-fit"><span class="fi fi-en"></span></div>
      </a>
    </div>
    <h2>最新的H漫・色情同人本</h2>
    <div class="grid grid-cols-2">
      <a class="group" href="/articles/3407674">
        <div title="Sample Title"></div>
        <img class="h-full" src="https://cdn.imagedeliveries.com/123/abc/cover.webp" />
        <div class="w-fit"><span class="fi fi-cn"></span></div>
      </a>
    </div>
  </main>
`;

const detailHtml = `
  <section id="article-details">
    <h1>Sample Title</h1>
    <a class="group"><img src="https://cdn.imagedeliveries.com/123/abc/cover.webp" /></a>
  </section>
  <section id="article-tag-information">
    <div class="flex flex-wrap gap-1">
      <h3>作者:</h3>
      <a href="/artists/11">Sample Author</a>
    </div>
    <div class="flex flex-wrap gap-1">
      <h3>社團:</h3>
      <a href="/groups/22">Sample Group</a>
    </div>
    <div class="flex flex-wrap gap-1">
      <h3>原作:</h3>
      <a href="/parodies/33">Sample Parody</a>
    </div>
    <div class="flex flex-wrap gap-1">
      <h3>角色:</h3>
      <a href="/characters/44">Sample Character</a>
    </div>
    <div class="flex flex-wrap gap-1">
      <h3>標籤:</h3>
      <a href="/tags/55">Sample Tag</a>
    </div>
    <div class="flex flex-wrap gap-1">
      <h3>語言:</h3>
      <a href="/languages/1">English</a>
    </div>
    <div class="flex flex-wrap gap-1">
      <h3>分類:</h3>
      <p>Doujinshi</p>
    </div>
  </section>
  <a href="/viewer?articleId=3407674&page=1"><img src="https://cdn.imagedeliveries.com/123/abc/thumbnails/1.webp" /></a>
  <a href="/viewer?articleId=3407674&page=2"><img src="https://cdn.imagedeliveries.com/123/abc/thumbnails/2.webp" /></a>
`;

const viewerHtml = `
  <script>
    const pages = [
      "https://cdn.imagedeliveries.com/123/aaa/1.webp",
      "https://cdn.imagedeliveries.com/123/bbb/2.jpg"
    ]
  </script>
`;

describe('HentaipawClient', () => {
  test('buildListingQuery maps search filters to query contract', () => {
    expect(buildListingQuery({
      q: 'keyword',
      sort: 'popular',
      page: '2',
    })).toBe('/articles/search?keyword=keyword&page=2&type=popular');

    expect(buildListingQuery({
      tagId: '55',
      page: '3',
    })).toBe('/tags/55?page=3');

    expect(buildListingQuery({
      artistId: '11',
      sort: 'popular',
    })).toBe('/artists/11?type=popular');

    expect(buildListingQuery({
      sort: 'recent',
      page: '1',
    })).toBe('/?page=1');
  });

  test('search parses listing cards into shared search result shape', () => {
    const client = new HentaipawClient(async () => new Response(listingHtml));

    expect(client.parseListingPage(listingHtml)).toEqual([
      {
        title: 'Sample Title',
        id: '3407674',
        thumbnail: 'https://cdn.imagedeliveries.com/123/abc/cover.webp',
        banTag: [],
        lang: 'zh',
        page: 0,
      },
    ]);
  });

  test('parseHomePage selects the latest section instead of the first grid', () => {
    const client = new HentaipawClient(async () => new Response(homeHtml));

    expect(client.parseHomePage(homeHtml)).toEqual([
      {
        title: 'Sample Title',
        id: '3407674',
        thumbnail: 'https://cdn.imagedeliveries.com/123/abc/cover.webp',
        banTag: [],
        lang: 'zh',
        page: 0,
      },
    ]);
  });

  test('getDoujinDetail parses metadata, thumbnails, and page urls', async () => {
    const client = new HentaipawClient(async (input) => {
      const url = input.toString();

      if (url.endsWith('/articles/3407674')) {
        return new Response(detailHtml);
      }

      if (url.includes('/viewer?articleId=3407674&page=1')) {
        return new Response(viewerHtml);
      }

      return new Response('not found', { status: 404 });
    });

    const detail = await client.getDoujinDetail('3407674');

    expect(detail).toMatchObject({
      id: '3407674',
      title: 'Sample Title',
      cover: 'https://cdn.imagedeliveries.com/123/abc/cover.webp',
      lang: 'en',
      category: 'Doujinshi',
      pages: [
        'https://cdn.imagedeliveries.com/123/aaa/1.webp',
        'https://cdn.imagedeliveries.com/123/bbb/2.jpg',
      ],
      thumbnails: [
        'https://cdn.imagedeliveries.com/123/abc/thumbnails/1.webp',
        'https://cdn.imagedeliveries.com/123/abc/thumbnails/2.webp',
      ],
      artists: [{ id: 11, type: 'artist', name: 'Sample Author', url: '/p?artistId=11&artist=Sample+Author' }],
      groups: [{ id: 22, type: 'group', name: 'Sample Group', url: '/p?groupId=22&group=Sample+Group' }],
      parody: [{ id: 33, type: 'parody', name: 'Sample Parody', url: '/p?parodyId=33&parody=Sample+Parody' }],
      characters: [{ id: 44, type: 'character', name: 'Sample Character', url: '' }],
      tags: [{ id: 55, type: 'tag', name: 'Sample Tag', url: '/p?tagId=55&tag=Sample+Tag' }],
    });
  });

  test('mapHentaipawLanguage normalizes display language to shared language code', () => {
    expect(mapHentaipawLanguage('Chinese')).toBe('zh');
    expect(mapHentaipawLanguage('Japanese')).toBe('ja');
    expect(mapHentaipawLanguage('English')).toBe('en');
    expect(mapHentaipawLanguage('Unknown')).toBe('en');
  });
});
