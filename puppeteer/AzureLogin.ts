import { cleanEnv, str } from 'envalid';
import { Page } from 'puppeteer';

const env = cleanEnv(process.env, {
  AZURE_USERNAME: str(),
  AZURE_PASSWORD: str(),
});

const timeout = 5000;
export default async function AzureLogin(page: Page) {
  const url = new URL(page.url());
  if (url.host !== 'login.microsoftonline.com') {
    return;
  }

  page.setDefaultTimeout(timeout);
  try {
    // Step 1: Enter email or phone
    const emailField = await Promise.race([
      page.waitForSelector('input[aria-label="Enter your email, or phone"]', {
        timeout,
      }),
      page.waitForSelector('#i0116', { timeout }),
    ]);

    if (!emailField) {
      throw new Error('Email : 404');
    }
    await emailField.type(env.AZURE_USERNAME);

    // Step 2: Click "Next" button
    const nextButton = await Promise.race([
      page.waitForSelector('button[aria-label="Next"]', { timeout }),
      page.waitForSelector('#idSIButton9', { timeout }),
      page.waitForSelector('button:has-text("Next")', { timeout }),
    ]);

    if (!nextButton) {
      throw new Error('nextButton : 404');
    }
    await nextButton.click();

    const passwordField = await Promise.race([
      page.waitForSelector('input[aria-label="Enter the password"]', {
        timeout,
      }),
      page.waitForSelector('#i0118', { timeout }),
    ]);

    if (!passwordField) {
      throw new Error('PasswordField : 404');
    }

    await passwordField.type(env.AZURE_PASSWORD);

    // Step 4: Submit the form or press Enter
    await page.waitForNetworkIdle();
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    const url = new URL(page.url());
    if (url.host !== 'login.microsoftonline.com') {
      console.log('Login process completed successfully!');
    } else {
      console.log('additional steps');
    }
  } catch (error) {
    console.error('An error occurred during the login process:', error);
  }
}
