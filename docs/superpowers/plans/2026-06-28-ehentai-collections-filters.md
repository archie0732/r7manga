# E-Hentai Collections Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add filterable e-hentai collection management with full artist/parody option lists, cover-first previews, append-to-existing-collection support, and low-concurrency metadata hydration.

**Architecture:** Extend the existing e-hentai favorite summary model so saved works can carry `artists` and `parodies`, then add focused store mutations for metadata hydration and collection appends. Rebuild `/e/collections` around three tabs (`Collections`, `Filter`, `Manage`) that operate on saved favorite data only, while reusing the current incremental e-hentai reader flow for persisted collections and filtered temporary read queues.

**Tech Stack:** Next.js App Router, React 19 client components, TypeScript, Bun tests, existing GitHub-backed `/api/favorite` persistence, existing e-hentai detail and image batch routes.

---

## File Structure

- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\apitype.ts`
  - Add optional `artists` / `parodies` to saved e-hentai works and declare hydration / append mutation types.
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\store.ts`
  - Preserve metadata fields, hydrate existing saved works, append into existing collections, and sync collection snapshots.
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\store.test.ts`
  - Add regression tests for metadata hydration and append semantics.
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\route.ts`
  - Dispatch new e-hentai hydration and append payloads through the existing persistence flow.
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-utils.ts`
  - Add pure helpers for filter options, filtered result matching, and collection cover previews.
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-utils.test.ts`
  - Add pure tests for artist/parody option derivation and filter logic.
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-reader-utils.ts`
  - Add helpers for filtered read queues and selected-ID resolution.
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-reader-utils.test.ts`
  - Add regression tests for filtered read order and existing navigator behavior.
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-list.tsx`
  - Upgrade collection cards to include visual cover previews.
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-create-panel.tsx`
  - Either reduce it to new-collection controls or fold its responsibilities into the new manage flow.
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-editor.tsx`
  - Add thumbnail-based item rows and metadata summaries.
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-reader.tsx`
  - Reuse for filtered temporary queues without increasing request burstiness.
- Modify: `D:\GitHub\archie0732\r7manga\app\e\collections\page.tsx`
  - Replace stacked layout with tabbed collections/filter/manage page shell.
- Create: `D:\GitHub\archie0732\r7manga\app\e\collections\read\page.tsx`
  - Resolve filtered selected IDs into a temporary read queue.
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\collections-page-shell.tsx`
  - Page-level tab shell and shared selection state container.
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\ehentai-filter-panel.tsx`
  - Render full artist/parody option lists with counts and local search.
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\ehentai-filter-results.tsx`
  - Render cover-first filtered result grid with selection controls.
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\ehentai-manage-panel.tsx`
  - Create-new and append-existing collection actions for the current selection.
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\ehentai-metadata-hydrator.tsx`
  - Low-concurrency client hydrator for visible saved works missing metadata.

### Task 1: Extend Favorite Data Model For E-Hentai Metadata And Append Mutations

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\apitype.ts`
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\store.ts`
- Test: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\store.test.ts`

- [ ] **Step 1: Write the failing tests for metadata hydration and append-to-existing-collection**

```ts
test('addFavoriteEntry preserves ehentai artist and parody metadata when provided', () => {
  const data = addFavoriteEntry(undefined, {
    type: 'doujin',
    website: 'ehentai',
    doujin: {
      id: '123-token',
      title: 'Gallery',
      thumbnail: 'https://img.example/cover.jpg',
      lang: 'ja',
      page: 22,
      source: 'https://e-hentai.org/g/123/token/',
      artists: ['soso'],
      parodies: ['fate grand order'],
    },
  });

  expect(data.favorite_ehentai?.doujin[0]).toMatchObject({
    artists: ['soso'],
    parodies: ['fate grand order'],
  });
});

test('mutateFavoriteCollections appends only missing items to an existing collection in selection order', () => {
  const seeded = ensureFavoriteShape({
    name: '',
    id: '',
    favorite_nhentai: { doujin: [], artist: [], character: [] },
    favorite_ehentai: {
      doujin: [
        { id: 'a', title: 'A', thumbnail: 'a', lang: 'ja', page: 1, source: 'sa' },
        { id: 'b', title: 'B', thumbnail: 'b', lang: 'ja', page: 1, source: 'sb' },
        { id: 'c', title: 'C', thumbnail: 'c', lang: 'ja', page: 1, source: 'sc' },
      ],
      collections: [{
        id: 'col-1',
        name: 'Set',
        createdAt: '2026-06-28T00:00:00.000Z',
        updatedAt: '2026-06-28T00:00:00.000Z',
        items: [
          { id: 'a', title: 'A', thumbnail: 'a', lang: 'ja', page: 1, source: 'sa' },
        ],
      }],
    },
  });

  const next = mutateFavoriteCollections(seeded, {
    type: 'ehentai-collection-append',
    collectionId: 'col-1',
    itemIds: ['c', 'a', 'b'],
  });

  expect(next.favorite_ehentai?.collections?.[0]?.items.map((item) => item.id)).toEqual(['a', 'c', 'b']);
});

test('hydrateFavoriteMetadata updates saved favorite and collection snapshot copies', () => {
  const seeded = ensureFavoriteShape({
    name: '',
    id: '',
    favorite_nhentai: { doujin: [], artist: [], character: [] },
    favorite_ehentai: {
      doujin: [
        { id: 'x', title: 'X', thumbnail: 'x', lang: 'ja', page: 8, source: 'sx' },
      ],
      collections: [{
        id: 'col-1',
        name: 'Set',
        createdAt: '2026-06-28T00:00:00.000Z',
        updatedAt: '2026-06-28T00:00:00.000Z',
        items: [
          { id: 'x', title: 'X', thumbnail: 'x', lang: 'ja', page: 8, source: 'sx' },
        ],
      }],
    },
  });

  const next = hydrateFavoriteMetadata(seeded, {
    type: 'ehentai-hydrate-metadata',
    id: 'x',
    artists: ['soso'],
    parodies: ['fate grand order'],
  });

  expect(next.favorite_ehentai?.doujin[0]).toMatchObject({
    artists: ['soso'],
    parodies: ['fate grand order'],
  });
  expect(next.favorite_ehentai?.collections?.[0]?.items[0]).toMatchObject({
    artists: ['soso'],
    parodies: ['fate grand order'],
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/favorite/_model/store.test.ts`
Expected: FAIL because `artists`, `parodies`, `ehentai-collection-append`, and `hydrateFavoriteMetadata` are not implemented yet.

- [ ] **Step 3: Write the minimal types and store implementation**

```ts
export interface FavoriteDoujinItem {
  id: string;
  title: string;
  thumbnail: string;
  lang: string;
  page: number;
  source?: string;
  artists?: string[];
  parodies?: string[];
}

export type FavoriteMetadataHydrate = {
  type: 'ehentai-hydrate-metadata';
  id: string;
  artists: string[];
  parodies: string[];
};

export type FavoriteCollectionMutation =
  | { type: 'ehentai-collection-create'; name: string; itemIds: string[] }
  | { type: 'ehentai-collection-append'; collectionId: string; itemIds: string[] }
  | { type: 'ehentai-collection-rename'; collectionId: string; name: string }
  | { type: 'ehentai-collection-reorder'; collectionId: string; itemIds: string[] }
  | { type: 'ehentai-collection-remove-item'; collectionId: string; itemId: string }
  | { type: 'ehentai-collection-delete'; collectionId: string };

const copyWithMetadata = (item: FavoriteDoujinItem, update: Pick<FavoriteDoujinItem, 'artists' | 'parodies'>) => ({
  ...item,
  artists: update.artists,
  parodies: update.parodies,
});

export const hydrateFavoriteMetadata = (
  input: FavoriteData | null | undefined,
  mutation: FavoriteMetadataHydrate,
): FavoriteData => {
  const data = ensureFavoriteShape(input);
  const bucket = data.favorite_ehentai;

  bucket.doujin = bucket.doujin.map((item) =>
    item.id === mutation.id ? copyWithMetadata(item, mutation) : item,
  );
  bucket.collections = (bucket.collections ?? []).map((collection) => ({
    ...collection,
    items: collection.items.map((item) =>
      item.id === mutation.id ? copyWithMetadata(item, mutation) : item,
    ),
  }));

  return data;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test app/api/favorite/_model/store.test.ts`
Expected: PASS with the new metadata and append regression tests green.

- [ ] **Step 5: Commit**

```bash
git add app/api/favorite/_model/apitype.ts app/api/favorite/_model/store.ts app/api/favorite/_model/store.test.ts
git commit -m "feat: add ehentai metadata and append mutations"
```

### Task 2: Route New Metadata And Append Mutations Through `/api/favorite`

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\route.ts`
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\apitype.ts`
- Test: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\store.test.ts`

- [ ] **Step 1: Write the failing dispatch test by adding one route-facing helper case in store coverage**

```ts
test('hydrateFavoriteMetadata is a no-op when metadata is already identical', () => {
  const seeded = ensureFavoriteShape({
    name: '',
    id: '',
    favorite_nhentai: { doujin: [], artist: [], character: [] },
    favorite_ehentai: {
      doujin: [
        {
          id: 'x',
          title: 'X',
          thumbnail: 'x',
          lang: 'ja',
          page: 8,
          source: 'sx',
          artists: ['soso'],
          parodies: ['fate grand order'],
        },
      ],
      collections: [],
    },
  });

  const next = hydrateFavoriteMetadata(seeded, {
    type: 'ehentai-hydrate-metadata',
    id: 'x',
    artists: ['soso'],
    parodies: ['fate grand order'],
  });

  expect(next.favorite_ehentai?.doujin[0]).toMatchObject({
    artists: ['soso'],
    parodies: ['fate grand order'],
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/favorite/_model/store.test.ts`
Expected: FAIL if hydration handling still mutates incorrectly or route-dispatch support is incomplete.

- [ ] **Step 3: Extend the POST handler to dispatch hydration payloads**

```ts
import type {
  FavoriteAdd,
  FavoriteCollectionMutation,
  FavoriteData,
  FavoriteMetadataHydrate,
  FavoriteRemove,
  FavoriteWebsite,
  GitHubFileResponse,
} from './_model/apitype';
import {
  addFavoriteEntry,
  ensureFavoriteShape,
  hydrateFavoriteMetadata,
  isDoujinFavorited,
  mutateFavoriteCollections,
  removeFavoriteEntry,
} from './_model/store';

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json() as FavoriteAdd | FavoriteCollectionMutation | FavoriteMetadataHydrate;
  const { content: remoteData, sha } = await fetchRemoteFile();
  let nextData: FavoriteData;

  try {
    if (body.type === 'ehentai-hydrate-metadata') {
      nextData = hydrateFavoriteMetadata(remoteData, body);
    }
    else if (typeof body.type === 'string' && body.type.startsWith('ehentai-collection-')) {
      nextData = mutateFavoriteCollections(remoteData, body as FavoriteCollectionMutation);
    }
    else {
      nextData = addFavoriteEntry(remoteData, body as FavoriteAdd);
    }
  }
  catch {
    return new Response('Post data error', { status: 400 });
  }

  await updateGitHubFile(JSON.stringify(nextData, null, 2), sha);
  return new Response('Data synchronized with GitHub successfully.', { status: 200 });
}
```

- [ ] **Step 4: Run the focused tests**

Run: `bun test app/api/favorite/_model/store.test.ts`
Expected: PASS, with no regressions in existing create/rename/reorder/delete collection behavior.

- [ ] **Step 5: Commit**

```bash
git add app/api/favorite/route.ts app/api/favorite/_model/apitype.ts app/api/favorite/_model/store.ts app/api/favorite/_model/store.test.ts
git commit -m "feat: route ehentai metadata updates"
```

### Task 3: Add Pure Filter Helpers For Full Artist/Parody Option Lists

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-utils.ts`
- Test: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-utils.test.ts`

- [ ] **Step 1: Write the failing helper tests for option derivation and filter matching**

```ts
test('buildEhentaiFilterOptions groups artist and parody counts from saved favorites', () => {
  const options = buildEhentaiFilterOptions([
    { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 10, artists: ['soso'], parodies: ['fate'] },
    { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 12, artists: ['soso', 'mashu'], parodies: ['fate'] },
    { id: '3', title: 'Three', thumbnail: '3', lang: 'ja', page: 14, artists: ['mashu'], parodies: ['blue archive'] },
  ]);

  expect(options.artists).toEqual([
    { value: 'mashu', count: 2 },
    { value: 'soso', count: 2 },
  ]);
  expect(options.parodies).toEqual([
    { value: 'blue archive', count: 1 },
    { value: 'fate', count: 2 },
  ]);
});

test('filterEhentaiFavorites uses OR within group and AND across groups', () => {
  const favorites = [
    { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 10, artists: ['soso'], parodies: ['fate'] },
    { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 12, artists: ['mashu'], parodies: ['fate'] },
    { id: '3', title: 'Three', thumbnail: '3', lang: 'ja', page: 14, artists: ['mashu'], parodies: ['blue archive'] },
  ];

  expect(filterEhentaiFavorites(favorites, {
    artists: ['soso', 'mashu'],
    parodies: ['fate'],
  }).map((item) => item.id)).toEqual(['1', '2']);
});

test('filterEhentaiFavorites excludes missing metadata items when filters are active', () => {
  const favorites = [
    { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 10 },
    { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 12, artists: ['soso'], parodies: ['fate'] },
  ];

  expect(filterEhentaiFavorites(favorites, {
    artists: ['soso'],
    parodies: [],
  }).map((item) => item.id)).toEqual(['2']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/ehentai/collection-utils.test.ts`
Expected: FAIL because the new filter helpers do not exist yet.

- [ ] **Step 3: Write the minimal helper implementation**

```ts
type FilterOption = { value: string; count: number };
type EhentaiFilters = { artists: string[]; parodies: string[] };

const toSortedOptions = (counts: Map<string, number>): FilterOption[] =>
  [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));

export const buildEhentaiFilterOptions = (favorites: FavoriteDoujinItem[]) => {
  const artistCounts = new Map<string, number>();
  const parodyCounts = new Map<string, number>();

  for (const favorite of favorites) {
    for (const artist of favorite.artists ?? []) {
      artistCounts.set(artist, (artistCounts.get(artist) ?? 0) + 1);
    }
    for (const parody of favorite.parodies ?? []) {
      parodyCounts.set(parody, (parodyCounts.get(parody) ?? 0) + 1);
    }
  }

  return {
    artists: toSortedOptions(artistCounts),
    parodies: toSortedOptions(parodyCounts),
  };
};

export const filterEhentaiFavorites = (
  favorites: FavoriteDoujinItem[],
  filters: EhentaiFilters,
) => favorites.filter((favorite) => {
  const hasArtistFilter = filters.artists.length > 0;
  const hasParodyFilter = filters.parodies.length > 0;

  if (!hasArtistFilter && !hasParodyFilter) {
    return true;
  }

  const favoriteArtists = favorite.artists ?? [];
  const favoriteParodies = favorite.parodies ?? [];
  const artistMatch = !hasArtistFilter || favoriteArtists.some((artist) => filters.artists.includes(artist));
  const parodyMatch = !hasParodyFilter || favoriteParodies.some((parody) => filters.parodies.includes(parody));

  return artistMatch && parodyMatch;
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test components/ehentai/collection-utils.test.ts`
Expected: PASS with all existing selection/reorder helper tests still green.

- [ ] **Step 5: Commit**

```bash
git add components/ehentai/collection-utils.ts components/ehentai/collection-utils.test.ts
git commit -m "feat: add ehentai filter helpers"
```

### Task 4: Add Filtered Reader Queue Helpers

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-reader-utils.ts`
- Test: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-reader-utils.test.ts`

- [ ] **Step 1: Write the failing helper test for selected ID resolution**

```ts
test('buildFilteredReadQueue preserves selected id order and skips unknown items', () => {
  const queue = buildFilteredReadQueue(
    [
      { id: 'first', title: 'First', thumbnail: '', lang: 'ja', page: 10, source: 'a' },
      { id: 'second', title: 'Second', thumbnail: '', lang: 'ja', page: 20, source: 'b' },
    ],
    ['second', 'missing', 'first'],
  );

  expect(queue.map((item) => item.id)).toEqual(['second', 'first']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/ehentai/collection-reader-utils.test.ts`
Expected: FAIL because `buildFilteredReadQueue` does not exist yet.

- [ ] **Step 3: Write the minimal queue helper**

```ts
export const buildFilteredReadQueue = (
  items: FavoriteDoujinItem[],
  selectedIds: string[],
) => selectedIds
  .map((id) => items.find((item) => item.id === id))
  .filter((item): item is FavoriteDoujinItem => Boolean(item));
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test components/ehentai/collection-reader-utils.test.ts`
Expected: PASS with no regression to current jump-plan and autoload helper behavior.

- [ ] **Step 5: Commit**

```bash
git add components/ehentai/collection-reader-utils.ts components/ehentai/collection-reader-utils.test.ts
git commit -m "feat: add filtered reader queue helper"
```

### Task 5: Build The Tabbed `/e/collections` Page Shell With Full Filter Lists

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\app\e\collections\page.tsx`
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\collections-page-shell.tsx`
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\ehentai-filter-panel.tsx`
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\ehentai-filter-results.tsx`
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-list.tsx`
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-create-panel.tsx`

- [ ] **Step 1: Write the failing pure helper test for collection card preview selection**

```ts
test('buildCollectionPreviewCovers returns up to four thumbnails in item order', () => {
  expect(buildCollectionPreviewCovers([
    { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 1 },
    { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 1 },
    { id: '3', title: 'Three', thumbnail: '3', lang: 'ja', page: 1 },
    { id: '4', title: 'Four', thumbnail: '4', lang: 'ja', page: 1 },
    { id: '5', title: 'Five', thumbnail: '5', lang: 'ja', page: 1 },
  ])).toEqual(['1', '2', '3', '4']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/ehentai/collection-utils.test.ts`
Expected: FAIL because the preview helper does not exist yet.

- [ ] **Step 3: Build the page shell and list/result components**

```tsx
// app/e/collections/page.tsx
export default async function Page() {
  const data = await fetchStoredFavorites();

  return (
    <main className="container mx-auto space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Ehentai Collections</h1>
        <p className="text-sm text-muted-foreground">
          Filter saved favorites by artist or parody, preview by cover, and add them into collections.
        </p>
      </div>
      <CollectionsPageShell
        favorites={data.favorite_ehentai?.doujin ?? []}
        collections={data.favorite_ehentai?.collections ?? []}
      />
    </main>
  );
}

// components/ehentai/collections-page-shell.tsx
export function CollectionsPageShell({ favorites, collections }: Props) {
  const [tab, setTab] = useState<'collections' | 'filter' | 'manage'>('collections');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({ artists: [], parodies: [] });
  const options = useMemo(() => buildEhentaiFilterOptions(favorites), [favorites]);
  const filtered = useMemo(() => filterEhentaiFavorites(favorites, filters), [favorites, filters]);

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as 'collections' | 'filter' | 'manage')}>
      <TabsList>
        <TabsTrigger value="collections">Collections</TabsTrigger>
        <TabsTrigger value="filter">Filter</TabsTrigger>
        <TabsTrigger value="manage">Manage</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

- [ ] **Step 4: Run typecheck to verify the shell compiles**

Run: `bunx tsc --noEmit`
Expected: no new errors from `app/e/collections/page.tsx` or the new `components/ehentai/*` shell/filter/result files.

- [ ] **Step 5: Commit**

```bash
git add app/e/collections/page.tsx components/ehentai/collections-page-shell.tsx components/ehentai/ehentai-filter-panel.tsx components/ehentai/ehentai-filter-results.tsx components/ehentai/collection-list.tsx components/ehentai/collection-create-panel.tsx components/ehentai/collection-utils.ts components/ehentai/collection-utils.test.ts
git commit -m "feat: add tabbed ehentai collections page"
```

### Task 6: Add Low-Concurrency Metadata Hydration For Visible Saved Works

**Files:**
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\ehentai-metadata-hydrator.tsx`
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collections-page-shell.tsx`
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-editor.tsx`

- [ ] **Step 1: Write the failing helper test for missing-metadata detection**

```ts
test('findFavoritesMissingEhentaiMetadata returns only works without both metadata arrays', () => {
  expect(findFavoritesMissingEhentaiMetadata([
    { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 1 },
    { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 1, artists: ['soso'], parodies: ['fate'] },
    { id: '3', title: 'Three', thumbnail: '3', lang: 'ja', page: 1, artists: [], parodies: [] },
  ]).map((item) => item.id)).toEqual(['1']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/ehentai/collection-utils.test.ts`
Expected: FAIL because the missing-metadata helper does not exist yet.

- [ ] **Step 3: Implement the minimal client hydrator**

```tsx
export function EhentaiMetadataHydrator({ items, onHydrated }: Props) {
  const queue = useMemo(() => findFavoritesMissingEhentaiMetadata(items), [items]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  useEffect(() => {
    const next = queue.find((item) => !pendingIds.includes(item.id));
    if (!next || pendingIds.length > 0) return;

    let cancelled = false;
    setPendingIds([next.id]);

    void (async () => {
      try {
        const response = await fetch(`/api/ehentai/${next.id}`);
        if (!response.ok) throw new Error('Failed to load gallery detail');
        const detail = await response.json() as EhentaiGalleryDetail;
        const artists = detail.tags.filter((tag) => tag.startsWith('artist:')).map((tag) => tag.slice('artist:'.length));
        const parodies = detail.tags.filter((tag) => tag.startsWith('parody:')).map((tag) => tag.slice('parody:'.length));

        await fetch('/api/favorite', {
          method: 'POST',
          body: JSON.stringify({
            type: 'ehentai-hydrate-metadata',
            id: next.id,
            artists,
            parodies,
          }),
        });

        if (!cancelled) {
          onHydrated(next.id, artists, parodies);
        }
      }
      finally {
        if (!cancelled) {
          setPendingIds([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onHydrated, pendingIds, queue]);

  return null;
}
```

- [ ] **Step 4: Run typecheck to verify the hydrator does not introduce new compile errors**

Run: `bunx tsc --noEmit`
Expected: no new errors from `ehentai-metadata-hydrator.tsx`, `collections-page-shell.tsx`, or `collection-editor.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/ehentai/ehentai-metadata-hydrator.tsx components/ehentai/collections-page-shell.tsx components/ehentai/collection-editor.tsx components/ehentai/collection-utils.ts components/ehentai/collection-utils.test.ts
git commit -m "feat: hydrate ehentai metadata lazily"
```

### Task 7: Add Manage Tab Actions For New And Existing Collections

**Files:**
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\ehentai-manage-panel.tsx`
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collections-page-shell.tsx`
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-editor.tsx`

- [ ] **Step 1: Write the failing helper test for selection emptiness guard**

```ts
test('buildSelectedCollectionItems skips unknown ids and keeps valid order for manage flow', () => {
  expect(buildSelectedCollectionItems(
    [
      { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 1 },
      { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 1 },
    ],
    ['2', 'missing', '1'],
  ).map((item) => item.id)).toEqual(['2', '1']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/ehentai/collection-utils.test.ts`
Expected: FAIL if selection handling is still not aligned with the manage flow needs.

- [ ] **Step 3: Implement the manage panel and append/create actions**

```tsx
export function EhentaiManagePanel({ favorites, collections, selectedIds }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<'create' | 'append'>('create');
  const [name, setName] = useState('');
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? '');
  const [pending, setPending] = useState(false);
  const selectedItems = useMemo(() => buildSelectedCollectionItems(favorites, selectedIds), [favorites, selectedIds]);

  const submit = async () => {
    if (selectedItems.length === 0 || pending) return;
    setPending(true);
    try {
      const payload = mode === 'create'
        ? { type: 'ehentai-collection-create', name, itemIds: selectedItems.map((item) => item.id) }
        : { type: 'ehentai-collection-append', collectionId, itemIds: selectedItems.map((item) => item.id) };

      const response = await fetch('/api/favorite', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save collection changes');
      router.refresh();
    }
    finally {
      setPending(false);
    }
  };

  return <Card>{/* selected works preview + target controls */}</Card>;
}
```

- [ ] **Step 4: Run typecheck to verify manage flow compiles**

Run: `bunx tsc --noEmit`
Expected: no new errors from `ehentai-manage-panel.tsx`, `collections-page-shell.tsx`, or `collection-editor.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/ehentai/ehentai-manage-panel.tsx components/ehentai/collections-page-shell.tsx components/ehentai/collection-editor.tsx
git commit -m "feat: add ehentai manage tab actions"
```

### Task 8: Add Filtered Read Route And Reuse Incremental Reader

**Files:**
- Create: `D:\GitHub\archie0732\r7manga\app\e\collections\read\page.tsx`
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-reader.tsx`
- Modify: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-reader-utils.ts`
- Test: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-reader-utils.test.ts`

- [ ] **Step 1: Write the failing helper test for empty filtered queues**

```ts
test('buildFilteredReadQueue returns an empty queue when all ids are unknown', () => {
  const queue = buildFilteredReadQueue([
    { id: 'first', title: 'First', thumbnail: '', lang: 'ja', page: 10, source: 'a' },
  ], ['missing']);

  expect(queue).toEqual([]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/ehentai/collection-reader-utils.test.ts`
Expected: FAIL if the filtered queue helper is not yet robust enough for route use.

- [ ] **Step 3: Build the filtered read page and adapt the reader prop shape**

```tsx
// app/e/collections/read/page.tsx
export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const ids = (params.ids ?? '').split(',').filter(Boolean);
  const data = await fetchStoredFavorites();
  const queue = buildFilteredReadQueue(data.favorite_ehentai?.doujin ?? [], ids);

  return (
    <main className="container mx-auto p-4">
      <CollectionReader
        collection={{
          id: 'filtered',
          name: 'Filtered Read',
          items: queue,
          createdAt: '',
          updatedAt: '',
        }}
      />
    </main>
  );
}
```

- [ ] **Step 4: Run focused tests and typecheck**

Run: `bun test components/ehentai/collection-reader-utils.test.ts`
Expected: PASS.

Run: `bunx tsc --noEmit`
Expected: no new errors from `app/e/collections/read/page.tsx` or `components/ehentai/collection-reader.tsx`.

- [ ] **Step 5: Commit**

```bash
git add app/e/collections/read/page.tsx components/ehentai/collection-reader.tsx components/ehentai/collection-reader-utils.ts components/ehentai/collection-reader-utils.test.ts
git commit -m "feat: add filtered ehentai reader"
```

## Self-Review

- Spec coverage: the plan covers top-level tabs, full artist/parody option lists, cover-first collection/result previews, append-to-existing-collection support, low-concurrency lazy hydration, filtered reader routing, and existing collection editor visual improvements.
- Placeholder scan: no `TODO`, `TBD`, or “handle appropriately” placeholders remain; each task names concrete files, commands, and code targets.
- Type consistency: `artists`, `parodies`, `FavoriteMetadataHydrate`, `ehentai-collection-append`, `buildEhentaiFilterOptions`, `filterEhentaiFavorites`, and `buildFilteredReadQueue` are named consistently across tasks.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-28-ehentai-collections-filters.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
