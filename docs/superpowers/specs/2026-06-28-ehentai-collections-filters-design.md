# E-Hentai Collections Filters And Manage Design

## Goal

Upgrade the dedicated `Ehentai Collections` workflow so a user can:

- browse existing collections without scrolling through an oversized mixed page
- filter saved e-hentai favorites by `artist` and `parody`
- see every available `artist` and `parody` option from the current saved favorite set
- stack `artist` and `parody` filters together
- preview works by cover before adding them anywhere
- add selected works into a new collection or an existing collection
- continuously read the filtered result set with the same incremental multi-gallery experience used by collection reader
- avoid bursty metadata backfill requests that could trigger e-hentai rate limits or bans

This design extends the current collection feature. It does not replace the dedicated collection routes already in place.

## Scope

Included in this design:

- reorganize `/e/collections` into focused tabs
- add full-list `artist` and `parody` filter UI
- extend saved e-hentai favorite metadata with `artists` and `parodies`
- backfill missing metadata lazily and persist it into `favorite.json`
- add cover-first result grids for filter and collection management
- allow selected works to be appended into an existing collection
- improve collection cards and editor rows so each work is visually identifiable
- add a filtered continuous reader route or route mode that reads a computed result set
- enforce low-concurrency metadata hydration

Not included in this design:

- cross-site filtering or mixed-site collections
- drag-and-drop sorting
- server-side bulk metadata migration over the entire saved favorite corpus on page load
- automatic background crawling of all missing metadata

## User Experience

### Main collections page

The `/e/collections` page becomes the primary surface for three distinct jobs and uses top-level tabs:

1. `Collections`
Shows existing collections as cards with visual previews, item counts, and quick actions.

2. `Filter`
Shows all available `artist` and `parody` options derived from saved e-hentai favorites, lets the user multi-select them, and previews matching works as cover cards.

3. `Manage`
Lets the user take the current selection and add it into either a new collection or an existing collection.

This removes the current long-scroll problem where creation, browsing, and editing are all stacked on one page.

### Collections tab

Each collection card should show:

- collection name
- work count
- up to 4 cover thumbnails from included works
- quick actions for `Manage` and `Read`

This solves the current problem where text-only cards are hard to distinguish once many collections exist.

### Filter tab

The filter tab should show two filter panels:

- `Artists`
- `Parodies`

Each panel lists every distinct option found inside saved e-hentai favorites, with a result count:

- `soso (12)`
- `fate grand order (27)`

Behavior:

- same-group multi-select uses OR
- cross-group stacking uses AND
- selected filters appear in a compact active-filter bar
- the result area updates to a cover grid

Each result card should show:

- cover
- title
- language and page count
- top `artist` chips
- top `parody` chips
- selection checkbox

The result grid also offers:

- `Select all filtered`
- `Clear selection`
- `Read filtered`
- `Send to Manage`

### Manage tab

The manage tab is split into two blocks:

1. `Selected Works`
Shows the current selected set as cover cards with title and metadata summary.

2. `Collection Target`
Lets the user choose between:
- `Create new collection`
- `Add to existing collection`

For existing collections, the user chooses one collection from a compact list or select input and clicks `Add selected`.

This explicitly fixes the current gap where works cannot be added into an old collection from the new flow.

### Collection editor page

The collection editor page keeps rename, reorder, remove, and delete actions, but each row should include:

- cover thumbnail
- title
- artist summary
- parody summary
- move controls

This makes large collections editable without losing visual recognition.

### Reader behavior

Continuous reading should be available for:

- a persisted collection
- a temporary filtered result set

Behavior matches the current collection reader pattern:

- load one gallery at a time
- fetch image batches incrementally
- continue into the next gallery in the same scroll flow
- keep the floating navigator for jumping between works

The filtered reader does not need to persist a new collection automatically. It can read a computed list.

## Data Model

Extend `FavoriteDoujinItem` for e-hentai saved works:

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
```

Interpretation:

- `artists` and `parodies` are optional for backward compatibility
- a saved work is considered metadata-complete for filtering when both arrays exist, even if one is empty

Saved collections continue storing full item summaries instead of only IDs. That means collection items should also carry the same optional metadata fields once available.

## Metadata Hydration Strategy

This is a hard constraint:

- do not bulk-refetch the entire e-hentai favorite library on page load
- do not fan out large parallel requests

Recommended strategy:

1. Load saved favorites from `favorite.json`
2. Compute filter options from already-known `artists` and `parodies`
3. Identify missing-metadata items only when they are needed for:
   - current visible filter result cards
   - current selected works
   - current collection editor preview
   - current continuous reading session
4. Hydrate metadata lazily through the existing e-hentai detail route
5. Persist hydrated metadata back through `/api/favorite`

Concurrency rules:

- only 1 request in flight for metadata hydration by default
- optionally allow 2 when the implementation naturally batches visible cards, but never more than 2
- no wide `Promise.all` over large favorite lists
- re-use hydrated data immediately in memory before persistence completes

This keeps the feature safe against accidental rate spikes and makes the saved dataset improve gradually with normal usage.

## Routing

Keep the existing routes:

- `/e/collections`
- `/e/collections/[collection]`
- `/e/collections/[collection]/read`

Add one filtered-reader entry point using query state:

- `/e/collections/read?ids=<id,id,...>`

Alternative acceptable shape:

- `/e/collections?tab=filter&read=<id,id,...>`

Recommendation:

Use `/e/collections/read?ids=...` because it keeps collection reading and filtered reading symmetrical and avoids overloading the management page route.

## API Design

Reuse `/api/favorite` and extend the mutation vocabulary.

### Existing item persistence

When saving an e-hentai favorite, include `artists` and `parodies` if they are known at the time of save.

### New metadata update mutation

Add an explicit mutation for enriching an existing saved e-hentai work:

```ts
type FavoriteMetadataHydrate = {
  type: 'ehentai-hydrate-metadata';
  id: string;
  artists: string[];
  parodies: string[];
};
```

Behavior:

- update the matching favorite item in `favorite_ehentai.doujin`
- update any collection item snapshots with the same `id`
- no-op if the arrays already match

### Existing collection mutation extension

Keep the current collection mutations and add one more:

```ts
type FavoriteCollectionMutation =
  | { type: 'ehentai-collection-create'; name: string; itemIds: string[] }
  | { type: 'ehentai-collection-append'; collectionId: string; itemIds: string[] }
  | { type: 'ehentai-collection-rename'; collectionId: string; name: string }
  | { type: 'ehentai-collection-reorder'; collectionId: string; itemIds: string[] }
  | { type: 'ehentai-collection-remove-item'; collectionId: string; itemId: string }
  | { type: 'ehentai-collection-delete'; collectionId: string };
```

`ehentai-collection-append` must:

- resolve selected favorite IDs into saved summaries
- skip duplicates already present in the target collection
- append new items in the order selected by the user
- update `updatedAt`

## Filtering Logic

Source of truth:

- filter against `favorite_ehentai.doujin`
- never hit remote e-hentai search for filter results

Semantics:

- if no artists are selected, artist filter is open
- if no parodies are selected, parody filter is open
- item passes when:
  - item artist intersects selected artists, if any are selected
  - and item parody intersects selected parodies, if any are selected

Items with missing metadata:

- they may appear in the unfiltered list
- once a filter is active, unknown metadata items should not be falsely matched
- show a lightweight note if some saved works are still being hydrated and therefore may be temporarily absent from filtered results

## Component Design

### New page shell

Add a dedicated page-level tab container component for `/e/collections` so page concerns stay isolated from collection-editor and reader components.

### Filter controls

Build focused filter components:

- `EhentaiFilterPanel`
- `EhentaiFilterOptionList`
- `EhentaiActiveFilters`

Requirements:

- display all options
- show counts
- support internal search box for long lists
- support collapse or scroll container so the page height remains manageable

The user specifically wants complete option visibility, so the UI should default to listing all options rather than hiding them behind typeahead-only search.

### Result grid

Create a reusable cover-grid component for e-hentai saved works. It should support:

- preview card
- selected state
- compact metadata
- optional action footer

### Manage controls

Build one focused management component that receives the current selected IDs and the current collection list. It should handle both creation and append flows.

### Collection preview cards

Upgrade existing collection list and collection editor surfaces to re-use the same image-first presentation patterns.

## Data Flow

### Filter page load

1. Fetch saved favorite data
2. Normalize shape
3. Derive distinct `artist` and `parody` option sets from known metadata
4. Render all options and the current result grid
5. Start low-concurrency hydration for visible missing-metadata items only if needed

### Hydrate one saved work

1. Detect missing `artists/parodies`
2. Fetch existing gallery detail route for that work
3. Extract `artist:` and `parody:` tags
4. POST `ehentai-hydrate-metadata` mutation
5. Update in-memory state immediately

### Append to an existing collection

1. User selects one or more works
2. User opens `Manage`
3. User chooses an existing collection
4. Client posts `ehentai-collection-append`
5. Store resolves IDs into favorite summaries
6. Store skips duplicates and appends the rest
7. UI refreshes target collection summary

### Read filtered result set

1. User selects filtered works or uses all current filtered results
2. Client navigates to filtered read route with ordered IDs
3. Server resolves IDs into saved favorite summaries
4. Reader runs the existing incremental gallery flow

## Error Handling

Handle these cases explicitly:

- no e-hentai favorites saved
- no filter results for current selection
- selected IDs empty when attempting to create or append
- append target collection not found
- all selected works are already present in the target collection
- metadata hydration for one work fails
- filtered read request contains unknown IDs

Hydration failure behavior:

- show an inline warning on the affected card or in the filter status area
- do not retry aggressively in a loop
- allow the user to continue browsing and reading other works

## Testing Strategy

### Store tests

Add tests for:

- `ensureFavoriteShape` preserves new metadata fields
- metadata hydration mutation updates favorites and collection snapshots
- append-to-collection adds only new items and preserves append order

### Filter helper tests

Add pure helper tests for:

- building distinct sorted artist options
- building distinct sorted parody options
- counting items per option
- applying OR-within-group and AND-across-groups logic
- excluding unknown metadata from active filtered matches

### Reader helper tests

Add focused tests for:

- filtered reader queue preserves selected ID order
- collection reader navigator still computes correct jump targets after this extension

### Manual verification

Verify:

- collections tab no longer requires scrolling through unrelated creation UI
- filter tab shows all artist and parody options from known saved metadata
- result cards are visually identifiable by cover
- manage tab can append selected works into an existing collection
- collection cards and editor rows show thumbnails
- metadata hydration stays low-volume during use
- reader still loads incrementally and does not preload entire galleries

## Risks And Tradeoffs

### Partial metadata at first load

Because backfill is intentionally lazy, the full filter option set may grow over time as more saved works are hydrated. This is a deliberate tradeoff to avoid rate spikes.

### Data duplication

Collections still duplicate saved item summaries. This remains acceptable because it keeps list and reader rendering fast and stable.

### Query-string size for filtered reading

Passing many selected IDs in a query string has a practical size ceiling. The preferred flow for very large filtered sets is:

- `Read all filtered` only when the filtered set stays within a safe query size
- otherwise create or append to a collection and read from the persisted collection route

## Recommendation

Implement the next version with:

- top-level `Collections`, `Filter`, and `Manage` tabs on `/e/collections`
- full-list `artist` and `parody` filter panels with counts
- low-concurrency lazy metadata hydration
- explicit append-to-existing-collection mutation
- cover-first previews across collection list, manage flow, and editor
- filtered continuous reading through a dedicated read route

This gives the user a scalable e-hentai organization workflow without sacrificing the existing incremental reader or risking ban-worthy request spikes.
