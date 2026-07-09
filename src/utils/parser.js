function parseMessage(message, areaUsuario) {

  const texto = message.trim();


  // -----------------------------
  // Área
  // -----------------------------

  const area = areaUsuario;


  if (!area) {
    return {
      success: false,
      error: "Escolha primeiro uma área usando o botão 👤 Pessoal ou 🏠 Casa."
    };
  }


  // -----------------------------
  // Tipo
  // -----------------------------

  let tipo = "DESPESA";


  if (
    /recebi/i.test(texto) ||
    /ganhei/i.test(texto) ||
    /entrou/i.test(texto)
  ) {

    tipo = "RECEITA";

  }


  // -----------------------------
  // Valor
  // -----------------------------

  const valorMatch = texto.match(/(\d+[.,]?\d*)/);


  if (!valorMatch) {

    return {
      success:false,
      error:"Não consegui identificar o valor."
    };

  }


  const valor = parseFloat(
    valorMatch[1].replace(",", ".")
  );


  // -----------------------------
  // Descrição
  // -----------------------------

  let descricao = texto
    .replace(/recebi/i,"")
    .replace(/ganhei/i,"")
    .replace(/entrou/i,"")
    .replace(/gastei/i,"")
    .replace(/paguei/i,"")
    .replace(/comprei/i,"")
    .replace(/R\$/gi,"")
    .replace(valorMatch[1],"")
    .trim();


  return {

    success:true,
    area,
    tipo,
    valor,
    descricao

  };

}


module.exports = {
  parseMessage
};