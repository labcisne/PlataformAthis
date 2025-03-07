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
        type: String
    },
    rendaMensalTotal: {
        type: Number
    },
    mulherChefeFamilia: {
        type: String
    },
    idosoChefeFamilia: {
        type: String
    },
    numCriancas: {
        type: Number
    },
    autoDeclaracaoFamilia: {
        type: String
    },
    cadastradaBolsaFamilia: {
        type: String
    },
    comorbidadeNaFamilia: {
        type: String
    },
    apresentaDoencaRespiratoria: {
        type: String
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
        type: String
    },
    qualValorAluguel: {
        type: Number
    },
    relacaoAluguelRenda: {
        type: String
    },
    imovelTeveAcaoAnterior: {
        type: String
    },
    boaVivenciaVizinhos: {
        type: String
    },
    participaReuniaoAcaoComunidade: {
        type: String
    },
    utilizaBancoComunitario: {
        type: String
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
        type: String
    },
    possuiBanheiro: {
        type: String
    },
    possuiCozinha: {
        type: String
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
    nomeResponsavelArquitetonico: {
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
    descricaoPendencias: {
        type: String
    },
    /*ultimaEdicao: {
        type: Date
    }*/
});


module.exports = facilitiesSchema;