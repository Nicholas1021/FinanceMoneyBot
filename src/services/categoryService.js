const prisma = require("../database/prisma");

async function getCategoryByName(nome, area) {

    return prisma.category.findFirst({

        where: {

            nome: {

                equals: nome,

                mode: "insensitive"

            },

            area

        }

    });

}

async function getCategories(area) {

    return prisma.category.findMany({

        where: {

            area

        },

        orderBy: {

            nome: "asc"

        }

    });

}

module.exports = {

    getCategoryByName,

    getCategories

};