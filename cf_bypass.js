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

  await page.goto('https://nhentai.net/api/galleries/search?query=*', { waitUntil: 'networkidle2' });

  await new Promise((resolve) => setTimeout(resolve, 15_000));

  const cookies = await page.cookies();
  const cfClearance = cookies.find((cookie) => cookie.name === 'cf_clearance');

  const userAgent = await page.browser().userAgent();

  if (cfClearance) {
    console.log('success get token:', cfClearance.value);

    const jsonData = {
      cf_clearance: `cf_clearance=${cfClearance.value}`,
      user_agent: userAgent,
    };

    try {
      writeFileSync(resolve('data', 'cf.json'), JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log('cf.json updated successfully');
    }
    catch (err) {
      console.error('Error writing to file:', err);
    }

    // Perform fetch request to test cf_clearance and user-agent
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
