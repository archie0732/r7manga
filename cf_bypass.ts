import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { connect } from 'puppeteer-real-browser';

async function test() {
  const { page } = await connect({
    headless: false,
    args: [],
    customConfig: {},
    turnstile: true,
    connectOption: {},
    disableXvfb: false,
    ignoreAllFlags: false,
  });

  await page.goto('https://nhentai.net/api/search?query=*', { waitUntil: 'networkidle2' });

  await new Promise((resolve) => setTimeout(resolve, 15_000));

  const cookies = await page.cookies();
  const cfClearance = cookies.find((cookie) => cookie.name === 'cf_clearance');

  const userAgent = await page.browser().userAgent();

  if (cfClearance) {
    const jsonData = {
      cf_clearance: `cf_clearance=${cfClearance.value}`,
      user_agent: userAgent,
    };

    writeFileSync(resolve('cf.json'), JSON.stringify(jsonData, null, 2), 'utf-8');

    try {
      const res = await fetch('https://nhentai.net', {
        method: 'GET',
        headers: {
          'cookie': `cf_clearance=${cfClearance.value}`,
          'referer': 'https://nhentai.net/',
          'user-agent': userAgent,
        },
      });

      console.log('Fetch test status:', res.status);
    }
    catch (err) {
      console.error('Error during fetch test:', err);
    }
  }
  else {
    console.log('something wrong');
  }

  await page.close();
}

void test();
