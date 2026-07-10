const {
  isAdmin,
  possuiAcesso
} = require("../services/accessService");

async function checkAccess(ctx, next) {

  const telegramId = String(ctx.from.id);

  if (isAdmin(telegramId)) {
    return next();
  }

  if (!possuiAcesso(telegramId)) {

    return ctx.reply(
`🔒 Você não possui acesso ao FinanceMoney AI.

Solicite um convite ao administrador.`
    );

  }

  return next();

}

module.exports = checkAccess;