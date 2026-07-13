const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');

/**
 * Gera o hash de uma senha.
 * @param {string} senha 
 * @returns {Promise<string>}
 */
async function hashSenha(senha) {
    return await bcrypt.hash(senha, 12);
}

/**
 * Gera o hash da resposta de segurança.
 * @param {string} resposta 
 * @returns {Promise<string>}
 */
async function hashRespostaSeguranca(resposta) {
    return await bcrypt.hash(resposta, 12);
}

/**
 * Verifica se a senha fornecida coincide com a criptografada.
 * @param {string} senha 
 * @param {string} senhaCripto 
 * @returns {Promise<boolean>}
 */
async function verificaSenha(senha, senhaCripto) {
    return await bcrypt.compare(senha, senhaCripto);
}

/**
 * Verifica se o usuário mudou a senha após a emissão do token JWT.
 * @param {Date|null|undefined} senhaAlteradaEm 
 * @param {number} instanteCriacaoToken (iat)
 * @returns {boolean}
 */
function mudouSenhaRecentemente(senhaAlteradaEm, instanteCriacaoToken) {
    if (senhaAlteradaEm) {
        const instanteDaAlteracaoSenha = parseInt(senhaAlteradaEm.getTime() / 1000, 10);
        return instanteDaAlteracaoSenha > instanteCriacaoToken;
    }
    return false;
}

/**
 * Gera um token de reset de senha e retorna tanto o token limpo quanto o hash e a expiração.
 * @returns {{ resetToken: string, tokenResetSenha: string, tokenResetSenhaExpira: Date }}
 */
function geraTokenResetSenha() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenResetSenha = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenResetSenhaExpira = new Date(Date.now() + (10 * 60 * 1000));

    return {
        resetToken,
        tokenResetSenha,
        tokenResetSenhaExpira
    };
}

module.exports = {
    hashSenha,
    hashRespostaSeguranca,
    verificaSenha,
    mudouSenhaRecentemente,
    geraTokenResetSenha
};
