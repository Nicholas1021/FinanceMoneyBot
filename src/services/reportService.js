const prisma = require("../database/prisma");


async function getPersonalReport(telegramId) {

  try {

    console.log("📊 Gerando relatório para:", telegramId);


    const usuario = await prisma.user.findUnique({

      where: {
        telegramId: String(telegramId)
      },

      include: {

        transactions: {

          where: {
            area: "PESSOAL"
          },

          include: {
            category: true
          },

          orderBy: {
            data: "desc"
          }

        }

      }

    });



    if (!usuario) {

      console.log("❌ Usuário não encontrado");

      return null;

    }



    console.log(
      "👤 Usuário:",
      usuario.nome
    );


    console.log(
      "📦 Transações encontradas:",
      usuario.transactions.length
    );



    let rendaExtra = 0;

    let totalDespesas = 0;



    const despesas = {

      "Transporte": 0,

      "Alimentação": 0,

      "Lazer": 0,

      "Saúde": 0,

      "Outros": 0

    };



    usuario.transactions.forEach((item)=>{


      const categoria =
        item.category?.nome || "Outros";



      // RECEITAS

      if(item.tipo === "RECEITA"){


        if(categoria === "Renda Extra"){

          rendaExtra += item.valor;

        }


        return;

      }




      // DESPESAS

      if(item.tipo === "DESPESA"){


        totalDespesas += item.valor;



        if(despesas[categoria] !== undefined){


          despesas[categoria] += item.valor;


        } else {


          despesas["Outros"] += item.valor;


        }


      }



    });




    return {


      nome: usuario.nome,


      salario:
        usuario.salarioMensal || 0,


      saldo:
        usuario.saldo || 0,


      rendaExtra,


      despesas,


      totalDespesas


    };



  } catch(error){


    console.error(
      "❌ Erro no relatório:",
      error
    );


    throw error;


  }


}



module.exports = {

  getPersonalReport

};