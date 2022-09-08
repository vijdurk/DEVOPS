#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');

const [, , ...args] = process.argv;

iteration = args[0];
urls = args[1].split(",");

if (iteration == 0) {
  iteration = "baseline";
}

(async () => {
  let names = urls.map(function (url) {
    return url.split("/").pop().split(".")[0];
  });
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  for (var i=0; i<urls.length; i++) {
    let url = urls[i];
    let filename = "/bakerx/pipeline/screenshots/" + names[i] + "_" + iteration + ".png";
    await page.goto(url, {
      waitUntil: 'networkidle0'
    });
    await page.screenshot({
      path: filename,
      fullPage: true
    });
  }
  await page.close();
  await browser.close();
})().catch((error) => {
  console.error(error);
  console.log("Promise rejected");
  process.exit();
});