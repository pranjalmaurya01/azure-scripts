import { Page } from 'puppeteer';
import AzureUserSearch, { waitForSearchLoading } from './AzureUserSearch';
import ResendInvite from './ResendInvite';

export default async function CheckInviteStatus(
  page: Page,
  emails: string[],
  resendInvitation?: boolean
) {
  for (const email of emails) {
    const { contentFrame } = await AzureUserSearch(page, email);

    await waitForSearchLoading(contentFrame);

    const noOfResults = ((await contentFrame
      .$('div[data-testid="resultMessage"]')
      .then((e) => e?.evaluate((el) => el.textContent))) || ' ')[0];

    if (noOfResults == '1') {
      const invitationState = await contentFrame
        .$('div[data-automation-key="externalUserState"]')
        .then((e) => e?.evaluate((el) => el.textContent));

      if (resendInvitation) {
        if (invitationState === 'Pending acceptance') {
          await ResendInvite(page, contentFrame);
        } else {
          console.log(`${email} :Can't Resend Invite : ${invitationState}`);
        }
      } else {
        console.log(`${email} : ${invitationState}`);
      }
    } else if (noOfResults == '0') {
      console.warn(`${email} : 404`);
    } else {
      console.log(`'Multiple results found' : ${email} ${noOfResults}`);
    }

    // set search input empty
    await page.$('button[aria-label="Clear text"]')?.then((e) => e?.click());
  }

  console.log('CheckInviteStatus : 200');
}
