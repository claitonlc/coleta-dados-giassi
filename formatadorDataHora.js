const formatadorDataHora = (fusoHorario) => {
    const dataAtual = new Date();
  
    const opcoes = {
      timeZone: fusoHorario,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
      hour12: false,
    };
  
    const formatador = new Intl.DateTimeFormat('en-US', opcoes);
    const partesDaData = formatador.formatToParts(dataAtual);
    const dataFormatada = `${partesDaData[4].value}-${partesDaData[0].value}-${partesDaData[2].value} ${partesDaData[6].value}:${partesDaData[8].value}:${partesDaData[10].value}.000`;
    
    return dataFormatada;
  };
  
  module.exports = formatadorDataHora;

 