const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');

const userSchema = new mongoose.Schema({

    login: {
        type: String,
        unique: true,
        required: [true, 'Login é um campo obrigatório.']
    },
    senha: {
        type: String,
        required: [true, 'Senha é um campo obrigatório.'],
        minLength: [8, 'A senha precisa ter, ao menos, 8 caracteres.'],
        select: false
    },
    confirmarSenha: {
        type: String,
        required: [true, 'É necessário confirmar a senha.'],
        validate: {
            validator: function(value){
                return value === this.senha;
            },
            message: 'As senhas não são iguais.'
        }
    },
    tipoUsuario: {
        type: String,
        enum: ['Administrador', 'Entrevistador', 'Morador', 'Lider Comunitario'],
        required: [true, 'Tipo de usuário é um campo obrigatório.']
    },
    nome: {
        type: String,
        required: [true, 'Nome é um campo obrigatório.']
    },
    email: {
        type: String,
    },
    dataCadastro: {
        type: Date,
        default: Date.now(),
        select: false
    },
    familiasAssociadas: {
        type: [String],
        default: []
    },
    tokenResetSenha: {
        type: String
    },
    tokenResetSenhaExpira: {
        type: Date
    },
    senhaAlteradaEm: {
        type: Date
    },
    ultimaModificacao: {
        type: Date
    },
    perguntaSeguranca: {
        type: String,
        required: [true, 'É necessário informar a pergunta de recuperação de senha!'],
        enum: ['Qual é o nome do seu animal de estimação?',
               'Qual é a sua comida favorita?',
               'Qual é o seu esporte favorito?'],
        select: false
    },
    respostaSeguranca: {
        type: String,
        required: [true, 'É necessário informar a resposta de recuperação de senha!'],
        select: false
    },
});


userSchema.pre('save', async function(next){
    if(!this.isModified('senha')){ //verifica se houve mudança na senha, seja no create ou update.
        return next();
    }
    this.senha = await bcrypt.hash(this.senha, 12);
    this.confirmarSenha = undefined;
    if(this.isModified('respostaSeguranca')){
        this.respostaSeguranca = await bcrypt.hash(this.respostaSeguranca, 12);
    }
    next();
});


userSchema.methods.verificaSenha = async function(senha, senhaCripto){
    return await bcrypt.compare(senha, senhaCripto);
}


userSchema.methods.mudouSenhaRecentemente = function(instanteCriacaoToken){


    if(this.senhaAlteradaEm){
        const instanteDaAlteracaoSenha = parseInt(this.senhaAlteradaEm.getTime() / 1000, 10);
        return instanteDaAlteracaoSenha > instanteCriacaoToken;
    }
    return false;
}


userSchema.methods.geraTokenResetSenha = function(){

    const resetToken = crypto.randomBytes(32).toString('hex');
    this.tokenResetSenha = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.tokenResetSenhaExpira = Date.now() + (10 * 60 * 1000);

    return resetToken;
}


const User = mongoose.model('User', userSchema);

module.exports = User;