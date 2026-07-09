const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categorias = [
    // PESSOAL - RECEITAS
    { nome: "Salário", icone: "💰", area: "PESSOAL", tipo: "RECEITA" },
    { nome: "Investimentos", icone: "💸", area: "PESSOAL", tipo: "RECEITA" },
    { nome: "Outros Ganhos", icone: "🎁", area: "PESSOAL", tipo: "RECEITA" },

    // PESSOAL - DESPESAS
    { nome: "Alimentação", icone: "🍔", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Transporte", icone: "🚗", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Combustível", icone: "⛽", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Compras", icone: "🛍️", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Lazer", icone: "🎮", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Saúde", icone: "💊", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Academia", icone: "🏋️", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Educação", icone: "📚", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Cartões", icone: "💳", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Assinaturas", icone: "📦", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Viagens", icone: "✈️", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Presentes", icone: "🎁", area: "PESSOAL", tipo: "DESPESA" },
    { nome: "Extras", icone: "📂", area: "PESSOAL", tipo: "DESPESA" },

    // CASA
    { nome: "Mercado", icone: "🛒", area: "CASA", tipo: "DESPESA" },
    { nome: "Energia", icone: "💡", area: "CASA", tipo: "DESPESA" },
    { nome: "Água", icone: "🚰", area: "CASA", tipo: "DESPESA" },
    { nome: "Gás", icone: "🔥", area: "CASA", tipo: "DESPESA" },
    { nome: "Internet", icone: "🌐", area: "CASA", tipo: "DESPESA" },
    { nome: "TV / Streaming", icone: "📺", area: "CASA", tipo: "DESPESA" },
    { nome: "Limpeza", icone: "🧹", area: "CASA", tipo: "DESPESA" },
    { nome: "Manutenção", icone: "🛠️", area: "CASA", tipo: "DESPESA" },
    { nome: "Pet", icone: "🐶", area: "CASA", tipo: "DESPESA" },
    { nome: "Aluguel / Financiamento", icone: "🏠", area: "CASA", tipo: "DESPESA" },
    { nome: "Condomínio", icone: "🏦", area: "CASA", tipo: "DESPESA" },
    { nome: "Cartões", icone: "💳", area: "CASA", tipo: "DESPESA" },
    { nome: "Compras da Casa", icone: "📦", area: "CASA", tipo: "DESPESA" },
    { nome: "Extras", icone: "📂", area: "CASA", tipo: "DESPESA" },
  ];

  for (const categoria of categorias) {
    await prisma.category.upsert({
      where: {
        nome_area: {
          nome: categoria.nome,
          area: categoria.area,
        },
      },
      update: {},
      create: categoria,
    });
  }

  console.log("Categorias cadastradas!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());