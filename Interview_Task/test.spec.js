const { chromium } = require('playwright');

async function getPriceFromAmazon(page, mobileName) {
  await page.goto("https://www.amazon.in");
  await page.fill('input[name="field-keywords"]', mobileName);
  await page.press('input[name="field-keywords"]', 'Enter');
  await page.waitForTimeout(3000);

  const priceText = await page.locator('span.a-price-whole').first().innerText();
  return parseInt(priceText.replace(/[,₹]/g, ''));
}

async function getPriceFromFlipkart(page, mobileName) {
  await page.goto('https://www.flipkart.com');
  try {
    await page.click('button._2KpZ6l._2doB4z'); // Close login popup
  } catch (e) {}

  await page.fill('input[name="q"]', mobileName);
  await page.press('input[name="q"]', 'Enter');
  await page.waitForTimeout(3000);

  const priceText = await page.locator('div._30jeq3').first().innerText();
  return parseInt(priceText.replace(/[,₹]/g, ''));
}

(async () => {
  const mobileName = 'Samsung Galaxy M05 (Mint Green, 4GB RAM, 64 GB Storage)';
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const amazonPrice = await getPriceFromAmazon(page, mobileName);
  console.log(`Amazon Price for ${mobileName}: ₹${amazonPrice}`);

  const flipkartPrice = await getPriceFromFlipkart(page, mobileName);
  console.log(`Flipkart Price for ${mobileName}: ₹${flipkartPrice}`);

  if (amazonPrice < flipkartPrice) {
    console.log(`✅ Amazon has the lower price for ${mobileName}`);
  } else if (flipkartPrice < amazonPrice) {
    console.log(`✅ Flipkart has the lower price for ${mobileName}`);
  } else {
    console.log(`✅ Both sites have the same price for ${mobileName}`);
  }

  await browser.close();
})();
