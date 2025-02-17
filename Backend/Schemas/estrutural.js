const mongoose = require('mongoose');


const estruturalSchema = new mongoose.Schema({

    problemasInsalubridade: {
        type: String
    },
    necessitaReparosEstrutural: {
        type: String
    },
    resolveProblemaNoProprioTerreno: {
        type: String
    },
    edificacaoEmAreaDeRisco: {
        type: String
    },
    numQuartos: {
        type: Number
    },
    superpopulacao: {
        type: Boolean
    },
    coabitacao: {
        type: Boolean
    },
    insercaoLote: {
        type: Number
    },
    fundacoes: {
        type: Number
    },
    estrutura: {
        type: Number
    },
    paredes: {
        type: Number
    },
    cobertura: {
        type: Number
    },
    esquadrias: {
        type: Number
    },
    hidrossanitario: {
        type: Number
    },
    eletrico: {
        type: Number
    },
    banheiros: {
        type: Number
    },
    cozinhaAreaDeServico: {
        type: Number
    },
    conforto: {
        type: Number
    },
    avaliacaoResidencia: {
        type: String
    },
    acompanhamentoPsicossocial: {
        type: String
    },
    circulacaoInternaSegura: {
        type: Boolean
    },
    avaliacaoInfraestruturaUrbana: {
        type: Number
    },
    avaliacaoAcessibilidadeTransporteLazerSaneamento: {
        type: String
    },
    opiniaoGeralDaCasa: {
        type: Number
    },
    diagnosticoPreliminar: {
        type: String
    },
    situacaoPositiva: {
        type: String
    },
    observacoesGerais: {
        type: String
    },
    ultimaEdicao: {
        type: Date
    }
});


module.exports = estruturalSchema;