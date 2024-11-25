import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Function to generate a random UID
function generateRandomUID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Intercept console errors to handle IndexedDB issues
  page.on('console', (msg) => {
    if (msg.type() === 'error' && msg.text().includes('IndexedDB')) {
      console.log('Ignored IndexedDB error:', msg.text());
    } else {
      console.log(`[${msg.type()}] ${msg.text()}`);
    }
  });

  // Intercept network requests to avoid IndexedDB-related errors
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() === 'other') {
      req.abort(); // Abort requests that might trigger IndexedDB issues
    } else {
      req.continue();
    }
  });

  // Add a listener for when the tab (page) is closed
  browser.on('targetdestroyed', async (target) => {
    if (target.type() === 'page') {
      console.log('Tab closed. Closing the browser...');
      await browser.close();
      process.exit(0); // Exit the script
    }
  });

  await page.goto('https://de.wikipedia.org/wiki/Corona', { waitUntil: 'load' });

  // Ensure the 'images' directory exists
  const dir = path.join(__dirname, 'images');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Get and sanitize the page title
  const pageTitle = await page.title();
  const sanitizedTitle = pageTitle.replace(/[<>:"/\\|?*]/g, ''); // Remove illegal characters

  // Generate the random UID and build the screenshot path
  const filePath = path.join(dir, `${sanitizedTitle}-${generateRandomUID()}.png`);

  // Take the screenshot and save it
  await page.screenshot({ path: filePath });
  console.log(`Screenshot saved to ${filePath}`);

  // Extract all hyperlinks on the page
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a')).map(a => a.href)
  );
  const linksFilePath = path.join(dir, `${sanitizedTitle}-links.txt`);
  fs.writeFileSync(linksFilePath, links.join('\n'), 'utf-8');
  console.log(`Extracted ${links.length} links. Saved to ${linksFilePath}`);

  // Count and log the number of images on the page
  const imageCount = await page.evaluate(() =>
    document.querySelectorAll('img').length
  );
  console.log(`Number of images on the page: ${imageCount}`);

  // Extract and log metadata
  const metadata = await page.evaluate(() => {
    const description = document.querySelector('meta[name="description"]')?.content || 'No description';
    const keywords = document.querySelector('meta[name="keywords"]')?.content || 'No keywords';
    return { description, keywords };
  });
  console.log(`Page Metadata:\nDescription: ${metadata.description}\nKeywords: ${metadata.keywords}`);

  console.log('You can now close the browser tab to terminate the script...');
})();
