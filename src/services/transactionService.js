const prisma = require("../database/prisma");

async function createTransaction({
    userId,
    area,
    tipo,
    categoriaId,
    descricao,
    valor,
    recorrente = false
}) {

    return prisma.transaction.create({

        data: {

            userId,

            area,

            tipo,

            categoryId: categoriaId,

            descricao,

            valor,

            recorrente

        },

        include: {

            category: true

        }

    });

}

module.exports = {

    createTransaction

};