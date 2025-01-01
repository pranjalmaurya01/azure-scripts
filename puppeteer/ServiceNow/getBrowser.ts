import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser;
let page: Page;

export default async function getBrowser() {
  const res = await fetch('http://localhost:9222/json/version');
  const data = await res.json();

  browser = await puppeteer.connect({
    browserWSEndpoint: data.webSocketDebuggerUrl,
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1650, height: 1024 });

  for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
    process.on(signal, () => {
      cleanup();
    });
  }

  return { page, browser };
}

export async function cleanup() {
  await page?.close();
  await browser?.disconnect();
}
