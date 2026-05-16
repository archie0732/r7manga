#!/usr/bin/env node

import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseArgs = (argv) => {
  const options = {
    file: 'favorite.json',
    root: process.env.NHENTAI ?? 'https://nhentai.net',
    delayMs: 4200,
    dryRun: false,
    max: null,
    start: 0,
    maxRetries: 3,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    const next = argv[i + 1];
    if (!next) {
      throw new Error(`Missing value for ${arg}`);
    }

    switch (arg) {
      case '--file':
        options.file = next;
        i += 1;
        break;
      case '--root':
        options.root = next;
        i += 1;
        break;
      case '--delay-ms':
        options.delayMs = Number(next);
        i += 1;
        break;
      case '--max':
        options.max = Number(next);
        i += 1;
        break;
      case '--start':
        options.start = Number(next);
        i += 1;
        break;
      case '--max-retries':
        options.maxRetries = Number(next);
        i += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isFinite(options.delayMs) || options.delayMs < 0) {
    throw new Error('--delay-ms must be a non-negative number');
  }

  if (options.max !== null && (!Number.isFinite(options.max) || options.max <= 0)) {
    throw new Error('--max must be a positive number');
  }

  if (!Number.isInteger(options.start) || options.start < 0) {
    throw new Error('--start must be a non-negative integer');
  }

  if (!Number.isInteger(options.maxRetries) || options.maxRetries < 0) {
    throw new Error('--max-retries must be a non-negative integer');
  }

  return options;
};

const buildAuthHeader = () => {
  const apiKey = process.env.R7MANGA_ANNO ?? process.env.NHENTAI_API_KEY;
  const userToken = process.env.NHENTAI_USER_TOKEN;

  if (apiKey) {
    return `Key ${apiKey}`;
  }

  if (userToken) {
    return `User ${userToken}`;
  }

  throw new Error('Missing auth. Set R7MANGA_ANNO or NHENTAI_API_KEY, or NHENTAI_USER_TOKEN.');
};

const normalizeIds = (records) => {
  const ids = [];
  const seen = new Set();

  for (const item of records) {
    const rawId = item?.id;
    const id = typeof rawId === 'number' ? rawId.toString() : String(rawId ?? '').trim();

    if (!/^\d+$/.test(id)) {
      continue;
    }

    if (seen.has(id)) {
      continue;
    }

    seen.add(id);
    ids.push(id);
  }

  return ids;
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const absoluteFile = path.resolve(process.cwd(), options.file);
  const apiRoot = `${options.root.replace(/\/+$/, '')}/api/v2`;

  const raw = await fs.readFile(absoluteFile, 'utf8');
  const parsed = JSON.parse(raw);
  const records = parsed?.favorite_nhentai?.doujin;

  if (!Array.isArray(records)) {
    throw new Error(`favorite_nhentai.doujin not found in ${absoluteFile}`);
  }

  const allIds = normalizeIds(records);
  const endIndex = options.max === null ? undefined : options.start + options.max;
  const ids = allIds.slice(options.start, endIndex);
  console.log(`Loaded ${records.length} records, ${ids.length} unique ids selected.`);

  if (ids.length === 0) {
    console.log('Nothing to sync.');
    return;
  }

  if (options.dryRun) {
    console.log('Dry-run mode. First 20 ids:');
    console.log(ids.slice(0, 20).join(', '));
    return;
  }

  const authHeader = buildAuthHeader();
  const failed = [];
  let success = 0;

  for (let i = 0; i < ids.length; i += 1) {
    const id = ids[i];
    const url = `${apiRoot}/galleries/${id}/favorite`;
    console.log(`[${i + 1}/${ids.length}] POST ${url}`);

    let done = false;
    for (let attempt = 0; attempt <= options.maxRetries; attempt += 1) {
      let response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: authHeader,
          },
        });
      }
      catch (error) {
        if (attempt === options.maxRetries) {
          failed.push({ id, status: 'NETWORK_ERROR', detail: error instanceof Error ? error.message : String(error) });
          console.log('  -> network error');
          done = true;
          break;
        }

        const waitMs = Math.max(options.delayMs * 2, 6000);
        console.log(`  -> network error, retry in ${waitMs}ms`);
        await sleep(waitMs);
        continue;
      }

      if (response.ok) {
        success += 1;
        console.log('  -> ok');
        done = true;
        break;
      }

      const detail = await response.text();
      if (response.status === 429 && attempt < options.maxRetries) {
        const retryAfterSeconds = Number(response.headers.get('retry-after') ?? '0');
        const waitMs = Math.max(
          options.delayMs * 2,
          Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : 0,
        );
        console.log(`  -> 429, retry in ${waitMs}ms`);
        await sleep(waitMs);
        continue;
      }

      failed.push({ id, status: response.status, detail });
      console.log(`  -> failed (${response.status})`);
      done = true;
      break;
    }

    if (!done) {
      failed.push({ id, status: 'UNKNOWN', detail: 'Unexpected retry state' });
      console.log('  -> failed (unknown)');
    }

    await sleep(options.delayMs);
  }

  console.log('');
  console.log('Sync completed.');
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('Failed IDs:');
    for (const item of failed) {
      console.log(`- ${item.id} (${item.status}) ${item.detail}`);
    }
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
