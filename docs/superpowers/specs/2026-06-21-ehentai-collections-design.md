# E-Hentai Collections Design

## Goal

Add a persistent "collection" feature for e-hentai so a user can:

- create multiple named collections
- pick several saved e-hentai favorites into one collection
- reorder works inside a collection
- open one collection and read all included works continuously

The first version must store all collection data inside `favorite.json` and expose the feature from a dedicated sidebar entry, not from the existing Favorites page tab.

## Scope

Included in this design:

- new sidebar entry for `Ehentai Collections`
- collection list page
- create collection flow from saved e-hentai favorites
- rename collection
- reorder works inside a collection
- remove a work from a collection
- delete collection
- continuous reader page for one collection
- persistence through existing `/api/favorite` storage flow

Not included in this first version:

- adding a work to a collection directly from the e-hentai detail page
- drag-and-drop sorting
- per-user private collections beyond the current single shared `favorite.json`
- cross-site mixed collections

## User Experience

### Sidebar entry

Add a new sidebar item labeled `Ehentai Collections`.

Clicking it opens a dedicated page for collection management. This keeps the existing Favorites page simple and gives collections their own workflow surface.

### Collections page

The page has two sections:

1. `Available Favorites`
Shows current e-hentai favorites as selectable cards.

2. `Collections`
Shows saved collections with name, item count, and quick actions.

Main actions on this page:

- select multiple favorites
- enter a collection name
- create a new collection
- open an existing collection
- start reading a collection

### Collection detail page

Each collection gets its own detail page with:

- editable collection name
- ordered list of included works
- move up / move down controls
- remove item control
- `Read Collection` action
- `Delete Collection` action

The first version will use explicit move buttons instead of drag-and-drop to reduce complexity and improve reliability.

### Collection reader page

The reader renders works in collection order.

Behavior:

- load the first work
- show pages in batches of 5, reusing current e-hentai batch-loading behavior
- when one work ends, continue with the next work in the same scroll flow
- visually separate works with a lightweight title divider

The user should not need to jump back to any listing page to continue reading.

## Data Model

Extend `FavoriteData` in `app/api/favorite/_model/apitype.ts`.

Current `favorite_ehentai` bucket:

- `doujin: FavoriteDoujinItem[]`

New structure:

```ts
type EhentaiCollectionItem = FavoriteDoujinItem;

type EhentaiCollection = {
  id: string;
  name: string;
  items: EhentaiCollectionItem[];
  createdAt: string;
  updatedAt: string;
};

type FavoriteData = {
  ...
  favorite_ehentai?: {
    doujin: FavoriteDoujinItem[];
    collections?: EhentaiCollection[];
  };
};
```

### Why store full item summaries instead of only IDs

Store the same summary fields already used by e-hentai favorites:

- `id`
- `title`
- `thumbnail`
- `lang`
- `page`
- `source`

This avoids extra fetches just to render a collection list and keeps a collection readable even if the base favorite list changes later.

## Routing

Add dedicated routes:

- `/e/collections`
- `/e/collections/[collection]`
- `/e/collections/[collection]/read`

Responsibilities:

- `/e/collections`: overview page, create collection, list collections
- `/e/collections/[collection]`: edit name and order
- `/e/collections/[collection]/read`: continuous reader

## API Design

Reuse the existing `/api/favorite` persistence path.

Extend the favorite store helper layer with explicit collection operations instead of overloading plain doujin add/remove behavior.

Recommended new action shapes:

```ts
type FavoriteCollectionCreate = {
  type: 'ehentai-collection-create';
  name: string;
  itemIds: string[];
};

type FavoriteCollectionRename = {
  type: 'ehentai-collection-rename';
  collectionId: string;
  name: string;
};

type FavoriteCollectionReorder = {
  type: 'ehentai-collection-reorder';
  collectionId: string;
  itemIds: string[];
};

type FavoriteCollectionRemoveItem = {
  type: 'ehentai-collection-remove-item';
  collectionId: string;
  itemId: string;
};

type FavoriteCollectionDelete = {
  type: 'ehentai-collection-delete';
  collectionId: string;
};
```

The route can keep a single endpoint while dispatching by `type`.

## Component Design

### Sidebar

Update the existing sidebar configuration to add the new route entry.

### Collections overview page

Add a dedicated page-level component that:

- fetches stored favorites from `/api/yanami`
- reads `favorite_ehentai.doujin`
- reads `favorite_ehentai.collections`
- manages selected favorite IDs for collection creation

### Collection editor

Add a focused editor component that receives one collection and exposes:

- rename submit
- reorder actions
- remove item action

This should be separate from the page shell so the editing logic remains isolated and testable.

### Collection reader

Add a reader component that:

- iterates collection items in order
- fetches gallery detail per item using the existing e-hentai route
- fetches images in 5-page batches
- appends image batches to one long scroll list

The reader should maintain state per collection item:

- current loaded pages
- whether more pages remain
- whether the next gallery has started loading

## Data Flow

### Create collection

1. Load stored e-hentai favorites
2. User selects multiple favorites
3. User enters collection name
4. Client posts collection-create action
5. Store helper resolves selected IDs into saved favorite summaries
6. `favorite.json` is updated
7. Page refreshes or updates local state

### Reorder collection

1. User clicks move up/down
2. Client computes new ordered ID list
3. Client posts collection-reorder action
4. Store helper rewrites `items` in the new order
5. UI updates with the persisted order

### Read collection

1. Reader loads collection metadata
2. Reader starts with the first included gallery
3. Reader fetches gallery detail from existing `/api/ehentai/[gallery]`
4. Reader fetches image batches from existing `/api/ehentai/[gallery]/images`
5. Once current gallery pages are exhausted, reader advances to the next collection item
6. Repeat until the collection ends

## Error Handling

Handle these cases explicitly:

- creating a collection with no selected works
- creating a collection with an empty name
- collection ID not found
- collection contains zero items
- one gallery fails to load during continuous reading

Reader failure behavior:

- if one gallery fails, show an inline error block for that gallery
- allow the user to continue to the next gallery
- do not crash the full collection read session

## Testing Strategy

### Store tests

Add regression tests for:

- default shape includes `favorite_ehentai.collections`
- create multiple collections
- reject empty collection names
- preserve item order on create
- rename collection
- reorder collection items
- remove one item from a collection
- delete one collection without touching others

### Route and page tests

Add targeted tests for:

- collection route rejects invalid payloads
- reader loads galleries in collection order
- reader continues after one gallery finishes

### Residual manual verification

Manual checks should confirm:

- sidebar entry appears
- collection list persists after reload
- rename persists
- move up/down persists
- reader concatenates multiple galleries correctly

## Risks And Tradeoffs

### Data duplication

Collections duplicate e-hentai favorite summaries. This is acceptable in the first version because it simplifies rendering and persistence logic.

### Shared storage

All collection state stays in one shared `favorite.json`. This matches the current architecture, but it means collections are not user-scoped.

### Reader performance

Continuous reading across multiple galleries can become large. Batch loading 5 images at a time keeps the first version within reasonable limits.

## Recommendation

Implement the first version with:

- dedicated sidebar entry
- `favorite.json`-backed collection storage
- button-based ordering
- dedicated collection routes
- 5-image incremental loading in the continuous reader

This is the lowest-risk path that satisfies the requested workflow and leaves a clean extension point for future "add current work to collection" actions from the e-hentai detail page.
