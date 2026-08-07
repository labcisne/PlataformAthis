const userTypeToPrisma = {
    'Administrador': 'Administrador',
    'Entrevistador': 'Entrevistador',
    'Morador': 'Morador',
    'Lider Comunitario': 'LiderComunitario'
};

const userTypeFromPrisma = {
    'Administrador': 'Administrador',
    'Entrevistador': 'Entrevistador',
    'Morador': 'Morador',
    'LiderComunitario': 'Lider Comunitario'
};

const securityQuestionToPrisma = {
    'Qual é o nome do seu animal de estimação?': 'ANIMAL_DE_ESTIMACAO',
    'Qual é a sua comida favorita?': 'COMIDA_FAVORITA',
    'Qual é o seu esporte favorito?': 'ESPORTE_FAVORITO'
};

const securityQuestionFromPrisma = {
    'ANIMAL_DE_ESTIMACAO': 'Qual é o nome do seu animal de estimação?',
    'COMIDA_FAVORITA': 'Qual é a sua comida favorita?',
    'ESPORTE_FAVORITO': 'Qual é o seu esporte favorito?'
};

/**
 * Traduz o tipoUsuario do formato Mongoose/Frontend para o formato Prisma.
 */
function mapUserTypeToPrismaVal(val) {
    return userTypeToPrisma[val] || val;
}

/**
 * Traduz o tipoUsuario do formato Prisma para o formato Mongoose/Frontend.
 */
function mapUserTypeFromPrismaVal(val) {
    return userTypeFromPrisma[val] || val;
}

/**
 * Traduz a perguntaSeguranca do formato Mongoose/Frontend para o formato Prisma.
 */
function mapSecurityQuestionToPrismaVal(val) {
    return securityQuestionToPrisma[val] || val;
}

/**
 * Traduz a perguntaSeguranca do formato Prisma para o formato Mongoose/Frontend.
 */
function mapSecurityQuestionFromPrismaVal(val) {
    return securityQuestionFromPrisma[val] || val;
}

/**
 * Formata um objeto de Usuário do Prisma para o formato esperado pelo Frontend (Mongoose-like).
 */
function formatUser(user) {
    if (!user) return null;
    return {
        _id: user.id,
        login: user.login,
        senha: user.senha,
        tipoUsuario: mapUserTypeFromPrismaVal(user.tipoUsuario),
        nome: user.nome,
        email: user.email,
        dataCadastro: user.dataCadastro,
        familiasAssociadas: user.memberships ? user.memberships.map(m => m.familyId) : [],
        tokenResetSenha: user.tokenResetSenha,
        tokenResetSenhaExpira: user.tokenResetSenhaExpira,
        senhaAlteradaEm: user.senhaAlteradaEm,
        ultimaModificacao: user.ultimaModificacao,
        perguntaSeguranca: mapSecurityQuestionFromPrismaVal(user.perguntaSeguranca),
        respostaSeguranca: user.respostaSeguranca
    };
}

/**
 * Formata um objeto de Família do Prisma para o formato esperado pelo Frontend (Mongoose-like).
 */
function castAnswerValue(value, type) {
    if (value === null || value === undefined || value === "") return null;
    if (type === 'number') {
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
    }
    if (type === 'resposta_multipla') {
        try {
            if (value.startsWith('[') && value.endsWith(']')) {
                return JSON.parse(value);
            }
        } catch (e) {
            // Not JSON
        }
        if (value.includes(',')) {
            return value.split(',').map(s => s.trim());
        }
        return [value];
    }
    return value;
}

/**
 * Formata um objeto de Família do Prisma para o formato esperado pelo Frontend (Mongoose-like).
 */
function formatFamily(family) {
    if (!family) return null;

    const tabelaSocioeconomica = {};
    const tabelaEstrutural = {};
    let socioeconomicaUserId = null;
    let estruturalUserId = null;

    if (family.answers) {
        family.answers.forEach(answer => {
            const question = answer.pergunta;
            if (question) {
                if (question.formulario === 'Facilities') {
                    tabelaSocioeconomica[question.codigo] = castAnswerValue(answer.resposta, question.tipo);
                    if (answer.userId) socioeconomicaUserId = answer.userId;
                } else if (question.formulario === 'Edificacoes') {
                    tabelaEstrutural[question.codigo] = castAnswerValue(answer.resposta, question.tipo);
                    if (answer.userId) estruturalUserId = answer.userId;
                }
            }
        });
    }

    if (Object.keys(tabelaSocioeconomica).length > 0) {
        tabelaSocioeconomica.userId = socioeconomicaUserId;
        tabelaSocioeconomica.familyId = family.id;
        tabelaSocioeconomica._id = family.id;
    }
    if (Object.keys(tabelaEstrutural).length > 0) {
        tabelaEstrutural.userId = estruturalUserId;
        tabelaEstrutural.familyId = family.id;
        tabelaEstrutural._id = family.id;
    }

    return {
        _id: family.id,
        dadosFamilia: family.dadosPessoais || null,
        localizacaoFamilia: family.localizacao || null,
        tabelaSocioeconomica: Object.keys(tabelaSocioeconomica).length > 0 ? tabelaSocioeconomica : (family.socioeconomica || null),
        tabelaEstrutural: Object.keys(tabelaEstrutural).length > 0 ? tabelaEstrutural : (family.estrutural || null),
        imagens: family.imagens || [],
        arquivos: family.arquivos || [],
        usuariosAssociados: family.memberships ? family.memberships.map(m => m.userId) : []
    };
}

module.exports = {
    mapUserTypeToPrisma: mapUserTypeToPrismaVal,
    mapUserTypeFromPrisma: mapUserTypeFromPrismaVal,
    mapSecurityQuestionToPrisma: mapSecurityQuestionToPrismaVal,
    mapSecurityQuestionFromPrisma: mapSecurityQuestionFromPrismaVal,
    formatUser,
    formatFamily
};
