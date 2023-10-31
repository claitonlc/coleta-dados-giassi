const dataAtual = new Date();
const fusoHorario = 'America/Sao_Paulo';

const opcoes = {
  timeZone: fusoHorario,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false, // Define o formato de 24 horas
};

const formatador = new Intl.DateTimeFormat('en-US', opcoes);
const partesDaData = formatador.formatToParts(dataAtual);
//const dataFormatada = `${partesDaData[0].value}-${partesDaData[2].value}-${partesDaData[4].value} ${partesDaData[6].value}:${partesDaData[8].value}:${partesDaData[10].value}`;
const dataFormatada = `${partesDaData[4].value}-${partesDaData[0].value}-${partesDaData[2].value} ${partesDaData[6].value}:${partesDaData[8].value}:${partesDaData[10].value}.000`;
    
console.log(dataFormatada);


const inputText = "R$&nbsp;18,98";
const cleanedText = inputText.replace(/(R\$|&nbsp;)/g, '');

console.log(cleanedText); // Saída: "18,98"