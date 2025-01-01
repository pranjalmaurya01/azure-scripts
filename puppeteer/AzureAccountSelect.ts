import { Page } from 'puppeteer';

// since admin account and normal account are both signed select correct id
export default async function AzureAccountSelect(page: Page, username: string) {
  await page.waitForNetworkIdle();
  const url = new URL(page.url());
  if (
    url.href !==
    'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize'
  )
    return;

  const account_selector = await page.waitForSelector(
    `div[data-test-id="${username}"]`
  );
  if (!account_selector) {
    throw new Error('AzureAccountSelect : 404');
  }

  await account_selector.click();
  await page.waitForNetworkIdle();
}
