const prisma = require("../Utils/prisma");
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');
const multer = require('multer');
const path = require('node:path');
const crypto = require('node:crypto');
const { ZipArchive } = require('archiver');
const MinioStorageService = require('../Services/storage/MinioStorageService');

const { hashSenha, hashRespostaSeguranca } = require("../Utils/userHelpers");
const { formatFamily } = require("../Utils/mapper");

const storage = new MinioStorageService();

function storageKeyFromPath(filePath) {
    return filePath.replace(/^\//, '');
}

function createStoragePath(folder, originalName) {
    return `/${folder}/${crypto.randomUUID()}${path.extname(originalName)}`;
}

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
            edificacoes: {
                include: {
                    respostas: {
                        include: {
                            pergunta: true
                        }
                    }
                }
            },
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

exports.listarImagensEdificacoes = asyncErrorHandler(async (req, res) => {
    const family = await prisma.family.findUnique({
        where: { id: req.params.id },
        select: {
            id: true,
            edificacoes: {
                select: {
                    id: true,
                    imagens: {
                        select: {
                            id: true,
                            tipo: true,
                            storageKey: true,
                            nomeOriginal: true,
                            mimeType: true,
                            descricao: true
                        }
                    }
                }
            }
        }
    });

    if (!family) throw new CustomError('Familia não existe!', 404);

    const imagens = (await Promise.all(family.edificacoes.flatMap(edificacao => (
        edificacao.imagens.map(async imagem => ({
            id: imagem.id,
            edificacaoId: edificacao.id,
            tipo: imagem.tipo || 'OUTROS',
            descricao: imagem.descricao,
            nomeOriginal: imagem.nomeOriginal,
            imagemUrl: imagem.storageKey
                ? `/familia/imagens-edificacoes/${family.id}/${imagem.id}/file`
                : null
        }))
    )))).filter(imagem => imagem.imagemUrl);

    res.status(200).json({
        imagens,
        edificacoes: family.edificacoes.map(edificacao => ({ id: edificacao.id }))
    });
});

exports.serveImagemEdificacao = asyncErrorHandler(async (req, res, next) => {
    const imagem = await prisma.imagem.findFirst({
        where: {
            id: req.params.imageId,
            edificacao: { familyId: req.params.familyId }
        },
        select: { id: true, storageKey: true, mimeType: true, nomeOriginal: true }
    });

    if (!imagem || !imagem.storageKey) throw new CustomError('Imagem da edificação não encontrada!', 404);

    const file = await storage.getFile(imagem.storageKey);
    if (imagem.mimeType) res.type(imagem.mimeType);
    if (req.query.download === '1') {
        const fallbackExtension = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp' }[imagem.mimeType] || '.bin';
        const filename = path.basename(imagem.nomeOriginal || `${imagem.id}${fallbackExtension}`).replace(/["\r\n]/g, '_');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }
    file.on('error', next);
    file.pipe(res);
});

exports.baixarImagensEdificacaoZip = asyncErrorHandler(async (req, res) => {
    const imagens = await prisma.imagem.findMany({
        where: {
            tipo: req.params.tipo,
            storageKey: { not: null },
            edificacao: { familyId: req.params.familyId }
        },
        select: { id: true, storageKey: true, nomeOriginal: true, mimeType: true },
        orderBy: { id: 'asc' }
    });

    if (!imagens.length) throw new CustomError('Nenhuma foto encontrada nesta categoria.', 404);

    const arquivos = [];
    const nomesUsados = new Map();
    for (const imagem of imagens) {
        let content;
        try {
            const file = await storage.getFile(imagem.storageKey);
            const chunks = [];
            for await (const chunk of file) chunks.push(chunk);
            content = Buffer.concat(chunks);
        } catch (error) {
            throw new CustomError(`Não foi possível ler a foto ${imagem.id} no armazenamento.`, 502);
        }
        if (!content.length) throw new CustomError(`A foto ${imagem.id} está vazia e o ZIP não pôde ser criado.`, 502);

        const fallbackExtension = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp' }[imagem.mimeType] || '.bin';
        const baseName = path.basename(imagem.nomeOriginal || `${imagem.id}${fallbackExtension}`).replace(/[\\/:*?"<>|\r\n]/g, '_');
        const count = (nomesUsados.get(baseName) || 0) + 1;
        nomesUsados.set(baseName, count);
        const extension = path.extname(baseName);
        const name = count === 1 ? baseName : `${path.basename(baseName, extension)}-${count}${extension}`;
        arquivos.push({ name, content });
    }

    res.status(200);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="fotos-${req.params.tipo.toLowerCase()}.zip"`);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    archive.pipe(res);
    arquivos.forEach(arquivo => archive.append(arquivo.content, { name: arquivo.name }));
    await new Promise((resolve, reject) => {
        archive.once('error', reject);
        res.once('error', reject);
        res.once('finish', resolve);

        // Archiver's finalize() starts the ZIP stream; it does not provide
        // a Promise to await. Wait for the HTTP response to finish instead.
        archive.finalize();
});
});

exports.deletaImagemEdificacao = asyncErrorHandler(async (req, res) => {
    const imagem = await prisma.imagem.findFirst({
        where: {
            id: req.params.imageId,
            edificacao: { familyId: req.params.familyId }
        },
        select: { id: true, storageKey: true }
    });

    if (!imagem) throw new CustomError('Imagem da edificação não encontrada!', 404);
    if (!imagem.storageKey) throw new CustomError('Imagem não possui objeto armazenado no MinIO!', 409);

    await storage.deleteFile(imagem.storageKey);
    try {
        await prisma.imagem.delete({ where: { id: imagem.id } });
    } catch (error) {
        throw new CustomError('O objeto foi removido, mas o registro não pôde ser atualizado.', 502);
    }

    res.status(200).json({ status: 'success', imageId: imagem.id });
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
const uploadImagem = multer({ storage: multer.memoryStorage() });
exports.fazUploadImagem = uploadImagem;

exports.uploadImagemEdificacao = asyncErrorHandler(async (req, res) => {
    if (!req.file) throw new CustomError('Imagem não enviada!', 400);

    const tiposPermitidos = new Set([
        'FUNDACAO', 'LOCALIZACAO', 'ESTRUTURA', 'VEDACOES', 'COBERTURA',
        'ESQUADRIAS', 'HIDROSANITARIO', 'ELETRICO', 'BANHEIROS',
        'COZINHA_SERVICO', 'OUTROS'
    ]);
    const tipo = String(req.params.tipo || '').toUpperCase();
    if (!tiposPermitidos.has(tipo)) throw new CustomError('Categoria de imagem inválida!', 400);

    const edificacao = await prisma.edificacao.findFirst({
        where: { id: req.params.edificacaoId, familyId: req.params.familyId },
        select: { id: true, familyId: true }
    });
    if (!edificacao) throw new CustomError('Edificação não pertence à família informada!', 404);

    const extension = path.extname(req.file.originalname || '').toLowerCase() || '.bin';
    const storageKey = `families/${edificacao.familyId}/edificacoes/${edificacao.id}/images/${crypto.randomUUID()}${extension}`;
    await storage.uploadFile({
        content: req.file.buffer,
        storageKey,
        contentType: req.file.mimetype,
        size: req.file.size
    });

    try {
        const imagem = await prisma.imagem.create({
            data: {
                edificacaoId: edificacao.id,
                tipo,
                storageKey,
                nomeOriginal: req.file.originalname,
                mimeType: req.file.mimetype,
                tamanho: req.file.size,
                origem: 'Athis'
            },
            select: { id: true, tipo: true, descricao: true }
        });
        res.status(201).json({
            ...imagem,
            edificacaoId: edificacao.id,
            imagemUrl: `/familia/imagens-edificacoes/${edificacao.familyId}/${imagem.id}/file`
        });
    } catch (error) {
        await storage.deleteFile(storageKey).catch(() => {});
        throw new CustomError('Não foi possível registrar a imagem após o upload.', 502);
    }
});

exports.insereNovaImagem = asyncErrorHandler(async (req, res, next) => {
    const familyId = req.params.id;
    const descricao = req.body.descricao || null;
    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
        throw new CustomError('Família não encontrada!', 404);
    }

    const imagePath = createStoragePath('imagens', req.file.originalname);
    await storage.uploadFile({
        content: req.file.buffer,
        storageKey: storageKeyFromPath(imagePath),
        contentType: req.file.mimetype,
        size: req.file.size
    });

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

    await storage.deleteFile(storageKeyFromPath(caminhoArquivo));

    await prisma.familyImage.deleteMany({
        where: {
            familyId,
            caminho: caminhoArquivo
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

exports.serveImagem = asyncErrorHandler(async (req, res) => {
    const file = await storage.getFile(`imagens/${req.params.filename}`);
    res.type(path.extname(req.params.filename));
    file.pipe(res);
});

// FUNÇÕES DE UPLOAD DE ARQUIVOS GERAIS
const uploadArquivo = multer({ storage: multer.memoryStorage() });
exports.fazUploadArquivo = uploadArquivo;

exports.insereNovoArquivo = asyncErrorHandler(async (req, res, next) => {
    const familyId = req.params.id;
    const descricao = req.body.descricao || null;
    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
        throw new CustomError("Família não encontrada!", 404);
    }

    const arquivoPath = createStoragePath('arquivos', req.file.originalname);
    await storage.uploadFile({
        content: req.file.buffer,
        storageKey: storageKeyFromPath(arquivoPath),
        contentType: req.file.mimetype,
        size: req.file.size
    });

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

    await storage.deleteFile(storageKeyFromPath(caminhoArquivo));

    await prisma.familyFile.deleteMany({
        where: {
            familyId,
            caminho: caminhoArquivo
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

exports.serveArquivo = asyncErrorHandler(async (req, res) => {
    const file = await storage.getFile(`arquivos/${req.params.filename}`);
    res.type(path.extname(req.params.filename));
    file.pipe(res);
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
