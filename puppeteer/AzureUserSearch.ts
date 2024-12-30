import { Page } from 'puppeteer';
import AzureLogin from './AzureLogin';

export default async function AzureUserSearch(page: Page, email: string) {
  if (
    page.url() !==
    'https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers'
  )
    await page.goto(
      'https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers'
    );
  await page.waitForNetworkIdle();
  await AzureLogin(page);

  const iframeHandle = await page.waitForSelector('iframe#_react_frame_0');
  if (!iframeHandle) {
    throw new Error('iframe#_react_frame_0 : 404');
  }

  const contentFrame = await iframeHandle.contentFrame();
  if (!contentFrame) {
    throw new Error('iframe#_react_frame_0 contentFrame : 404');
  }

  const searchBox = await contentFrame.waitForSelector('#SearchBox4');
  if (!searchBox) {
    throw new Error('Search box : 404');
  }

  await searchBox.type(email);
  // await page.waitForNetworkIdle();

  return { contentFrame, searchBox };
}
