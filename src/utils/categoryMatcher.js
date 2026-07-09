const categorias = [

  // ======================
  // RECEITAS PESSOAL
  // ======================

  {
    area: "PESSOAL",
    tipo: "RECEITA",
    categoria: "Salário",
    palavras: [
      "salario",
      "salário",
      "pagamento",
      "holerite",
      "empresa"
    ]
  },

  {
    area: "PESSOAL",
    tipo: "RECEITA",
    categoria: "Renda Extra",
    palavras: [
      "extra",
      "freela",
      "freelancer",
      "pix",
      "venda",
      "vendi",
      "cliente",
      "serviço",
      "servico",
      "bico",
      "comissão",
      "comissao",
      "lucro",
      "ganhei",
      "recebi",
      "renda",
      "trabalho extra",
      "show"
    ]
  },

  // ======================
  // DESPESAS PESSOAL
  // ======================

  {
    area: "PESSOAL",
    tipo: "DESPESA",
    categoria: "Transporte",
    palavras: [
      "gasolina",
      "posto",
      "combustivel",
      "combustível",
      "etanol",
      "uber",
      "99",
      "onibus",
      "ônibus",
      "metro",
      "metrô",
      "estacionamento",
      "pedagio",
      "pedágio"
    ]
  },

  {
    area: "PESSOAL",
    tipo: "DESPESA",
    categoria: "Alimentação",
    palavras: [
      "mercado",
      "restaurante",
      "lanche",
      "pizza",
      "ifood",
      "comida",
      "almoço",
      "almoco",
      "jantar",
      "cafe",
      "café"
    ]
  },

  {
    area: "PESSOAL",
    tipo: "DESPESA",
    categoria: "Lazer",
    palavras: [
      "cinema",
      "show",
      "jogo",
      "festa",
      "viagem",
      "passeio"
    ]
  },

  {
    area: "PESSOAL",
    tipo: "DESPESA",
    categoria: "Saúde",
    palavras: [
      "farmacia",
      "farmácia",
      "remedio",
      "remédio",
      "consulta",
      "medico",
      "médico",
      "dentista",
      "hospital"
    ]
  }

];

function detectarCategoria(area, tipo, descricao) {

  const texto = descricao.toLowerCase();

  for (const item of categorias) {

    if (item.area !== area) continue;
    if (item.tipo !== tipo) continue;

    for (const palavra of item.palavras) {

      if (texto.includes(palavra)) {
        return item.categoria;
      }

    }

  }

  return "Outros";

}

module.exports = {
  detectarCategoria
};