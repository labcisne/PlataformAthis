const prisma = require("../Utils/prisma");
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');

const { hashSenha, hashRespostaSeguranca } = require("../Utils/userHelpers");
const { formatFamily } = require("../Utils/mapper");

exports.criaFamilia = asyncErrorHandler(async (req, res, next) => {
    const dadosPessoais = req.body.dadosPessoais;
    const localizacao = req.body.localizacao;

    if (!dadosPessoais || !dadosPessoais.nomeMorador) {
        throw new CustomError('Nome do morador é um campo obrigatório!', 400);
    }

    // Usando transação do Prisma para garantir que todas as inserções ocorram atomicamente
    const { family } = await prisma.$transaction(async (tx) => {
        // 1. Cria a família com os dados pessoais e localização iniciais
        const newFamily = await tx.family.create({
            data: {
                dadosPessoais: {
                    create: {
                        nomeMorador: dadosPessoais.nomeMorador,
                        documentoResponsavel: dadosPessoais.documentoResponsavel || null,
                        opcaoSelecionada: dadosPessoais.opcaoSelecionada || null,
                        endereco: dadosPessoais.endereco || null,
                        numeroCasa: dadosPessoais.numeroCasa || null,
                        cidade: dadosPessoais.cidade || null,
                        regiao: dadosPessoais.regiao || null,
                        telefone: dadosPessoais.telefone || null,
                        donoTelefone: dadosPessoais.donoTelefone || null
                    }
                },
                localizacao: {
                    create: {
                        latitude: localizacao?.latitude || null,
                        longitude: localizacao?.longitude || null
                    }
                }
            }
        });

        // 2. Se o criador for Entrevistador, associa ele à família
        if (req.user.tipoUsuario === 'Entrevistador') {
            await tx.familyMembership.create({
                data: {
                    userId: req.user._id,
                    familyId: newFamily.id
                }
            });
        }

        return { family: newFamily };
    });

    res.status(201).json({
        status: 'success',
        data: {
            newFamily: dadosPessoais
        }
    });
});

exports.listarFamilias = asyncErrorHandler(async (req, res, next) => {
    let queryUser = req.user;

    if (req.query.user) {
        try {
            queryUser = typeof req.query.user === 'string' ? JSON.parse(req.query.user) : req.query.user;
        } catch (e) {
            queryUser = req.user;
        }
    }

    let familiesList = [];

    if (queryUser.tipoUsuario === 'Administrador') {
        familiesList = await prisma.family.findMany({
            include: {
                dadosPessoais: true,
                localizacao: true,
                socioeconomica: true,
                estrutural: true,
                imagens: true,
                arquivos: true,
                memberships: true,
                answers: {
                    include: {
                        pergunta: true
                    }
                }
            }
        });
    } else {
        const userId = queryUser._id || queryUser.id;
        familiesList = await prisma.family.findMany({
            where: {
                memberships: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                dadosPessoais: true,
                localizacao: true,
                socioeconomica: true,
                estrutural: true,
                imagens: true,
                arquivos: true,
                memberships: true,
                answers: {
                    include: {
                        pergunta: true
                    }
                }
            }
        });
    }

    res.status(200).json({
        status: 'success',
        length: familiesList.length,
        familias: familiesList.map(family => formatFamily(family))
    });
});

exports.getFamilia = asyncErrorHandler(async (req, res, next) => {
    const family = await prisma.family.findUnique({
        where: { id: req.params.id },
        include: {
            dadosPessoais: true,
            localizacao: true,
            socioeconomica: true,
            estrutural: true,
            imagens: true,
            arquivos: true,
            memberships: true,
            answers: {
                include: {
                    pergunta: true
                }
            }
        }
    });

    if (!family) {
        throw new CustomError('Familia não existe!', 404);
    }

    res.status(200).json({
        status: 'success',
        familia: formatFamily(family)
    });
});

exports.associaFamilia = asyncErrorHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.body.userId },
        include: { memberships: true }
    });

    const family = await prisma.family.findUnique({
        where: { id: req.params.id }
    });

    if (!user) {
        throw new CustomError('Usuário não existe!', 404);
    }
    if (!family) {
        throw new CustomError('Família não existe!', 404);
    }

    const alreadyAssociated = user.memberships.some(m => m.familyId === req.params.id);
    if (alreadyAssociated) {
        throw new CustomError('Usuário já está associado a essa familia!', 400);
    }

    await prisma.familyMembership.create({
        data: {
            userId: req.body.userId,
            familyId: req.params.id
        }
    });

    res.status(200).json({
        status: 'success',
    });
});

exports.deletaFamilia = asyncErrorHandler(async (req, res, next) => {
    if (req.body.userRole !== "Administrador" && req.body.userRole !== "Entrevistador") {
        throw new CustomError('Você não tem permissão para essa ação!', 400);
    }

    // Busca os membros para identificar e deletar o morador associado
    const memberships = await prisma.familyMembership.findMany({
        where: { familyId: req.params.id },
        include: { user: true }
    });

    const moradorUserIds = memberships
        .filter(m => m.user.tipoUsuario === 'Morador')
        .map(m => m.userId);

    await prisma.$transaction([
        // Deleta os usuários que são "Moradores" vinculados à família
        prisma.user.deleteMany({
            where: {
                id: { in: moradorUserIds }
            }
        }),
        // Deleta a família. O cascateamento no banco limpa dadosPessoais, localizacao, arquivos, imagens, etc.
        prisma.family.delete({
            where: { id: req.params.id }
        })
    ]);

    res.status(200).json({
        status: 'success',
        message: 'familia deletada com sucesso'
    });
});

exports.getUsuariosAssociados = asyncErrorHandler(async (req, res, next) => {
    let ids = req.query.usuariosAssociadosId;

    if (!ids) {
        res.status(200).json({
            status: "success",
            users: []
        });
        return;
    }

    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    const users = await prisma.user.findMany({
        where: {
            id: { in: ids }
        },
        include: {
            memberships: true
        }
    });

    res.status(200).json({
        status: "success",
        users: users.map(user => formatFamily(user) ? formatFamily(user) : user) // Adaptador genérico ou retorna objeto mapeado
    });
});

exports.editaFamilia = asyncErrorHandler(async (req, res, next) => {
    if (req.query.userRole !== "Administrador" && req.query.userRole !== "Entrevistador") {
        throw new CustomError('Você não tem permissão para essa ação!', 400);
    }

    const { nomeMorador, documentoResponsavel, opcaoSelecionada, endereco, numeroCasa, cidade, regiao, telefone, donoTelefone } = req.body.familiaEditada;

    const updatedDados = await prisma.familyDadosPessoais.update({
        where: { familyId: req.params.id },
        data: {
            nomeMorador,
            documentoResponsavel: documentoResponsavel || null,
            opcaoSelecionada: opcaoSelecionada || null,
            endereco: endereco || null,
            numeroCasa: numeroCasa || null,
            cidade: cidade || null,
            regiao: regiao || null,
            telefone: telefone || null,
            donoTelefone: donoTelefone || null
        }
    });

    res.status(200).json({
        status: "success",
        newFamily: updatedDados
    });
});

exports.enviaFormularioFacilities = asyncErrorHandler(async (req, res, next) => {
    if (!req.body.id) {
        throw new CustomError('Id da família não enviado!', 400);
    }

    const family = await prisma.family.findUnique({ where: { id: req.body.id } });
    if (!family) {
        throw new CustomError('Família não encontrada!', 404);
    }

    const data = { ...req.body.obj };
    delete data.familyId;

    const userId = req.user._id || req.user.id;
    const questions = await prisma.facilitiesQuestion.findMany({
        where: { formulario: "Facilities", ativa: true }
    });

    await prisma.$transaction(async (tx) => {
        for (const q of questions) {
            if (data[q.codigo] !== undefined) {
                const val = data[q.codigo];
                if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
                    await tx.facilitiesAnswer.deleteMany({
                        where: { familyId: req.body.id, perguntaId: q.id }
                    });
                } else {
                    const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                    await tx.facilitiesAnswer.upsert({
                        where: {
                            familyId_perguntaId: {
                                familyId: req.body.id,
                                perguntaId: q.id
                            }
                        },
                        update: {
                            resposta: stringVal,
                            userId: userId
                        },
                        create: {
                            familyId: req.body.id,
                            perguntaId: q.id,
                            resposta: stringVal,
                            userId: userId
                        }
                    });
                }
            }
        }
    });

    const updatedFamily = await prisma.family.findUnique({
        where: { id: req.body.id },
        include: {
            answers: {
                include: {
                    pergunta: true
                }
            }
        }
    });
    const formatted = formatFamily(updatedFamily);

    res.status(200).json({
        status: 'success',
        tabela: formatted.tabelaSocioeconomica
    });
});

exports.enviaFormularioEstrutural = asyncErrorHandler(async (req, res, next) => {
    if (!req.body.id) {
        throw new CustomError('Id da família não enviado!', 400);
    }

    const family = await prisma.family.findUnique({ where: { id: req.body.id } });
    if (!family) {
        throw new CustomError('Família não encontrada!', 404);
    }

    const data = { ...req.body.obj };
    delete data.familyId;

    const userId = req.user._id || req.user.id;
    const questions = await prisma.facilitiesQuestion.findMany({
        where: { formulario: "Edificacoes", ativa: true }
    });
    const answersByQuestionId = new Map(
        Array.isArray(req.body.answers)
            ? req.body.answers
                .filter(answer => answer && answer.questionId)
                .map(answer => [answer.questionId, answer.value])
            : []
    );

    await prisma.$transaction(async (tx) => {
        for (const q of questions) {
            const hasDirectAnswer = answersByQuestionId.has(q.id);
            if (hasDirectAnswer || data[q.codigo] !== undefined) {
                const val = hasDirectAnswer ? answersByQuestionId.get(q.id) : data[q.codigo];
                if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
                    await tx.facilitiesAnswer.deleteMany({
                        where: { familyId: req.body.id, perguntaId: q.id }
                    });
                } else {
                    const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                    await tx.facilitiesAnswer.upsert({
                        where: {
                            familyId_perguntaId: {
                                familyId: req.body.id,
                                perguntaId: q.id
                            }
                        },
                        update: {
                            resposta: stringVal,
                            userId: userId
                        },
                        create: {
                            familyId: req.body.id,
                            perguntaId: q.id,
                            resposta: stringVal,
                            userId: userId
                        }
                    });
                }
            }
        }
    });

    const updatedFamily = await prisma.family.findUnique({
        where: { id: req.body.id },
        include: {
            answers: {
                include: {
                    pergunta: true
                }
            }
        }
    });
    const formatted = formatFamily(updatedFamily);

    res.status(200).json({
        status: 'success',
        tabela: formatted.tabelaEstrutural
    });
});

// FUNÇÕES DE UPLOAD DE IMAGEM
const storageImagem = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "imagens/");
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadImagem = multer({ storage: storageImagem });
exports.fazUploadImagem = uploadImagem;

exports.insereNovaImagem = asyncErrorHandler(async (req, res, next) => {
    const familyId = req.params.id;
    const descricao = req.body.descricao || null;
    const imagePath = `/imagens/${req.file.filename}`;

    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
        throw new CustomError('Família não encontrada!', 404);
    }

    await prisma.familyImage.create({
        data: {
            familyId,
            caminho: imagePath,
            descricao
        }
    });

    const updatedImagens = await prisma.familyImage.findMany({
        where: { familyId }
    });

    res.status(200).json({
        status: 'success',
        imagens: updatedImagens
    });
});

exports.deletaImagem = asyncErrorHandler(async (req, res, next) => {
    const familyId = req.params.id;
    const caminhoArquivo = req.body.caminhoArquivo;

    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
        throw new CustomError('Família não encontrada!', 404);
    }

    await prisma.familyImage.deleteMany({
        where: {
            familyId,
            caminho: caminhoArquivo
        }
    });

    fs.rm(`.${caminhoArquivo}`, (error) => {
        if (error) {
            throw new CustomError('Erro ao remover a imagem do servidor', 400);
        }
    });

    const updatedImagens = await prisma.familyImage.findMany({
        where: { familyId }
    });

    res.status(200).json({
        status: 'success',
        imagens: updatedImagens
    });
});

exports.editaDescricaoImagem = asyncErrorHandler(async (req, res, next) => {
    const familyId = req.params.id;
    const caminhoArquivo = req.body.caminhoArquivo;
    const novaDescricao = req.body.novaDescricao;

    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
        throw new CustomError('Família não encontrada!', 404);
    }

    await prisma.familyImage.updateMany({
        where: {
            familyId,
            caminho: caminhoArquivo
        },
        data: {
            descricao: novaDescricao
        }
    });

    const updatedImagens = await prisma.familyImage.findMany({
        where: { familyId }
    });

    res.status(200).json({
        status: 'success',
        imagens: updatedImagens
    });
});

// FUNÇÕES DE UPLOAD DE ARQUIVOS GERAIS
const storageArquivos = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "arquivos/");
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadArquivo = multer({ storage: storageArquivos });
exports.fazUploadArquivo = uploadArquivo;

exports.insereNovoArquivo = asyncErrorHandler(async (req, res, next) => {
    const familyId = req.params.id;
    const descricao = req.body.descricao || null;
    const arquivoPath = `/arquivos/${req.file.filename}`;

    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
        throw new CustomError("Família não encontrada!", 404);
    }

    await prisma.familyFile.create({
        data: {
            familyId,
            caminho: arquivoPath,
            descricao
        }
    });

    const updatedArquivos = await prisma.familyFile.findMany({
        where: { familyId }
    });

    res.status(200).json({
        status: 'success',
        arquivos: updatedArquivos
    });
});

exports.deletaArquivo = asyncErrorHandler(async (req, res, next) => {
    const familyId = req.params.id;
    const caminhoArquivo = req.body.caminhoArquivo;

    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
        throw new CustomError('Família não encontrada!', 404);
    }

    await prisma.familyFile.deleteMany({
        where: {
            familyId,
            caminho: caminhoArquivo
        }
    });

    fs.rm(`.${caminhoArquivo}`, (error) => {
        if (error) {
            throw new CustomError('Erro ao remover o arquivo do servidor', 400);
        }
    });

    const updatedArquivos = await prisma.familyFile.findMany({
        where: { familyId }
    });

    res.status(200).json({
        status: 'success',
        arquivos: updatedArquivos
    });
});

exports.editaDescricaoArquivo = asyncErrorHandler(async (req, res, next) => {
    const familyId = req.params.id;
    const caminhoArquivo = req.body.caminhoArquivo;
    const novaDescricao = req.body.novaDescricao;

    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
        throw new CustomError('Família não encontrada!', 404);
    }

    await prisma.familyFile.updateMany({
        where: {
            familyId,
            caminho: caminhoArquivo
        },
        data: {
            descricao: novaDescricao
        }
    });

    const updatedArquivos = await prisma.familyFile.findMany({
        where: { familyId }
    });

    res.status(200).json({
        status: 'success',
        arquivos: updatedArquivos
    });
});
