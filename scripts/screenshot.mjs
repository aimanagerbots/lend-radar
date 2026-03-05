import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:3000';
const output = process.argv[3] || 'screenshot.png';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.screenshot({ path: output, fullPage: true });
console.log(`Screenshot saved to ${output}`);
await browser.close();
