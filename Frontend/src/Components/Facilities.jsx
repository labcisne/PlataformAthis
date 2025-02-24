import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Select from "./Select";
import BotoesSelecionaveis from "./BotoesSelecionaveis";

function Entrevista(){

    const location = useLocation();
    const navigate = useNavigate();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    const [tipoLevantamento, setTipoLevantamento] = useState("");
    const [numMoradores, setNumMoradores] = useState("0");
    const [idadeResidentes, setIdadeResidentes] = useState("");
    const [adultosEmpregados, setAdultosEmpregados] = useState("");
    const [rendaMensalTotal, setRendaMensalTotal] = useState("");
    const [mulherChefeFamilia, setMulherChefeFamilia] = useState("");
    const [idosoChefeFamilia, setIdosoChefeFamilia] = useState("");
    const [numCriancas, setNumCriancas] = useState("0");
    const [autoDeclaracaoFamilia, setAutoDeclaracaoFamilia] = useState("");
    const [cadastradaBolsaFamilia, setCadastradaBolsaFamilia] = useState("");
    const [comorbidadeNaFamilia, setComorbidadeNaFamilia] = useState("");
    const [apresentaDoencaRespiratoria, setApresentaDoencaRespiratoria] = useState("");
    const [formaAquisicaoImovel, setFormaAquisicaoImovel] = useState("");
    const [anoDeConstrucaoTempoResidindo, setAnoDeConstrucaoTempoResidindo] = useState("");
    const [possuiOutroImovel, setPossuiOutroImovel] = useState("");
    const [resideNoImovelLevantado, setResideNoImovelLevantado] = useState("");
    const [qualValorAluguel, setQualValorAluguel] = useState("");
    const [relacaoAluguelRenda, setRelacaoAluguelRenda] = useState("");
    const [imovelTeveAcaoAnterior, setImovelTeveAcaoAnterior] = useState("");
    const [boaVivenciaVizinhos, setBoaVivenciaVizinhos] = useState("");
    const [participaReuniaoAcaoComunidade, setParticipaReuniaoAcaoComunidade] = useState("");
    const [utilizaBancoComunitario, setUtilizaBancoComunitario] = useState("");
    const [indicacaoDeProfissionais, setIndicacaoDeProfissionais] = useState("");
    const [pontoProximoEntrega, setPontoProximoEntrega] = useState("");
    const [recebeBoletoAguaEnergia, setRecebeBoletoAguaEnergia] = useState("");
    const [possuiReservatorioAgua, setPossuiReservatorioAgua] = useState("");
    const [estadoReservatorioAgua, setEstadoReservatorioAgua] = useState("");
    const [espacoParaHortasCanteiro, setEspacoParaHortasCanteiro] = useState("");
    const [possuiBanheiro, setPossuiBanheiro] = useState("");
    const [possuiCozinha, setPossuiCozinha] = useState("");
    const [dataPrimeiraVisita, setDataPrimeiraVisita] = useState("");
    const [nomeResponsavelFormulario, setNomeResponsavelFormulario] = useState("");
    const [nomeResponsavelFotografico, setNomeResponsavelFotografico] = useState("");
    const [nomeResponsavelArquitetonico, setNomeResponsavelArquitetonico] = useState("");
    const [nomeAgenteComunitario, setNomeAgenteComunitario] = useState("");
    const [outrosProfissionaisEnvolvidos, setOutrosProfissionaisEnvolvidos] = useState("");
    const [demandaDaFamilia, setDemandaDaFamilia] = useState("");
    const [descricaoPendencias, setDescricaoPendencias] = useState("");
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(tipoLevantamento);
        console.log(numMoradores);
        console.log(idadeResidentes);
        console.log(adultosEmpregados);
        console.log(rendaMensalTotal);
        console.log(mulherChefeFamilia);
        console.log(idosoChefeFamilia);
        console.log(numCriancas);
        console.log(autoDeclaracaoFamilia);
        console.log(cadastradaBolsaFamilia);
        console.log(comorbidadeNaFamilia);
        console.log(apresentaDoencaRespiratoria);
        console.log(formaAquisicaoImovel);
        console.log(anoDeConstrucaoTempoResidindo);
        console.log(possuiOutroImovel);
        console.log(resideNoImovelLevantado);
        console.log(qualValorAluguel);
        console.log(relacaoAluguelRenda);
        console.log(imovelTeveAcaoAnterior);
        console.log(boaVivenciaVizinhos);
        console.log(participaReuniaoAcaoComunidade);
        console.log(utilizaBancoComunitario);
        console.log(indicacaoDeProfissionais);
        console.log(pontoProximoEntrega);
        console.log(recebeBoletoAguaEnergia);
        console.log(possuiReservatorioAgua);
        console.log(estadoReservatorioAgua);
        console.log(espacoParaHortasCanteiro);
        console.log(possuiBanheiro);
        console.log(possuiCozinha);
        console.log(dataPrimeiraVisita);
        console.log(nomeResponsavelFormulario);
        console.log(nomeResponsavelFotografico);
        console.log(nomeResponsavelArquitetonico);
        console.log(nomeAgenteComunitario);
        console.log(outrosProfissionaisEnvolvidos);
        console.log(demandaDaFamilia);
        console.log(descricaoPendencias);
    }

    return (

        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/entrevista", {state: {id: familiaId, role}})}>
                ⬅
            </button>
            <form action="#" onSubmit={handleSubmit}>

                <div className="celula">
                    <label>Esse levantamento se enquadra:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["Levantamento Projeto", "Levantamento PMV - Identificação", "Levantemento PMV - Demolição"]}
                        selecionado={tipoLevantamento}
                        setSelecionado={setTipoLevantamento}
                    />
                </div>

                <div className="celula">
                    <label>Nº de moradores:</label>
                    <input 
                        type="number" 
                        min={0}
                        value={numMoradores}
                        onChange={(event) => setNumMoradores(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Idade dos Residentes(ex: 3 moradores - 12, 20, 35):</label>
                    <input 
                        type="text"
                        value={idadeResidentes}
                        onChange={(event) => setIdadeResidentes(event.target.value)}
                        placeholder={numMoradores === "0" ? "12, 20, 30" : `Insira as ${numMoradores} idades!`}
                    />
                </div>

                <div className="celula">
                    <label>Os adultos da família estão empregados?</label>
                    <input 
                        type="text"
                        value={adultosEmpregados}
                        onChange={(event) => setAdultosEmpregados(event.target.value)}
                    />
                </div>
                
                <div className="celula">
                    <label>Qual a Renda mensal familiar total?</label>
                    <input 
                        type="text"
                        value={rendaMensalTotal}
                        onChange={(event) => setRendaMensalTotal(event.target.value)}
                        placeholder="R$ 0,00"
                    />
                </div>

                <div className="celula">
                    <label>Possui uma mulher como chefe de família?</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["Sim", "Não"]}
                        selecionado={mulherChefeFamilia}
                        setSelecionado={setMulherChefeFamilia}
                    />
                </div>

                <div className="celula">
                    <label>A familia é chefiada por pessoa idosa?</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["Sim", "Não"]}
                        selecionado={idosoChefeFamilia}
                        setSelecionado={setIdosoChefeFamilia}
                    />
                </div>

                <div className="celula">
                    <label>Qual o número de crianças morando na casa?</label>
                    <input 
                        type="number" 
                        min={0}
                        value={numCriancas}
                        onChange={(event) => setNumCriancas(event.target.value)}
                    />
                </div>
                
                <div className="celula">
                    <label>A família se autodeclara:</label>
                    <Select 
                        callback={setAutoDeclaracaoFamilia} 
                        name="autoDeclaracaoFamilia"
                    />
                </div>

                <div className="celula">
                    <label>A família está cadastrada no Bolsa Família? Qual o número do NIS?</label>
                    <input 
                        type="text"
                        value={cadastradaBolsaFamilia}
                        onChange={(event) => setCadastradaBolsaFamilia(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Algum membro da família apresenta alguma comorbidade ou Doença incapacitante? Alguém recebe algum Benefício de Prestação Continuada(BPC)?</label>
                    <input 
                        type="text"
                        value={comorbidadeNaFamilia}
                        onChange={(event) => setComorbidadeNaFamilia(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Alguém apresenta doenças respiratórias crônicas?</label>
                    <input 
                        type="text"
                        value={apresentaDoencaRespiratoria}
                        onChange={(event) => setApresentaDoencaRespiratoria(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Qual a forma de aquisição do imóvel?</label>
                    <Select 
                        callback={setFormaAquisicaoImovel} 
                        name="formaAquisicaoImovel"
                    />
                </div>

                <div className="celula">
                    <label>Sabem dizer em que ano a casa foi construída? Há quanto tempo residem neste imóvel?</label>
                    <input 
                        type="text"
                        value={anoDeConstrucaoTempoResidindo}
                        onChange={(event) => setAnoDeConstrucaoTempoResidindo(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>A família possui algum outro imóvel?</label>
                    <input 
                        type="text"
                        value={possuiOutroImovel}
                        onChange={(event) => setPossuiOutroImovel(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>A família está residindo no imóvel levantado?</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["Sim", "Não"]}
                        selecionado={resideNoImovelLevantado}
                        setSelecionado={setResideNoImovelLevantado}
                    />
                </div>
                
                <div className="celula">
                    <label>Se a família está morando de aluguel, qual o valor?</label>
                    <input 
                        type="text"
                        value={qualValorAluguel}
                        onChange={(event) => setQualValorAluguel(event.target.value)}
                        placeholder="R$ 0,00"
                    />
                </div>

                <div className="celula">
                    <label>O aluguel em relação a renda familiar mensal:</label>
                    <input //AJEITAR ESSE COMPONENTE!!!!!!
                        type="text"
                        value={relacaoAluguelRenda}
                        onChange={(event) => setRelacaoAluguelRenda(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>O imóvel já foi alvo de alguma ação anterior? (Quando / Como / Quem) </label>
                    <input 
                        type="text"
                        value={imovelTeveAcaoAnterior}
                        onChange={(event) => setImovelTeveAcaoAnterior(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Boa convivência com a vizinhança?</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["Sim", "Não"]}
                        selecionado={boaVivenciaVizinhos}
                        setSelecionado={setBoaVivenciaVizinhos}
                    />
                </div>
                
                <div className="celula">
                    <label>Participa das reuniões do Fórum Bem Maior e/ou das ações da comunidade?</label>
                    <input 
                        type="text"
                        value={participaReuniaoAcaoComunidade}
                        onChange={(event) => setParticipaReuniaoAcaoComunidade(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Utilização dos serviços do Banco Comunitário?</label>
                    <Select 
                        callback={setUtilizaBancoComunitario} 
                        name="utilizaBancoComunitario"
                    />
                </div>

                <div className="celula">
                    <label>Profissionais e lojas indicadas pela família:</label>
                    <input 
                        type="text"
                        value={indicacaoDeProfissionais}
                        onChange={(event) => setIndicacaoDeProfissionais(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Qual o ponto mais próximo de entrega de materiais?</label>
                    <input 
                        type="text"
                        value={pontoProximoEntrega}
                        onChange={(event) => setPontoProximoEntrega(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Estão recebendo boleto de cobrança (talão) de água e energia?</label>
                    <input 
                        type="text"
                        value={recebeBoletoAguaEnergia}
                        onChange={(event) => setRecebeBoletoAguaEnergia(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Possui reservatório de água na residência?</label>
                    <Select 
                        callback={setPossuiReservatorioAgua} 
                        name="possuiReservatorioAgua"
                    />
                </div>

                <div className="celula">
                    <label>Qual o estado do reservatório de água?</label>
                    <Select 
                        callback={setEstadoReservatorioAgua} 
                        name="estadoReservatorioAgua"
                    />
                </div>

                <div className="celula">
                    <label>Possui espaço para criação de hortas / canteiros?</label>
                    <Select 
                        callback={setEspacoParaHortasCanteiro} 
                        name="espacoParaHortasCanteiro"
                    />
                </div>

                <div className="celula">
                    <label>A unidade tem banheiro?</label>
                    <Select 
                        callback={setPossuiBanheiro} 
                        name="possuiBanheiro"
                    />
                </div>

                <div className="celula">
                    <label>A unidade tem cozinha?</label>
                    <Select 
                        callback={setPossuiCozinha} 
                        name="possuiCozinha"
                    />
                </div>
                
                <div className="celula">
                    <label>Data 1° visita:</label>
                        <input //DESCOBRIR UMA MANEIRA MELHOR PARA ESSE CAMPO
                            type="text"
                            value={dataPrimeiraVisita}
                            onChange={(event) => setDataPrimeiraVisita(event.target.value)}
                        />
                </div>

                <div className="celula">
                    <label>Nome do responsável pelo formulário:</label>
                        <input 
                            type="text"
                            value={nomeResponsavelFormulario}
                            onChange={(event) => setNomeResponsavelFormulario(event.target.value)}
                        />
                </div>

                <div className="celula">
                    <label>Nome do responsável pelo relatório fotográfico:</label>
                        <input 
                            type="text"
                            value={nomeResponsavelFotografico}
                            onChange={(event) => setNomeResponsavelFotografico(event.target.value)}
                        />
                </div>
                
                <div className="celula">
                    <label>Nome do responsável pelo levantamento arquitetônico:</label>
                        <input 
                            type="text"
                            value={nomeResponsavelArquitetonico}
                            onChange={(event) => setNomeResponsavelArquitetonico(event.target.value)}
                        />
                </div>

                <div className="celula">
                    <label>Nome do agente comunitário:</label>
                        <input 
                            type="text"
                            value={nomeAgenteComunitario}
                            onChange={(event) => setNomeAgenteComunitario(event.target.value)}
                        />
                </div>

                <div className="celula">
                    <label>Outros profissionais envolvidos(nomes e funções desempenhadas):</label>
                        <input 
                            type="text"
                            value={outrosProfissionaisEnvolvidos}
                            onChange={(event) => setOutrosProfissionaisEnvolvidos(event.target.value)}
                        />
                </div>

                <div className="celula">
                    <label>Demanda apresentada pela família:</label>
                        <input 
                            type="text"
                            value={demandaDaFamilia}
                            onChange={(event) => setDemandaDaFamilia(event.target.value)}
                        />
                </div>

                <div className="celula">
                    <label>Descrição das pendências:</label>
                        <input 
                            type="text"
                            value={descricaoPendencias}
                            onChange={(event) => setDescricaoPendencias(event.target.value)}
                        />
                </div>

                <div className="celula">
                        <input
                            id="acessar"
                            type="submit"
                            value="Enviar relatório"
                        />
                </div>
            </form>
        </div>
    )
}


export default Entrevista;