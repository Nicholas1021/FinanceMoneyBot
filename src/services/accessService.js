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


  // Verifica se o convite existe
  if (!(codigo in CONVITES)) {
    return false;
  }


  // Verifica se o convite já foi usado
  if (CONVITES[codigo] !== null) {
    return false;
  }


  // Define validade de 12 horas
  const expiraEm = new Date(
    Date.now() + ACCESS_DURATION
  );


  // Salva usuário autorizado
  usuariosAutorizados[id] = {
    expiraEm
  };


  // Marca convite como usado
  CONVITES[codigo] = id;


  return true;

}


module.exports = {

  isAdmin,
  possuiAcesso,
  liberarPorConvite

};