const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false }); // bật UI để debug
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(
    'https://dashboard.clerk.com/sign-in?redirect_url=https%3A%2F%2Fdashboard.clerk.com%2F',
    { waitUntil: 'networkidle' }
  );

  // STEP 1: email
  await page.fill('input[type="text"]', process.env.CLERK_EMAIL);
  await page.click('button:has-text("Continue")');

  // STEP 2: password
  await page.waitForSelector('input[type="password"]', { timeout: 15000 });
  await page.fill('input[type="password"]', process.env.CLERK_PASSWORD);
  await page.click('button:has-text("Continue")');

  await page.waitForTimeout(15000); // Input email code

  // LOGIN SUCCESS
  await page.waitForURL('https://dashboard.clerk.com/**', {
    timeout: 30000
  });

  // SAVE SESSION
  await context.storageState({ path: 'auth-state.json' });

  await browser.close();
})();
