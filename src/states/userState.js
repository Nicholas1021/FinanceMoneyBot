const estados = {};


function setState(userId, dados){

  estados[userId] = {
    ...estados[userId],
    ...dados
  };

}



function getState(userId){

  return estados[userId];

}



function clearState(userId){

  delete estados[userId];

}



module.exports = {

  setState,

  getState,

  clearState

};