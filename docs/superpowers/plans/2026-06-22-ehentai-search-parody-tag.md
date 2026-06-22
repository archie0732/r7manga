# E-Hentai Search Parody And Tag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the e-hentai search flow support `parody` filters and full namespaced `tag` filters in addition to the existing `artist` filter.

**Architecture:** Keep the existing `/search?w=e` request shape, then extend the e-hentai API route schema and client query builder so `artist`, `parody`, and full `tag` values are translated into one `f_search` string. Protect the behavior with focused Bun tests around URL generation and paginated search fetches.

**Tech Stack:** Next.js App Router, TypeScript, Zod, Bun tests, existing e-hentai scraping client.

---

## File Structure

- Modify: `D:\GitHub\archie0732\r7manga\app\api\ehentai\_model\client.test.ts`
  - Add failing coverage for full `tag` passthrough and `parody` query generation.
- Modify: `D:\GitHub\archie0732\r7manga\app\api\ehentai\_model\client.ts`
  - Extend search params and build the `f_search` query string with `parody` plus raw namespaced `tag`.
- Modify: `D:\GitHub\archie0732\r7manga\app\api\ehentai\search\route.ts`
  - Accept `parody` in request validation and pass it to the client.

### Task 1: Add Search Query Coverage

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\app\api\ehentai\_model\client.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
test('buildSearchUrl keeps full ehentai tag syntax and adds parody filters', () => {
  expect(buildSearchUrl({
    artist: 'soso',
    parody: 'fate grand order',
    tag: 'female:big breasts',
  })).toBe('https://e-hentai.org/?f_search=artist%3Asoso+parody%3Afate+grand+order+female%3Abig+breasts');
});

test('search follows next cursor for parody searches', async () => {
  const calls: string[] = [];
  const client = new EhentaiClient(async (input) => {
    const url = input.toString();
    calls.push(url);

    if (url === 'https://e-hentai.org/?f_search=parody%3Afate+grand+order') {
      return new Response(searchHtml);
    }

    if (url === 'https://e-hentai.org/?f_search=parody%3Afate+grand+order&next=2811644') {
      return new Response(searchHtmlPageTwo);
    }

    return new Response('not found', { status: 404 });
  });

  await client.search({ parody: 'fate grand order', page: 2 });

  expect(calls).toEqual([
    'https://e-hentai.org/?f_search=parody%3Afate+grand+order',
    'https://e-hentai.org/?f_search=parody%3Afate+grand+order&next=2811644',
  ]);
});
```

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `bun test app/api/ehentai/_model/client.test.ts`

Expected: FAIL because `parody` is not part of `SearchParams` and `tag` is still rewritten as `tag:<value>`.

### Task 2: Implement Minimal Query Support

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\app\api\ehentai\_model\client.ts`
- Modify: `D:\GitHub\archie0732\r7manga\app\api\ehentai\search\route.ts`

- [ ] **Step 1: Extend the client search params and query builder**

```ts
type SearchParams = {
  q?: string | null;
  artist?: string | null;
  parody?: string | null;
  tag?: string | null;
  page?: string | number | null;
  next?: string | null;
};

const buildSearchQuery = ({ q, artist, parody, tag }: SearchParams) => {
  const terms = [
    q?.trim(),
    artist?.trim() ? `artist:${artist.trim()}` : null,
    parody?.trim() ? `parody:${parody.trim()}` : null,
    tag?.trim() || null,
  ].filter((value): value is string => Boolean(value));

  return terms.join(' ').trim() || '*';
};
```

- [ ] **Step 2: Accept `parody` in the route schema**

```ts
const ParameterSchema = z.object({
  q: z.string().nullable(),
  artist: z.string().nullable(),
  parody: z.string().nullable(),
  tag: z.string().nullable(),
  page: z.string().nullable().refine((val) => {
    if (!val) return true;
    return /^\d+$/.test(val);
  }, {
    message: '"page" must be a numeric integer',
  }),
});
```

- [ ] **Step 3: Run the focused tests to verify they pass**

Run: `bun test app/api/ehentai/_model/client.test.ts`

Expected: PASS with the new `parody` and full `tag` behavior covered alongside the existing pagination and gallery parsing tests.

### Task 3: Verify No Type Regressions

**Files:**
- Modify: `D:\GitHub\archie0732\r7manga\app\api\ehentai\_model\client.ts`
- Modify: `D:\GitHub\archie0732\r7manga\app\api\ehentai\search\route.ts`

- [ ] **Step 1: Run project type-check or nearest equivalent**

Run: `bunx tsc --noEmit`

Expected: no new type errors in the modified e-hentai files; if unrelated existing errors appear, confirm none point at the touched search files.

## Self-Review

- Spec coverage: the plan covers `parody` query support, full namespaced `tag` passthrough, route validation, and regression tests.
- Placeholder scan: no `TODO`, `TBD`, or vague steps remain.
- Type consistency: `parody` is added consistently to both route parsing and client `SearchParams`.
