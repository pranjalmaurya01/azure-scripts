import { ElementHandle, Page } from 'puppeteer';

export const clearInput = async (page: Page, input: ElementHandle<Element>) => {
  await input.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
};

export const waitFor = (time: number) => {
  console.log(`waiting for : ${time / 1000}s`);
  return new Promise((resolve) => setTimeout(() => resolve(''), time));
};
