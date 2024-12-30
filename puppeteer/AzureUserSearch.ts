import { Frame, Page } from 'puppeteer';

export async function waitForSearchLoading(contentFrame: Frame) {
  await new Promise((resolve) => {
    const interval = setInterval(async () => {
      const text = await contentFrame
        .waitForSelector('div[aria-live="polite"][role="status"] div')
        .then((e) => e?.evaluate((el) => el.textContent));
      if (text === 'Completed fetching users') {
        resolve('');
        clearInterval(interval);
      }
    }, 500);
  });
}

export default async function AzureUserSearch(page: Page, email: string) {
  if (
    page.url() !==
    'https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers'
  )
    await page.goto(
      'https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers'
    );

  const iframeHandle = await page.waitForSelector('iframe#_react_frame_0');
  if (!iframeHandle) {
    throw new Error('iframe#_react_frame_0 : 404');
  }

  const contentFrame = await iframeHandle.contentFrame();
  if (!contentFrame) {
    throw new Error('iframe#_react_frame_0 contentFrame : 404');
  }

  await waitForSearchLoading(contentFrame);
  const searchBox = await contentFrame.waitForSelector('#SearchBox4');
  if (!searchBox) {
    throw new Error('Search box : 404');
  }

  await searchBox.type(email);
  // await page.waitForNetworkIdle();

  return { contentFrame, searchBox };
}
