const puppeteer = require('puppeteer');
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./sequelize");
//const urlAlvo = 'https://www.giassi.com.br/carnes-e-aves';

async function obtemLinks(url) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(url);

  const linksProdutos = [];

  while (true) {
    await page.waitForSelector('.vtex-product-summary-2-x-clearLink.h-100.flex.flex-column', { timeout: 0 });

    const lnkProdutos = await page.$$eval('.vtex-product-summary-2-x-clearLink.h-100.flex.flex-column', (links) =>
      links.map((link) => link.href)
    );

    // Itera pelos links e insere em tuplas
    for (const link of lnkProdutos) {
      const insertQuery = `INSERT INTO det_links_produtos VALUES (null, '${link}', NOW())`;
      await sequelize.runQuery(insertQuery);
      linksProdutos.push(link);
    }

    const seeMoreButton = await page.$('.vtex-button__label.flex.items-center.justify-center.h-100.ph5');
    if (!seeMoreButton) {
      break;
    }

    await seeMoreButton.click();
    await page.waitForTimeout(2000);
  }

  console.log(linksProdutos);
  await browser.close();
  return linksProdutos;
}

//obtemLinks(urlAlvo);
module.exports = obtemLinks;