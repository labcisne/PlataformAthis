const prisma = require('../Utils/prisma');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');

exports.listarPerguntas = asyncErrorHandler(async (req, res, next) => {
    const { formulario } = req.query;

    if (!formulario) {
        return res.status(400).json({
            status: 'error',
            message: 'O parâmetro "formulario" é obrigatório.'
        });
    }

    const perguntas = await prisma.facilitiesQuestion.findMany({
        where: {
            formulario,
            ativa: true
        },
        orderBy: {
            ordem: 'asc'
        }
    });

    res.status(200).json({
        status: 'success',
        perguntas
    });
});
