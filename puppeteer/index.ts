import puppeteer from 'puppeteer';
import AzureLogin from './AzureLogin';
import CheckInviteStatus from './CheckInviteStatus';

const emails = [];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreDefaultArgs: ['--disable-extensions'],
    userDataDir: './puppeteer-user-data',
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1650, height: 1024 });
  await page.goto(
    'https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers'
  );
  await page.waitForNetworkIdle();
  await AzureLogin(page);

  await CheckInviteStatus(page, emails);

  await new Promise((resolve) => setTimeout(() => resolve(''), 1000000));
  await browser.close();
})();
