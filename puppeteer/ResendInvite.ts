import { Frame, Page } from 'puppeteer';
import { waitFor } from './utils';

export default async function ResendInvite(page: Page, contentFrame: Frame) {
  await contentFrame.click(
    'div[data-testid="displaynamewithicon-container"] a div'
  );
  const iframeHandleNew = await page.waitForSelector('iframe#_react_frame_1');
  if (!iframeHandleNew) {
    throw new Error('iframe : 404');
  }
  const contentFrameNew = await iframeHandleNew.contentFrame();
  if (!contentFrameNew) {
    throw new Error('iframe contentFrame : 404');
  }
  const resendBtn = await contentFrameNew.waitForSelector(
    'button[data-telemetryname="Manage B2B Collaboration Status"]'
  );

  await resendBtn?.click();
  // TODO: complete resend
  await waitFor(10000);

  await page.goBack();
}
