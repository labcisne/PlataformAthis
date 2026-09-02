const prisma = require('../Utils/prisma');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');


const transformaListaDeOpcoes = (listaDeOpcoes) => ({
    ...listaDeOpcoes,
    opcoes: listaDeOpcoes.opcoes.map((opcao) => opcao.valor)
});

const buscaListaDeOpcoes = async (nome) => prisma.optionGroup.findUnique({
    where: { nome },
    include: {
        opcoes: {
            orderBy: {
                ordem: 'asc'
            }
        }
    }
});

exports.getListaDeOpcoes = asyncErrorHandler(async (req, res, next) => {
    
    const nome = req.params.nome;
    const listaDeOpcoes = await buscaListaDeOpcoes(nome);

    if(!listaDeOpcoes){
        res.status(200).json({
            status: 'success',
            opcoes: []
        })
        return;
    }

    res.status(200).json({
        status: 'success',
        opcoes: listaDeOpcoes.opcoes.map((opcao) => opcao.valor)
    })

});

exports.adicionaNaListaDeOpcoes = asyncErrorHandler(async (req, res, next) => {
    
    const nome = req.params.nome;
    const listaDeOpcoes = await buscaListaDeOpcoes(nome);

    if(!listaDeOpcoes){
        const novaLista = await prisma.optionGroup.create({
            data: {
                nome,
                opcoes: {
                    create: [{
                        valor: req.body.opcao,
                        ordem: 0
                    }]
                }
            },
            include: {
                opcoes: {
                    orderBy: {
                        ordem: 'asc'
                    }
                }
            }
        });

        res.status(200).json({
            status: 'success',
            novaLista: transformaListaDeOpcoes(novaLista)
        })
        return;
    }

    const proximaOrdem = listaDeOpcoes.opcoes.length > 0
        ? listaDeOpcoes.opcoes[listaDeOpcoes.opcoes.length - 1].ordem + 1
        : 0;

    const listaAtualizada = await prisma.optionGroup.update({
        where: { nome },
        data: {
            opcoes: {
                create: {
                    valor: req.body.opcao,
                    ordem: proximaOrdem
                }
            }
        },
        include: {
            opcoes: {
                orderBy: {
                    ordem: 'asc'
                }
            }
        }
    });

    res.status(200).json({
        status: 'success',
        listaDeOpcoes: transformaListaDeOpcoes(listaAtualizada)
    })
});