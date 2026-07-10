const ADMIN_ID = process.env.ADMIN_ID;

const ACCESS_DURATION = 12 * 60 * 60 * 1000; // 12 horas

const CONVITES = {
  TESTE001: null,
  TESTE002: null,
  TESTE003: null
};

const usuariosAutorizados = {};

module.exports = {
  ADMIN_ID,
  ACCESS_DURATION,
  CONVITES,
  usuariosAutorizados
};