const {
  ADMIN_ID,
  ACCESS_DURATION,
  CONVITES,
  usuariosAutorizados
} = require("../config/access");


// Verifica se é administrador
function isAdmin(telegramId) {

  return String(telegramId) === String(ADMIN_ID);

}


// Verifica se usuário possui acesso
function possuiAcesso(telegramId) {

  const id = String(telegramId);

  const usuario = usuariosAutorizados[id];


  if (!usuario) {
    return false;
  }


  return new Date() < new Date(usuario.expiraEm);

}


// Libera usuário através do convite
function liberarPorConvite(telegramId, codigo) {

  const id = String(telegramId);


  if (!CONVITES[codigo]) {

    if (CONVITES[codigo] === null) {

      const expiraEm = new Date(
        Date.now() + ACCESS_DURATION
      );


      usuariosAutorizados[id] = {
        expiraEm
      };


      CONVITES[codigo] = id;


      return true;

    }

  }


  return false;

}



module.exports = {

  isAdmin,
  possuiAcesso,
  liberarPorConvite

};