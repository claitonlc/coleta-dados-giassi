const fs = require('fs');
const puppeteer = require('puppeteer');
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./sequelize");
const randomUseragent = require('random-useragent');
const formatadorDataHora = require('./formatadorDataHora');

async function getProduto(url) {
  const fusoHorario = 'America/Sao_Paulo'; // Substitua pelo fuso horário desejado
  const dataFormatada = formatadorDataHora(fusoHorario);
  let link = url;
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.setUserAgent(randomUseragent.getRandom());
    await page.goto(url);
    await page.waitForTimeout(2000);
    await page.waitForSelector('.vtex-store-components-3-x-productBrand.vtex-store-components-3-x-productBrand--quickview');

    // Função para verificar se um elemento existe e obter seu texto
    const getElementText = async (selector) => {
      const element = await page.$(selector);
      return element ? await page.evaluate(el => el.textContent, element) : null;
    };

    const productAvailability = await getElementText('.giassi-apps-custom-0-x-priceTotalUnit');
    const productAvailability2 = await getElementText('.giassi-apps-custom-0-x-priceUnit');
    const ProductDescribe = await page.$eval('.vtex-store-components-3-x-productBrand.vtex-store-components-3-x-productBrand--quickview', (prd) => prd.innerText);
    console.log(productAvailability);
    console.log(productAvailability2);
    let ProductVlr, ProductImg, ProductMarca, ProductCod; 

    if (productAvailability && !productAvailability2) {
      ProductVlr = await page.$eval('.giassi-apps-custom-0-x-priceTotalUnit', (prd) => prd.innerText);
      ProductImg = await page.$eval('.vtex-store-components-3-x-productImageTag.vtex-store-components-3-x-productImageTag--product-images.vtex-store-components-3-x-productImageTag--main.vtex-store-components-3-x-productImageTag--product-images--main', (prd) => prd.getAttribute('src'));
      ProductMarca = await page.$eval('.vtex-store-components-3-x-productBrandName', (prd) => prd.innerText);
      ProductCod = await page.$eval('.vtex-product-identifier-0-x-product-identifier__value', (prd) => prd.innerText); 
    } else {
      ProductVlr = await page.$eval('.giassi-apps-custom-0-x-priceUnit', (prd) => prd.innerText);
      ProductImg = await page.$eval('.vtex-store-components-3-x-productImageTag.vtex-store-components-3-x-productImageTag--product-images.vtex-store-components-3-x-productImageTag--main.vtex-store-components-3-x-productImageTag--product-images--main', (prd) => prd.getAttribute('src'));
      ProductMarca = await page.$eval('.vtex-store-components-3-x-productBrandName', (prd) => prd.innerText);
      ProductCod = await page.$eval('.vtex-product-identifier-0-x-product-identifier__value', (prd) => prd.innerText); 
    } 
    const ProdutoAjustado = ProductVlr.replace(/[^0-9,]/g, '');
    const valorAjustado = ProdutoAjustado.replace(',', '.');
    const numero = parseFloat(valorAjustado);
    const valorFormatado = numero.toFixed(2);
    const dados = { ProductDescribe, ProductVlr, ProductImg };
    const insertQuery = `INSERT INTO PRODUTO VALUES (NULL, '${ProductCod}', 'Carnes e Aves', '${ProductDescribe}','${ProductMarca}','${valorFormatado}', '${ProductImg}','${link}','Giassi Supermercados','${dataFormatada}', null)`;
    sequelize.runQuery(insertQuery);
    console.log(dados);

  } catch (error) {
    console.error('Erro ao processar a URL', url, error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
module.exports = getProduto;
// const linksDeProdutos = [
//   'https://www.giassi.com.br/file_de_peito_de_frango_congelado_sem_pele_sem_osso_sadia_1kg_431052/p',
//   'https://www.giassi.com.br/contrafile_bovino_em_bifes_resfriado_sem_osso_giassi_kg_63460/p',
//   'https://www.giassi.com.br/carne_acem_bovino_moido_resfriado_giassi_kg_86754/p',
//   'https://www.giassi.com.br/sobrecoxa_de_frango_congelada_sadia_1kg_445207/p',
//   'https://www.giassi.com.br/filezinho_sassami_de_frango_congelado_cancao_1kg_931195/p'
// ];

// async function processarLinksDeProdutos() {
//   for (const url of linksDeProdutos) {
//     await getProduto(url);
//   }
// }

// // Chama a função para processar os links de produtos
// processarLinksDeProdutos();
