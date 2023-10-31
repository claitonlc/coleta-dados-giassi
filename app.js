const obtemLinks= require('./obtemLinks');
const getProduto = require('./getProduto');

const urlAlvo = 'https://www.giassi.com.br/carnes-e-aves';

async function app (url) {
    const links  = await obtemLinks(url);

    // for (let i = 0; i < links.length; i++) {
    //     const url = links[i];
    //     //console.log(url);
    //     await getProduto(url);
      


    // }

    for (const link of links) {
        const url = link;
        await getProduto(url);
    }
};

app(urlAlvo);


 