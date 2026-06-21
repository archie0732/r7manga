# E-Hentai Collections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build persistent named e-hentai collections with ordering controls and a continuous multi-gallery reader, exposed from a dedicated sidebar page.

**Architecture:** Extend the existing `favorite.json` schema so e-hentai keeps both plain favorites and collection records, then add focused helper functions in the favorite store to mutate collection state through the existing `/api/favorite` route. Build a dedicated `/e/collections` route group for overview, editing, and reading, reusing the current e-hentai gallery and image batch endpoints to keep reader logic incremental and low-risk.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Bun tests, existing `/api/favorite` GitHub-backed persistence, existing e-hentai scraping client and image batch route.

---

## File Structure

- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\apitype.ts`
  - Add e-hentai collection types and request payload types.
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\store.ts`
  - Add shape normalization and collection mutation helpers.
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\store.test.ts`
  - Add regression tests for collection creation, renaming, reordering, deletion.
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\route.ts`
  - Accept collection mutation payloads and persist them through the existing sync flow.
- Modify: `D:\GitHub\archie0732\r7manga\components\app\app-sidebar.tsx`
  - Add the new `Ehentai Collections` sidebar entry.
- Create: `D:\GitHub\archie0732\r7manga\app\e\collections\page.tsx`
  - Collections overview page.
- Create: `D:\GitHub\archie0732\r7manga\app\e\collections\[collection]\page.tsx`
  - Collection editor page.
- Create: `D:\GitHub\archie0732\r7manga\app\e\collections\[collection]\read\page.tsx`
  - Continuous collection reader page shell.
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-create-panel.tsx`
  - Select favorites and create a named collection.
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-list.tsx`
  - List existing collections with navigation actions.
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-editor.tsx`
  - Rename, reorder, remove items, delete collection.
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-reader.tsx`
  - Load galleries in order and append 5-image batches into one long read flow.

### Task 1: Extend Favorite Data Model For E-Hentai Collections

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\apitype.ts`
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\store.ts`
- Test: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\store.test.ts`

- [ ] **Step 1: Write the failing tests for collection shape and mutations**

```ts
test('ensureFavoriteShape adds empty ehentai collections bucket', () => {
  const data = ensureFavoriteShape(null);

  expect(data.favorite_ehentai?.doujin).toEqual([]);
  expect(data.favorite_ehentai?.collections).toEqual([]);
});

test('createEhentaiCollection stores a named collection in favorite data', () => {
  const base = addFavoriteEntry(undefined, {
    type: 'doujin',
    website: 'ehentai',
    doujin: {
      id: '111-token',
      title: 'Gallery One',
      thumbnail: 'https://img.example/1.jpg',
      lang: 'ja',
      page: 10,
      source: 'https://e-hentai.org/g/111/token/',
    },
  });

  const withSecond = addFavoriteEntry(base, {
    type: 'doujin',
    website: 'ehentai',
    doujin: {
      id: '222-token',
      title: 'Gallery Two',
      thumbnail: 'https://img.example/2.jpg',
      lang: 'ja',
      page: 12,
      source: 'https://e-hentai.org/g/222/token/',
    },
  });

  const next = mutateFavoriteCollections(withSecond, {
    type: 'ehentai-collection-create',
    name: 'Weekend Set',
    itemIds: ['111-token', '222-token'],
  });

  expect(next.favorite_ehentai?.collections).toHaveLength(1);
  expect(next.favorite_ehentai?.collections[0]).toMatchObject({
    name: 'Weekend Set',
  });
  expect(next.favorite_ehentai?.collections[0]?.items.map((item) => item.id)).toEqual(['111-token', '222-token']);
});

test('mutateFavoriteCollections renames and reorders an ehentai collection', () => {
  const seeded = {
    name: '',
    id: '',
    favorite_nhentai: { doujin: [], artist: [], character: [] },
    favorite_wnacg: { doujin: [] },
    favorite_hentaipaw: { doujin: [] },
    favorite_ehentai: {
      doujin: [
        { id: '111-token', title: 'Gallery One', thumbnail: '1', lang: 'ja', page: 10, source: 'a' },
        { id: '222-token', title: 'Gallery Two', thumbnail: '2', lang: 'ja', page: 12, source: 'b' },
      ],
      collections: [{
        id: 'col-1',
        name: 'Old Name',
        createdAt: '2026-06-21T00:00:00.000Z',
        updatedAt: '2026-06-21T00:00:00.000Z',
        items: [
          { id: '111-token', title: 'Gallery One', thumbnail: '1', lang: 'ja', page: 10, source: 'a' },
          { id: '222-token', title: 'Gallery Two', thumbnail: '2', lang: 'ja', page: 12, source: 'b' },
        ],
      }],
    },
  };

  const renamed = mutateFavoriteCollections(seeded, {
    type: 'ehentai-collection-rename',
    collectionId: 'col-1',
    name: 'New Name',
  });
  const reordered = mutateFavoriteCollections(renamed, {
    type: 'ehentai-collection-reorder',
    collectionId: 'col-1',
    itemIds: ['222-token', '111-token'],
  });

  expect(reordered.favorite_ehentai?.collections?.[0]?.name).toBe('New Name');
  expect(reordered.favorite_ehentai?.collections?.[0]?.items.map((item) => item.id)).toEqual(['222-token', '111-token']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/favorite/_model/store.test.ts`

Expected: FAIL because `collections` and `mutateFavoriteCollections` do not exist yet.

- [ ] **Step 3: Write the minimal type and store implementation**

```ts
export interface EhentaiCollection {
  id: string;
  name: string;
  items: FavoriteDoujinItem[];
  createdAt: string;
  updatedAt: string;
}

export type FavoriteCollectionMutation =
  | { type: 'ehentai-collection-create'; name: string; itemIds: string[] }
  | { type: 'ehentai-collection-rename'; collectionId: string; name: string }
  | { type: 'ehentai-collection-reorder'; collectionId: string; itemIds: string[] }
  | { type: 'ehentai-collection-remove-item'; collectionId: string; itemId: string }
  | { type: 'ehentai-collection-delete'; collectionId: string };

const ensureEhentaiBucket = (input: FavoriteData['favorite_ehentai']) => ({
  doujin: input?.doujin ?? [],
  collections: input?.collections ?? [],
});

export const mutateFavoriteCollections = (
  input: FavoriteData | null | undefined,
  mutation: FavoriteCollectionMutation,
) => {
  const data = ensureFavoriteShape(input);
  const bucket = ensureEhentaiBucket(data.favorite_ehentai);
  data.favorite_ehentai = bucket;

  if (mutation.type === 'ehentai-collection-create') {
    const name = mutation.name.trim();
    if (!name || mutation.itemIds.length === 0) throw new Error('Invalid collection create');

    const items = mutation.itemIds.map((id) => {
      const found = bucket.doujin.find((item) => item.id === id);
      if (!found) throw new Error(`Missing favorite item: ${id}`);
      return found;
    });

    bucket.collections.push({
      id: crypto.randomUUID(),
      name,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return data;
  }

  const collection = bucket.collections.find((item) => item.id === mutation.collectionId);
  if (!collection) throw new Error('Collection not found');

  if (mutation.type === 'ehentai-collection-rename') {
    const name = mutation.name.trim();
    if (!name) throw new Error('Invalid collection name');
    collection.name = name;
    collection.updatedAt = new Date().toISOString();
    return data;
  }

  if (mutation.type === 'ehentai-collection-reorder') {
    collection.items = mutation.itemIds.map((id) => {
      const found = collection.items.find((item) => item.id === id);
      if (!found) throw new Error(`Collection item not found: ${id}`);
      return found;
    });
    collection.updatedAt = new Date().toISOString();
    return data;
  }

  if (mutation.type === 'ehentai-collection-remove-item') {
    collection.items = collection.items.filter((item) => item.id !== mutation.itemId);
    collection.updatedAt = new Date().toISOString();
    return data;
  }

  bucket.collections = bucket.collections.filter((item) => item.id !== mutation.collectionId);
  return data;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test app/api/favorite/_model/store.test.ts`

Expected: PASS with new collection tests green and existing favorite tests still green.

- [ ] **Step 5: Commit**

```bash
git add app/api/favorite/_model/apitype.ts app/api/favorite/_model/store.ts app/api/favorite/_model/store.test.ts
git commit -m "feat: add ehentai collection data model"
```

### Task 2: Wire Collection Mutations Through The Favorite API

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\route.ts`
- Modify: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\apitype.ts`
- Test: `D:\GitHub\archie0732\r7manga\app\api\favorite\_model\store.test.ts`

- [ ] **Step 1: Write the failing API-facing test for collection deletion and item removal**

```ts
test('mutateFavoriteCollections removes one item and deletes a collection', () => {
  const seeded = ensureFavoriteShape({
    name: '',
    id: '',
    favorite_nhentai: { doujin: [], artist: [], character: [] },
    favorite_ehentai: {
      doujin: [],
      collections: [{
        id: 'col-1',
        name: 'Set',
        createdAt: '2026-06-21T00:00:00.000Z',
        updatedAt: '2026-06-21T00:00:00.000Z',
        items: [
          { id: 'a', title: 'A', thumbnail: 'a', lang: 'ja', page: 1, source: 'sa' },
          { id: 'b', title: 'B', thumbnail: 'b', lang: 'ja', page: 1, source: 'sb' },
        ],
      }],
    },
  });

  const removedItem = mutateFavoriteCollections(seeded, {
    type: 'ehentai-collection-remove-item',
    collectionId: 'col-1',
    itemId: 'a',
  });
  const deleted = mutateFavoriteCollections(removedItem, {
    type: 'ehentai-collection-delete',
    collectionId: 'col-1',
  });

  expect(removedItem.favorite_ehentai?.collections?.[0]?.items.map((item) => item.id)).toEqual(['b']);
  expect(deleted.favorite_ehentai?.collections).toEqual([]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/favorite/_model/store.test.ts`

Expected: FAIL if remove/delete mutation branches are missing or incomplete.

- [ ] **Step 3: Extend the API route to dispatch collection payloads**

```ts
import type { FavoriteAdd, FavoriteCollectionMutation, FavoriteData, FavoriteRemove, FavoriteWebsite, GitHubFileResponse } from './_model/apitype';
import { addFavoriteEntry, ensureFavoriteShape, isDoujinFavorited, mutateFavoriteCollections, removeFavoriteEntry } from './_model/store';

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json() as FavoriteAdd | FavoriteCollectionMutation;

  const { content: remoteData, sha } = await fetchRemoteFile();
  let nextData: FavoriteData;

  try {
    if (typeof body.type === 'string' && body.type.startsWith('ehentai-collection-')) {
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

Expected: PASS, covering all collection mutations before any UI work starts.

- [ ] **Step 5: Commit**

```bash
git add app/api/favorite/route.ts app/api/favorite/_model/apitype.ts app/api/favorite/_model/store.ts app/api/favorite/_model/store.test.ts
git commit -m "feat: support ehentai collection mutations"
```

### Task 3: Add Sidebar Entry And Collection Management Pages

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\components\app\app-sidebar.tsx`
- Create: `D:\GitHub\archie0732\r7manga\app\e\collections\page.tsx`
- Create: `D:\GitHub\archie0732\r7manga\app\e\collections\[collection]\page.tsx`
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-create-panel.tsx`
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-list.tsx`
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-editor.tsx`

- [ ] **Step 1: Write the failing UI behavior tests as small pure helpers first**

```ts
test('buildSelectedCollectionItems preserves selection order from favorite ids', () => {
  expect(buildSelectedCollectionItems(
    [
      { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 10, source: 'a' },
      { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 20, source: 'b' },
    ],
    ['2', '1'],
  ).map((item) => item.id)).toEqual(['2', '1']);
});

test('moveCollectionItem swaps item order upward and downward', () => {
  const items = [
    { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 10, source: 'a' },
    { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 20, source: 'b' },
    { id: '3', title: 'Three', thumbnail: '3', lang: 'ja', page: 30, source: 'c' },
  ];

  expect(moveCollectionItem(items, 2, 'up').map((item) => item.id)).toEqual(['1', '3', '2']);
  expect(moveCollectionItem(items, 0, 'down').map((item) => item.id)).toEqual(['2', '1', '3']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/favorite/_model/store.test.ts`

Expected: FAIL because helper functions do not exist yet.

- [ ] **Step 3: Add overview/editor components and sidebar route**

```tsx
// components/app/app-sidebar.tsx
{
  title: 'Ehentai Collections',
  url: '/e/collections',
  icon: Globe,
}

// app/e/collections/page.tsx
export default async function Page() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/yanami`, { cache: 'no-store' });
  const data = ensureFavoriteShape(await response.json() as FavoriteData);

  return (
    <main className="container mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold">Ehentai Collections</h1>
      <CollectionCreatePanel favorites={data.favorite_ehentai?.doujin ?? []} collections={data.favorite_ehentai?.collections ?? []} />
      <CollectionList collections={data.favorite_ehentai?.collections ?? []} />
    </main>
  );
}

// app/e/collections/[collection]/page.tsx
export default async function Page({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/yanami`, { cache: 'no-store' });
  const data = ensureFavoriteShape(await response.json() as FavoriteData);
  const found = (data.favorite_ehentai?.collections ?? []).find((item) => item.id === collection);

  if (!found) {
    throw new Error('Collection not found');
  }

  return <CollectionEditor collection={found} />;
}
```

- [ ] **Step 4: Manually verify the route surfaces**

Run: `bunx tsc --noEmit`

Expected: new pages and components type-check aside from any unrelated pre-existing project errors; if unrelated errors exist, confirm no new errors point at `app/e/collections` or `components/ehentai`.

- [ ] **Step 5: Commit**

```bash
git add components/app/app-sidebar.tsx app/e/collections/page.tsx app/e/collections/[collection]/page.tsx components/ehentai/collection-create-panel.tsx components/ehentai/collection-list.tsx components/ehentai/collection-editor.tsx
git commit -m "feat: add ehentai collection management pages"
```

### Task 4: Build Continuous Multi-Gallery Collection Reader

**Files:**
- Create: `D:\GitHub\archie0732\r7manga\app\e\collections\[collection]\read\page.tsx`
- Create: `D:\GitHub\archie0732\r7manga\components\ehentai\collection-reader.tsx`
- Modify: `D:\GitHub\archie0732\r7manga\app\api\ehentai\_model\client.ts`
- Test: `D:\GitHub\archie0732\r7manga\app\api\ehentai\_model\client.test.ts`

- [ ] **Step 1: Write the failing reader-order helper test**

```ts
test('buildCollectionReadQueue preserves collection item order', () => {
  const queue = buildCollectionReadQueue([
    { id: 'b', title: 'Second', thumbnail: '', lang: 'ja', page: 20, source: 'https://e-hentai.org/g/2/b/' },
    { id: 'a', title: 'First', thumbnail: '', lang: 'ja', page: 10, source: 'https://e-hentai.org/g/1/a/' },
  ]);

  expect(queue.map((item) => item.id)).toEqual(['b', 'a']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/ehentai/_model/client.test.ts`

Expected: FAIL because the collection reader queue helper does not exist yet.

- [ ] **Step 3: Implement the reader page and incremental multi-gallery flow**

```tsx
export function CollectionReader({ collection }: { collection: EhentaiCollection }) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryDetails, setGalleryDetails] = useState<Record<string, EhentaiGalleryDetail>>({});
  const [galleryImages, setGalleryImages] = useState<Record<string, string[]>>({});

  const current = collection.items[galleryIndex];

  useEffect(() => {
    if (!current || galleryDetails[current.id]) return;
    void (async () => {
      const response = await fetch(`/api/ehentai/${current.id}`);
      if (!response.ok) throw new Error('Failed to load gallery detail');
      setGalleryDetails((state) => ({ ...state, [current.id]: await response.json() as EhentaiGalleryDetail }));
    })();
  }, [current, galleryDetails]);

  const loadMore = async (itemId: string) => {
    const detail = galleryDetails[itemId];
    const loaded = galleryImages[itemId]?.length ?? 0;
    const response = await fetch(`/api/ehentai/${itemId}/images?start=${loaded.toString()}&count=5`);
    if (!response.ok) throw new Error('Failed to load image batch');
    const payload = await response.json() as { images: string[] };
    setGalleryImages((state) => ({
      ...state,
      [itemId]: [...(state[itemId] ?? []), ...payload.images],
    }));

    const nextLoaded = loaded + payload.images.length;
    if (detail && nextLoaded >= detail.pageLinks.length && galleryIndex < collection.items.length - 1) {
      setGalleryIndex((index) => index + 1);
    }
  };

  return (
    <div className="space-y-10">
      {collection.items.map((item) => (
        <section key={item.id} className="space-y-4">
          <header className="border-b pb-2">
            <h2 className="text-xl font-semibold">{item.title}</h2>
          </header>
          {(galleryImages[item.id] ?? []).map((image, index) => (
            <Image key={`${item.id}-${index.toString()}`} src={image} alt={`${item.title}-${index + 1}`} width={1200} height={1600} className="h-auto w-full max-w-5xl" />
          ))}
          <Button onClick={() => void loadMore(item.id)}>View more</Button>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run focused tests and a manual reader sanity check**

Run: `bun test app/api/ehentai/_model/client.test.ts`

Expected: PASS with helper coverage intact and no regression to e-hentai search/image behavior.

Manual check:
- open `/e/collections/<id>/read`
- confirm first gallery loads
- click `View more` repeatedly
- confirm the next gallery appears after the previous one finishes

- [ ] **Step 5: Commit**

```bash
git add app/e/collections/[collection]/read/page.tsx components/ehentai/collection-reader.tsx app/api/ehentai/_model/client.ts app/api/ehentai/_model/client.test.ts
git commit -m "feat: add ehentai collection reader"
```

## Self-Review

- Spec coverage: this plan covers sidebar entry, named multi-collection storage, collection list page, collection editor page, reorder controls, deletion/removal, dedicated collection reader route, and 5-image batch loading.
- Placeholder scan: no `TODO`, `TBD`, or vague “handle appropriately” language remains; each task names exact files and commands.
- Type consistency: collection types are introduced in Task 1 and reused consistently as `EhentaiCollection` plus `FavoriteCollectionMutation` in later tasks.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-21-ehentai-collections.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
