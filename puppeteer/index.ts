import puppeteer from 'puppeteer';
import AzureLogin from './AzureLogin';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreDefaultArgs: ['--disable-extensions'],
    userDataDir: './puppeteer-user-data',
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(
    'https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers'
  );
  await page.waitForNetworkIdle();
  await AzureLogin(page);

  await new Promise((resolve) => setTimeout(() => resolve(''), 100000));
  await browser.close();
})();
