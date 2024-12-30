import { Page } from 'puppeteer';
import AzureUserSearch from './AzureUserSearch';

export default async function CheckInviteStatus(page: Page, emails: string[]) {
  for (const email of emails) {
    const { contentFrame, searchBox } = await AzureUserSearch(page, email);
    const resultDiv = await contentFrame.waitForSelector(
      'div[data-testid="resultMessage"]'
    );
    if (!resultDiv) {
      throw new Error('Result : 404');
    }

    const noOfResults = ((await resultDiv.evaluate((el) => el.textContent)) ||
      ' ')[0];

    if (noOfResults == '1') {
      const invitationState = await contentFrame
        .$('div[data-automation-key="externalUserState"]')
        .then((e) => e?.evaluate((el) => el.textContent));

      console.log(`${email} : ${invitationState}`);
    } else if (noOfResults == '0') {
      console.warn(`${email} : 404`);
    } else {
      console.log(`'Multiple results found' : ${email} ${noOfResults}`);
    }

    // set search input empty
    await contentFrame
      .$('button[aria-label="Clear text"]')
      .then((e) => e?.click());
  }

  console.log('CheckInviteStatus : 200');
}
