const prisma = require("../database/prisma");


async function getBalanceInfo(telegramId) {

  return prisma.user.findUnique({
    where: {
      telegramId: String(telegramId)
    },
    select: {
      nome: true,
      salarioMensal: true,
      saldo: true,
      areaSelecionada: true
    }
  });

}


module.exports = {
  getBalanceInfo
};