import { ElementHandle, Page } from 'puppeteer';

export const clearInput = async (page: Page, input: ElementHandle<Element>) => {
  await input.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
};
