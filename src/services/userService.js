const prisma = require("../database/prisma");


async function getUserByTelegramId(telegramId) {

  return prisma.user.findUnique({

    where: {
      telegramId: String(telegramId),
    },

  });

}



async function createUser(telegramId, nome) {

  const usuario = await getUserByTelegramId(telegramId);


  if (usuario) {

    return usuario;

  }


  return prisma.user.create({

    data: {

      telegramId: String(telegramId),

      nome,

    },

  });

}



async function updateUserArea(telegramId, area) {

  return prisma.user.update({

    where: {

      telegramId: String(telegramId),

    },

    data: {

      areaSelecionada: area,

    },

  });

}



async function updateSalary(telegramId, salario) {

  return prisma.user.update({

    where: {

      telegramId: String(telegramId),

    },

    data: {

      salarioMensal: salario,

      saldo: salario,

      areaSelecionada: "PESSOAL",

    },

  });

}



async function updateBalance(telegramId, valor, tipo) {


  const usuario = await getUserByTelegramId(telegramId);


  if (!usuario) {

    throw new Error("Usuário não encontrado");

  }


  let novoSaldo = usuario.saldo;


  if (tipo === "RECEITA") {

    novoSaldo += valor;

  }


  if (tipo === "DESPESA") {

    novoSaldo -= valor;

  }


  return prisma.user.update({

    where: {

      telegramId: String(telegramId),

    },

    data: {

      saldo: novoSaldo,

    },

  });

}

async function resetUser(telegramId) {

  const usuario = await getUserByTelegramId(telegramId);


  if (!usuario) {
    return null;
  }


  // apaga todas as transações do usuário

  await prisma.transaction.deleteMany({

    where: {
      userId: usuario.id
    }

  });



  // reseta os dados financeiros

  return prisma.user.update({

    where: {
      telegramId: String(telegramId)
    },


    data: {

      saldo: 0,

      salarioMensal: null,

      areaSelecionada: null

    }

  });


}


module.exports = {

  getUserByTelegramId,

  createUser,

  updateUserArea,

  updateSalary,

  updateBalance,

   resetUser

};