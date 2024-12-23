const mongoose = require('mongoose');


const facilitiesSchema = new mongoose.Schema({

    numLevantamento: {
        type: Number
    },
    tipoLevantemento: {
        type: String
    },
    numMoradores: {
        type: Number
    },
    idadeResidentes: {
        type: String
    },
    adultosEmpregados: {
        type: Boolean
    },
    extraSobreEmpregados: {
        type: String
    },
    rendaMensalTotal: {
        type: Number
    },
    mulherChefeFamilia: {
        type: Boolean
    },
    familiaChefiadaMaeSolo: {
        type: Boolean
    },
    familiaChefiadaIdoso: {
        type: Boolean
    },
    numCriancas: {
        type: Number
    },
    autoDeclaracaoFamilia: {
        type: String
    },
    cadastradaBolsaFamilia: {
        type: Boolean
    },
    numNis: {
        type: String
    },
    comorbidadeNaFamilia: {
        type: Boolean
    },
    recebeBPC: {
        type: Boolean
    },
    qualComorbidade: {
        type: String
    },
    apresentaDoencaRespiratoria: {
        type: Boolean
    },
    formaAquisicaoImovel: {
        type: String
    },
    anoDeConstrucaoTempoResidindo: {
        type: String
    },
    possuiOutroImovel: {
        type: String
    },
    resideNoImovelLevantado: {
        type: Boolean
    },
    qualValorAluguel: {
        type: Number
    },
    relacaoAluguelRenda: {
        type: Number
    },
    imovelTeveAcaoAnterior: {
        type: String
    },
    boaVivenciaVizinhos: {
        type: Boolean
    },
    participaReuniaoAcaoComunidade: {
        type: Boolean
    },
    utilizaBancoComunitario: {
        type: Boolean
    },
    indicacaoDeProfissionais: {
        type: String
    },
    pontoProximoEntrega: {
        type: String
    },
    recebeBoletoAguaEnergia: {
        type: String
    },
    possuiReservatorioAgua: {
        type: String
    },
    estadoReservatorioAgua: {
        type: String
    },
    espacoParaHortasCanteiro: {
        type: Boolean
    },
    possuiBanheiro: {
        type: Boolean
    },
    possuiCozinha: {
        type: Boolean
    },
    dataPrimeiraVisita: {
        type: Date
    },
    nomeResponsavelFormulario: {
        type: String
    },
    nomeResponsavelFotografico: {
        type: String
    },
    nomeResponsavelLevArquitetonico: {
        type: String
    },
    nomeAgenteComunitario: {
        type: String
    },
    outrosProfissionaisEnvolvidos: {
        type: String
    },
    demandaDaFamilia: {
        type: String
    },
    ultimaEdicao: {
        type: Date
    }
});


module.exports = facilitiesSchema;