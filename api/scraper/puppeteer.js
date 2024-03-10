const puppeteer = require('puppeteer');

async function getHtml(href, waitForSelector) {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 500 })

    await page.goto(href, {
      waitUntil: "networkidle2",
      timeout: 60000
    });
    if(waitForSelector) {
      await page.waitForSelector(waitForSelector);
    }
    const html = await page.evaluate(() => document.documentElement.innerHTML);

    await browser.close();
    return html;
  } catch (err) {
    await browser.close();
    throw new Error('getHtml error on href: "' + href + '"');
  }
}


module.exports = { getHtml }