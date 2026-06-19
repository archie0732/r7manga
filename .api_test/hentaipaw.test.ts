import { expect, test } from 'bun:test';

import {
  parseArtist,
  parseDoujin,
  parseGroup,
  parseHomePage,
  parseParody,
  parsePopular,
  parseSearch,
  parseTag,
} from './hentaipaw';

test('parseHomePage returns every gallery card inside the latest section only', () => {
  const html = `
    <main class="my-5">
      <h2>趋势排名</h2>
      <div class="grid grid-cols-2">
        <a class="group" href="/articles/hot-1">
          <img class="h-full" src="hot-1.jpg" alt="Hot 1, 中文">
          <div class="w-fit"><span class="fi fi-cn"></span></div>
          <div class="line-clamp-2 h-10 text-sm" title="Hot 1">Hot 1</div>
        </a>
      </div>
      <h1>最新的H漫・色情同人本</h1>
      <div class="grid grid-cols-2">
        <a class="group" href="/articles/1">
          <img class="h-full" src="thumb-1.jpg" alt="Book 1, 日本語">
          <div class="w-fit"><span class="fi fi-jp"></span></div>
          <div class="line-clamp-2 h-10 text-sm" title="Book 1">Book 1</div>
        </a>
        <a class="group" href="/articles/2">
          <img class="h-full" src="thumb-2.jpg" alt="Book 2, English">
          <div class="w-fit"><span class="fi fi-en"></span></div>
          <div class="line-clamp-2 h-10 text-sm" title="Book 2">Book 2</div>
        </a>
      </div>
    </main>
  `;

  expect(parseHomePage(html)).toEqual([
    {
      title: 'Book 1',
      thumb: 'thumb-1.jpg',
      url: 'https://zh.hentaipaw.com/articles/1',
      language: 'Japanese',
    },
    {
      title: 'Book 2',
      thumb: 'thumb-2.jpg',
      url: 'https://zh.hentaipaw.com/articles/2',
      language: 'English',
    },
  ]);
});

test('parsePopular returns every gallery card from the popular page', () => {
  const html = `
    <main class="my-5">
      <h1>受欢迎的H漫・色情同人本</h1>
      <div class="grid grid-cols-2">
        <a class="group" href="/articles/101">
          <img class="h-full" src="popular-1.jpg" alt="Popular 1, 中文">
          <div class="w-fit"><span class="fi fi-cn"></span></div>
          <div class="line-clamp-2 h-10 text-sm" title="Popular 1">Popular 1</div>
        </a>
        <a class="group" href="/articles/102">
          <img class="h-full" src="popular-2.jpg" alt="Popular 2, English">
          <div class="w-fit"><span class="fi fi-en"></span></div>
          <div class="line-clamp-2 h-10 text-sm" title="Popular 2">Popular 2</div>
        </a>
      </div>
    </main>
  `;

  expect(parsePopular(html)).toEqual([
    {
      title: 'Popular 1',
      thumb: 'popular-1.jpg',
      url: 'https://zh.hentaipaw.com/articles/101',
      language: 'Chinese',
    },
    {
      title: 'Popular 2',
      thumb: 'popular-2.jpg',
      url: 'https://zh.hentaipaw.com/articles/102',
      language: 'English',
    },
  ]);
});

test('parseDoujin returns detail metadata with ids and full-size page images', () => {
  const detailHtml = `
    <main class="my-5">
      <div id="article-details">
        <div class="container rounded-2xl bg-accent p-5">
          <div class="flex flex-col gap-4 rounded-2xl bg-neutral-900 px-2 py-4 md:px-16 lg:flex-row">
            <div class="flex h-[490px] w-full items-center justify-center overflow-hidden rounded-md lg:w-1/2">
              <a class="group" href="/viewer?articleId=3407674&page=1">
                <img src="https://cdn.imagedeliveries.com/3407674/thumbnails/cover.webp" alt="CHOP STICK3" class="h-full w-full rounded-lg object-cover">
              </a>
            </div>
            <div class="flex w-full flex-col lg:w-1/2">
              <h1 class="text-wrap text-lg font-semibold md:text-2xl">CHOP STICK3</h1>
              <div id="article-tag-information" class="mt-4">
                <div class="flex flex-col gap-2">
                  <div class="flex flex-wrap gap-1">
                    <h3>作者:</h3>
                    <a href="/artists/10578"><div>kakutou oukoku</div></a>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <h3>团队:</h3>
                    <p>N/A</p>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <h3>原作:</h3>
                    <a href="/parodies/2763"><div>海贼王</div></a>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <h3>角色:</h3>
                    <a href="/characters/2089"><div>carrot</div></a>
                    <a href="/characters/11195"><div>娜美</div></a>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <h3>标签:</h3>
                    <a href="/tags/186"><div>大乳房</div></a>
                    <a href="/tags/1256"><div>兽人</div></a>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <h3>作品语言:</h3>
                    <a href="/languages/3"><div>中文</div></a>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <h3>类别:</h3>
                    <a href="/categories/2"><div>色情同人志</div></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container space-y-8 p-5 mt-4 bg-accent rounded-2xl">
          <div class="mx-auto grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-2 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5 w-fit">
            <a href="/viewer?articleId=3407674&page=1"><div><img src="https://cdn.imagedeliveries.com/3407674/thumbnails/1.webp" alt="CHOP STICK3, 中文"></div></a>
            <a href="/viewer?articleId=3407674&page=2"><div><img src="https://cdn.imagedeliveries.com/3407674/thumbnails/2.webp" alt="CHOP STICK3, 中文"></div></a>
          </div>
        </div>
      </div>
    </main>
  `;

  const viewerHtml = `
    <script>
      window.__pages = [
        "https://cdn.imagedeliveries.com/3407674/4ed3bf418dce7e698e6bd4c4093390292c5c97d6/1.webp",
        "https://cdn.imagedeliveries.com/3407674/c57ba84c3782005fe566bd0321b2c5fcd49e3e8b/2.webp"
      ];
    </script>
  `;

  expect(parseDoujin(detailHtml, viewerHtml)).toEqual({
    title: 'CHOP STICK3',
    cover: 'https://cdn.imagedeliveries.com/3407674/thumbnails/cover.webp',
    author: { id: 10578, name: 'kakutou oukoku' },
    group: { id: null, name: 'N/A' },
    parody: { id: 2763, name: '海贼王' },
    characters: [
      { id: 2089, name: 'carrot' },
      { id: 11195, name: '娜美' },
    ],
    tags: [
      { id: 186, name: '大乳房' },
      { id: 1256, name: '兽人' },
    ],
    language: 'Chinese',
    category: '色情同人志',
    pages: [
      'https://cdn.imagedeliveries.com/3407674/4ed3bf418dce7e698e6bd4c4093390292c5c97d6/1.webp',
      'https://cdn.imagedeliveries.com/3407674/c57ba84c3782005fe566bd0321b2c5fcd49e3e8b/2.webp',
    ],
    thumbs: [
      'https://cdn.imagedeliveries.com/3407674/thumbnails/1.webp',
      'https://cdn.imagedeliveries.com/3407674/thumbnails/2.webp',
    ],
  });
});

test('tag, artist, group, and parody parsers all return PawSearchResult arrays', () => {
  const html = `
    <main class="my-5">
      <h1>Some Listing</h1>
      <div class="grid grid-cols-2">
        <a class="group" href="/articles/201">
          <img class="h-full" src="listing-1.jpg" alt="Listing 1, 中文">
          <div class="w-fit"><span class="fi fi-cn"></span></div>
          <div class="line-clamp-2 h-10 text-sm" title="Listing 1">Listing 1</div>
        </a>
        <a class="group" href="/articles/202">
          <img class="h-full" src="listing-2.jpg" alt="Listing 2, English">
          <div class="w-fit"><span class="fi fi-en"></span></div>
          <div class="line-clamp-2 h-10 text-sm" title="Listing 2">Listing 2</div>
        </a>
      </div>
    </main>
  `;

  const expected = [
    {
      title: 'Listing 1',
      thumb: 'listing-1.jpg',
      url: 'https://zh.hentaipaw.com/articles/201',
      language: 'Chinese',
    },
    {
      title: 'Listing 2',
      thumb: 'listing-2.jpg',
      url: 'https://zh.hentaipaw.com/articles/202',
      language: 'English',
    },
  ];

  expect(parseTag(html)).toEqual(expected);
  expect(parseArtist(html)).toEqual(expected);
  expect(parseGroup(html)).toEqual(expected);
  expect(parseParody(html)).toEqual(expected);
});

test('parseSearch returns PawSearchResult arrays from search listings', () => {
  const html = `
    <main class="my-5">
      <h1>娜美的H漫・色情同人本</h1>
      <div class="grid grid-cols-2">
        <a class="group" href="/articles/301">
          <img class="h-full" src="search-1.jpg" alt="Search 1, 中文">
          <div class="w-fit"><span class="fi fi-cn"></span></div>
          <div class="line-clamp-2 h-10 text-sm" title="Search 1">Search 1</div>
        </a>
        <a class="group" href="/articles/302">
          <img class="h-full" src="search-2.jpg" alt="Search 2, English">
          <div class="w-fit"><span class="fi fi-en"></span></div>
          <div class="line-clamp-2 h-10 text-sm" title="Search 2">Search 2</div>
        </a>
      </div>
    </main>
  `;

  expect(parseSearch(html)).toEqual([
    {
      title: 'Search 1',
      thumb: 'search-1.jpg',
      url: 'https://zh.hentaipaw.com/articles/301',
      language: 'Chinese',
    },
    {
      title: 'Search 2',
      thumb: 'search-2.jpg',
      url: 'https://zh.hentaipaw.com/articles/302',
      language: 'English',
    },
  ]);
});
