# Hentaipaw Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone `hentaipaw` browsing flow with list, detail, search filters, and read page under `/p`.

**Architecture:** Create a dedicated `app/api/hentaipaw` parser/client layer based on the existing `.api_test/hentaipaw.ts` scraping logic, then reuse the existing card/list UI for `/p`. Keep the first version narrow: search/list/detail/read only, without global app search integration or favorites.

**Tech Stack:** Next.js App Router, TypeScript, Bun test, Cheerio, existing shared React components.

---

### Task 1: Parser and route contracts

**Files:**
- Create: `app/api/hentaipaw/_model/client.ts`
- Create: `app/api/hentaipaw/_model/client.test.ts`
- Create: `app/api/hentaipaw/search/route.ts`
- Create: `app/api/hentaipaw/[doujin]/route.ts`

- [ ] Write failing parser tests for listing, detail, and query mapping.
- [ ] Run the focused Bun test command and verify the tests fail for missing module behavior.
- [ ] Implement the minimal parser/client and route payload shaping needed to satisfy the tests.
- [ ] Re-run the focused tests and confirm they pass.

### Task 2: Shared UI compatibility

**Files:**
- Modify: `components/doujin-carousel.tsx`
- Modify: `components/card/doujin-card.tsx`
- Modify: `components/taged_button.tsx`
- Modify: `next.config.ts`

- [ ] Write a failing component/unit test only where behavior changes are easiest to lock down.
- [ ] Update shared types so the card carousel accepts `hentaipaw` search results.
- [ ] Add `hentaipaw`-compatible detail tag links and image host allow-list entries.
- [ ] Re-run the targeted tests.

### Task 3: `/p` pages

**Files:**
- Create: `app/p/page.tsx`
- Create: `app/p/[doujin]/page.tsx`
- Create: `app/p/read/[doujin]/page.tsx`

- [ ] Build the standalone list page with recent/popular sort and filter query support.
- [ ] Build the detail page with cover, metadata tags, preview thumbnails, and read CTA.
- [ ] Build the scroll reader page that renders all page images.
- [ ] Run verification for the page-level flow with tests/build.

### Task 4: Final verification

**Files:**
- Modify: `README.md` if a status line needs to be updated after implementation.

- [ ] Run focused Bun tests for the new parser/client.
- [ ] Run a broader verification command (`bun run build` or equivalent) and inspect the full output.
- [ ] Report actual status, including any residual gaps left intentionally for phase 2.
