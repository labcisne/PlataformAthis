import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


function DadosFacilities(){

    const [facilities, setFacilities] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    useEffect(() => {

        axios.get(`http://localhost:3000/familia/${familiaId}`, {withCredentials:true})
        .then((response) => setFacilities(response.data.familia.tabelaSocioeconomica))
        .catch((error) => console.log(error))
    }, [])

    return (
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia", {state: {id: familiaId, role}})}>
                ⬅
            </button>
            <div className="detailsContainer">
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>ID Levantamento: </span>
                <p className="detailsData">{facilities ? facilities._id : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Tipo de Levantamento: </span>
                <p className="detailsData">{facilities ? facilities.tipoLevantamento : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Número de Moradores: </span>
                <p className="detailsData">{facilities ? facilities.numMoradores : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Idade dos Residentes: </span>
                <p className="detailsData">{facilities ? facilities.idadeResidentes : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Adultos Empregados: </span>
                <p className="detailsData">{facilities ? facilities.adultosEmpregados : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Renda Mensal Total: </span>
                <p className="detailsData">{facilities ? `R$ ${facilities.rendaMensalTotal}` : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Mulher Como Chefe de Família: </span>
                <p className="detailsData">{facilities ? facilities.mulherChefeFamilia : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Idoso Como Chefe de Família: </span>
                <p className="detailsData">{facilities ? facilities.idosoChefeFamilia : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Número de Crianças: </span>
                <p className="detailsData">{facilities ? facilities.numCriancas : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Auto Declaração da Família: </span>
                <p className="detailsData">{facilities ? facilities.autoDeclaracaoFamilia : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Familia Cadastrada no Bolsa Familia: </span>
                <p className="detailsData">{facilities ? facilities.cadastradaBolsaFamilia : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Familia Apresenta Alguma Comorbidade: </span>
                <p className="detailsData">{facilities ? facilities.comorbidadeNaFamilia : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Familia Apresenta Doença Respiratória: </span>
                <p className="detailsData">{facilities ? facilities.apresentaDoencaRespiratoria : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Forma de Aquisição do Imóvel: </span>
                <p className="detailsData">{facilities ? facilities.formaAquisicaoImovel : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Ano de Construção ou Tempo Residindo: </span>
                <p className="detailsData">{facilities ? facilities.anoDeConstrucaoTempoResidindo : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Família Possui Outro Imóvel: </span>
                <p className="detailsData">{facilities ? facilities.possuiOutroImovel : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Família Reside no Imóvel Levantado: </span>
                <p className="detailsData">{facilities ? facilities.resideNoImovelLevantado : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Qual o Valor do Aluguel: </span>
                <p className="detailsData">{facilities?.qualValorAluguel ? `R$ ${facilities.qualValorAluguel}` : "Família não mora de Aluguel"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Relação Aluguel / Renda: </span>
                <p className="detailsData">{facilities ? facilities.relacaoAluguelRenda : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Imóvel Teve Ação Anterior: </span>
                <p className="detailsData">{facilities ? facilities.imovelTeveAcaoAnterior : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Possui Boa Vivencia com Vizinhos: </span>
                <p className="detailsData">{facilities ? facilities.boaVivenciaVizinhos : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Participa de Reuniões e Ações da Comunidade: </span>
                <p className="detailsData">{facilities ? facilities.participaReuniaoAcaoComunidade : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Família Utiliza Banco Comunitário: </span>
                <p className="detailsData">{facilities ? facilities.utilizaBancoComunitario: "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Indicação de Profissionais: </span>
                <p className="detailsData">{facilities ? facilities.indicacaoDeProfissionais : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Ponto Próximo Para Entrega de Materiais: </span>
                <p className="detailsData">{facilities ? facilities.pontoProximoEntrega : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Família Recebe Boleto Água e Energia: </span>
                <p className="detailsData">{facilities ? facilities.recebeBoletoAguaEnergia : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Família Possui Reservatório de Água: </span>
                <p className="detailsData">{facilities ? facilities.possuiReservatorioAgua: "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Estado do Reservatório de Água: </span>
                <p className="detailsData">{facilities ? facilities.estadoReservatorioAgua : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Casa Possui Espaço de Hortas e Canteiros: </span>
                <p className="detailsData">{facilities ? facilities.espacoParaHortasCanteiro : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Casa Possui Banheiro: </span>
                <p className="detailsData">{facilities ? facilities.possuiBanheiro : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Casa Possui Cozinha: </span>
                <p className="detailsData">{facilities ? facilities.possuiCozinha : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Data da Primeira Visita: </span>
                <p className="detailsData">{facilities ? `${facilities.dataPrimeiraVisita.slice(8, 10)}/${facilities.dataPrimeiraVisita.slice(5, 7)}/${facilities.dataPrimeiraVisita.slice(0, 4)}` : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Responsável Pelo Formulário: </span>
                <p className="detailsData">{facilities ? facilities.nomeResponsavelFormulario : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Responsável Fotográfico: </span>
                <p className="detailsData">{facilities ? facilities.nomeResponsavelFotografico : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Responsável Arquitetônico: </span>
                <p className="detailsData">{facilities ? facilities.nomeResponsavelArquitetonico : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Agente Comunitário: </span>
                <p className="detailsData">{facilities ? facilities.nomeAgenteComunitario : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Outros Profissionais Envolvidos: </span>
                <p className="detailsData">{facilities ? facilities.outrosProfissionaisEnvolvidos : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Demanda da Família: </span>
                <p className="detailsData">{facilities ? facilities.demandaDaFamilia : "Loading..."}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Descrição das Pendências: </span>
                <p className="detailsData">{facilities ? facilities.descricaoPendencias : "Loading..."}</p>
            </div>
        </div>
    )
}


export default DadosFacilities;