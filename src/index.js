require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

const { 
  createUser, 
  getUserByTelegramId,
  updateUserArea,
  updateSalary,
  updateBalance,
  resetUser
} = require("./services/userService");


const {
  setState,
  getState,
  clearState
} = require("./states/userState");


const { createTransaction } = require("./services/transactionService");
const { getCategoryByName } = require("./services/categoryService");

const { parseMessage } = require("./utils/parser");
const { detectarCategoria } = require("./utils/categoryMatcher");
const { getBalanceInfo } = require("./services/balanceService");
const { getPersonalReport } = require("./services/reportService");


const bot = new Telegraf(process.env.BOT_TOKEN);


//
// START
//

bot.start(async (ctx) => {

  try {

    const telegramId = String(ctx.from.id);
    const nome = ctx.from.first_name;


    await createUser(
      telegramId,
      nome
    );


 await ctx.reply(
`🤖 Olá ${nome}! Bem-vindo ao FinanceMoney AI.


💰 Eu sou seu assistente financeiro inteligente.

Minha função é ajudar você a organizar sua vida financeira, registrando:

✅ Receitas
✅ Despesas
✅ Controle de saldo
✅ Relatórios financeiros
✅ Análises dos seus gastos


Você poderá acompanhar tudo de forma simples diretamente pelo Telegram.


📌 Digite /ajuda para ver todos os comandos disponíveis da IA.


Agora vamos começar!


Escolha qual área você quer controlar:`,
      Markup.keyboard([
        ["👤 Pessoal"],
        ["🏠 Casa"]
      ])
      .resize()
    );


  } catch(error){

    console.error(error);

    await ctx.reply(
      "Erro ao iniciar cadastro."
    );

  }

});



//
// ÁREA PESSOAL
//

bot.hears("👤 Pessoal", async(ctx)=>{


  const telegramId = String(ctx.from.id);


  await updateUserArea(
    telegramId,
    "PESSOAL"
  );


  setState(
    telegramId,
    {
      etapa:"SALARIO"
    }
  );


  await ctx.reply(
`👤 Controle pessoal ativado!

Antes de começar:

💰 Qual é o seu salário mensal?

Exemplo:

3000`,
    Markup.removeKeyboard()
  );


});



//
// ÁREA CASA
//

bot.hears("🏠 Casa", async(ctx)=>{


  const telegramId = String(ctx.from.id);


  await updateUserArea(
    telegramId,
    "CASA"
  );


  await ctx.reply(
`🏠 Controle da casa ativado!

Agora envie seus gastos.

Exemplo:

paguei R$150 energia`,
    Markup.removeKeyboard()
  );


});


//
// AJUDA
//

bot.command("ajuda", async(ctx)=>{


await ctx.reply(
`🤖 FinanceMoney AI


📌 COMANDOS DISPONÍVEIS


💰 /saldo

Mostra seu salário, saldo atual e informações financeiras.


📊 /relatorio

Gera um relatório completo:

• Receitas
• Despesas por categoria
• Total gasto
• Análise financeira


🔄 /reset

Reinicia sua conta financeira.

⚠️ Será necessário confirmar antes de apagar os dados.


❓ /ajuda

Mostra todos os comandos disponíveis.


📝 REGISTROS

Você também pode enviar mensagens normais:

Exemplos:

"Gastei R$50 almoço"

"Recebi R$500 renda extra"

"Paguei R$100 transporte"


O FinanceMoney AI identifica automaticamente as categorias.


🚀 Continue usando e acompanhe sua evolução financeira!`
);


});


//
// CONSULTAR SALDO
//

bot.command("saldo", async (ctx) => {

  try {

    const telegramId = String(ctx.from.id);


    const usuario = await getBalanceInfo(telegramId);


    if(!usuario){

      return ctx.reply(
        "❌ Usuário não encontrado.\nDigite /start primeiro."
      );

    }


    await ctx.reply(

`🏦 Seu controle financeiro


👤 Área:
${usuario.areaSelecionada || "Não definida"}


💰 Salário mensal:

R$ ${(usuario.salarioMensal || 0).toFixed(2)}


💵 Saldo atual:

R$ ${(usuario.saldo || 0).toFixed(2)}


📅 Consulta realizada em:

${new Date().toLocaleString("pt-BR")}

`

    );


  } catch(error){

    console.error(error);

    ctx.reply(
      "❌ Erro ao consultar saldo."
    );

  }

});

//
// RESETAR CONTA
//

//
// RESETAR CONTA
//

bot.command("reset", async(ctx)=>{

  const telegramId = String(ctx.from.id);


  setState(
    telegramId,
    {
      etapa:"CONFIRMAR_RESET"
    }
  );


  await ctx.reply(
`⚠️ Atenção!

Você está prestes a apagar todos os seus dados financeiros.

Será removido:

💸 Todas as despesas
💰 Todas as receitas
💵 Salário configurado
🏦 Saldo atual

Essa ação não pode ser desfeita.

Digite:

CONFIRMAR

para continuar.`
  );

});


//
// RELATÓRIO PESSOAL
//

bot.command("relatorio", async (ctx) => {

  

  try {

    await ctx.reply("📊 Gerando relatório atualizado...");

    const telegramId = String(ctx.from.id);

    const relatorio = await getPersonalReport(telegramId);

    if (!relatorio) {
      return ctx.reply("❌ Usuário não encontrado.");
    }


    const despesas = relatorio.despesas;

  let mensagem =
`🔥 TESTE NOVO 🔥

📊 FinanceMoney AI
📅 Relatório Pessoal
🕒 ${new Date().toLocaleString("pt-BR")}

━━━━━━━━━━━━━━━━━━━━━━

💰 FINANÇAS

💵 Salário Mensal
R$ ${relatorio.salario.toFixed(2)}

🏦 Saldo Atual
R$ ${relatorio.saldo.toFixed(2)}

💸 Renda Extra
R$ ${relatorio.rendaExtra.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━

💳 DESPESAS

🚗 Transporte
R$ ${despesas["Transporte"].toFixed(2)}

🍔 Alimentação
R$ ${despesas["Alimentação"].toFixed(2)}

🎮 Lazer
R$ ${despesas["Lazer"].toFixed(2)}

🏥 Saúde
R$ ${despesas["Saúde"].toFixed(2)}

📦 Outros
R$ ${despesas["Outros"].toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━

📉 Total Gasto

R$ ${relatorio.totalDespesas.toFixed(2)}

`;

    const percentual =
      relatorio.salario > 0
        ? (relatorio.totalDespesas / relatorio.salario) * 100
        : 0;

    mensagem += "🤖 Análise Financeira\n\n";

    if (percentual <= 30) {

      mensagem += `✅ Você utilizou ${percentual.toFixed(1)}% do seu salário.

Continue assim! 👏`;

    } else if (percentual <= 60) {

      mensagem += `⚠️ Você utilizou ${percentual.toFixed(1)}% do seu salário.

Fique atento aos próximos gastos.`;

    } else {

      mensagem += `🚨 Você utilizou ${percentual.toFixed(1)}% do seu salário.

É recomendável reduzir os gastos.`;

    }

    await ctx.reply(mensagem);

  } catch (error) {

    console.error(error);

    await ctx.reply("❌ Erro ao gerar relatório.");

  }

});

//
// TODAS AS MENSAGENS
//

bot.on("text", async(ctx)=>{


  const texto = ctx.message.text;


  if(texto.startsWith("/")) return;



  try{


    const telegramId = String(ctx.from.id);



    const usuario = await getUserByTelegramId(
      telegramId
    );


    if(!usuario){

      return ctx.reply(
        "Faça /start primeiro."
      );

    }



    //
    // VERIFICA SE ESTÁ CONFIGURANDO SALÁRIO
    //

    const estado = getState(
      telegramId
    );

    if(estado?.etapa === "CONFIRMAR_RESET"){


  if(texto.toUpperCase() !== "CONFIRMAR"){

    clearState(telegramId);


    return ctx.reply(
      "❌ Reset cancelado."
    );

  }



  await resetUser(
    telegramId
  );


  clearState(
    telegramId
  );


  return ctx.reply(
`✅ Conta resetada com sucesso!


Todos os dados foram apagados.


Digite:

/start

para começar novamente.`
  );


}



    if(
      estado?.etapa === "SALARIO"
    ){


      const valor = Number(
        texto
        .replace("R$","")
        .replace(",",".")
      );



      if(isNaN(valor)){


        return ctx.reply(
          "Digite apenas o valor do salário.\nExemplo: 3000"
        );


      }



      await updateSalary(
        telegramId,
        valor
      );



      clearState(
        telegramId
      );



      return ctx.reply(
`✅ Configuração concluída!

💰 Salário mensal:

R$ ${valor.toFixed(2)}

🏦 Saldo atual:

R$ ${valor.toFixed(2)}


Agora você pode registrar seus gastos normalmente.

Exemplo:

gastei R$50 almoço`
      );


    }



    //
    // PROCESSA LANÇAMENTO
    //


    const resultado = parseMessage(
      texto,
      usuario.areaSelecionada
    );



    if(!resultado.success){

      return ctx.reply(
        resultado.error
      );

    }



 const categoriaNome = detectarCategoria(
  resultado.area,
  resultado.tipo,
  resultado.descricao
);


    const categoria = await getCategoryByName(
      categoriaNome,
      resultado.area
    );



    if(!categoria){

      return ctx.reply(
        "Categoria não encontrada."
      );

    }



    await createTransaction({

      userId: usuario.id,

      area: resultado.area,

      tipo: resultado.tipo,

      categoriaId: categoria.id,

      descricao: resultado.descricao,

      valor: resultado.valor

    });



    //
    // ATUALIZA SALDO
    //

    await updateBalance(
      telegramId,
      resultado.valor,
      resultado.tipo
    );



    const usuarioAtualizado = await getUserByTelegramId(
      telegramId
    );



    await ctx.reply(
`✅ Registro salvo!


📌 Área:

${resultado.area}


🏷 Categoria:

${categoria.nome}


💰 Valor:

R$ ${resultado.valor.toFixed(2)}


📝 Descrição:

${resultado.descricao}


🏦 Saldo atual:

R$ ${usuarioAtualizado.saldo.toFixed(2)}`
    );



  }catch(error){


    console.error(error);


    await ctx.reply(
      "Erro ao registrar lançamento."
    );


  }


});



bot.launch();


console.log(
"🤖 FinanceMoney AI iniciado!"
);