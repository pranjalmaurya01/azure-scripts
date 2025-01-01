import { cleanEnv, email } from 'envalid';
import puppeteer, { Browser } from 'puppeteer';
import AzureAccountSelect from './AzureAccountSelect';
import CheckInviteStatus from './CheckInviteStatus';
const emails = ['principal@rbkglobalschool.org'];

let browser: Browser;

const env = cleanEnv(process.env, {
  AZURE_USERNAME: email(),
});

(async () => {
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
  //   ignoreDefaultArgs: ['--disable-extensions'],
  //   userDataDir: './puppeteer-user-data',
  // });

  const res = await fetch('http://localhost:9222/json/version');
  const data = await res.json();
  browser = await puppeteer.connect({
    browserWSEndpoint: data.webSocketDebuggerUrl,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1650, height: 1024 });
  await page.goto('https://portal.azure.com');

  await AzureAccountSelect(page, env.AZURE_USERNAME);
  await CheckInviteStatus(page, emails, true);
})()
  .catch((err) => console.error(err))
  .finally(() => browser?.disconnect());
