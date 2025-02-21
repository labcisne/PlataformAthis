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

    const [obj, setObj] = useState({
        numMoradores: "0",
        idadeResidentes: "",
        adultosEmpregados: "",
        rendaMensalTotal: "",
        mulherChefeFamilia: "",
        idosoChefeFamilia: "",
        numCriancas: "0",
        autoDeclaracaoFamilia: "",
        cadastradaBolsaFamilia: "",
        comorbidadeNaFamilia: "",
        apresentaDoencaRespiratoria: "",
        formaAquisicaoImovel: "",
        anoDeConstrucaoTempoResidindo: "",
        possuiOutroImovel: "",
        resideNoImovelLevantado: "",
        qualValorAluguel: "",
        relacaoAluguelRenda: "",
        imovelTeveAcaoAnterior: "",
        boaVivenciaVizinhos: "",
        participaReuniaoAcaoComunidade: "",
        utilizaBancoComunitario: "",
        indicacaoDeProfissionais: "",
        pontoProximoEntrega: "",
        recebeBoletoAguaEnergia: "",
        possuiReservatorioAgua: "",
        estadoReservatorioAgua: "",
        espacoParaHortasCanteiro: "",
        possuiBanheiro: "",
        possuiCozinha: "",
        dataPrimeiraVisita: "",
        nomeResponsavelFormulario: "",
        nomeResponsavelFotografico: "",
        nomeResponsavelArquitetonico: "",
        nomeAgenteComunitario: "",
        outrosProfissionaisEnvolvidos: "",
        demandaDaFamilia: "",
        descricaoPendencias: ""
    })

    const handleChange = (event) => {
        const {name, value} = event.target;
        setObj({...obj, [name]: value});
    }

    const handleSelectChange = (name, value) => {
        setObj({...obj, [name]: value});
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("gugu");
        //console.log(obj);
        console.log(tipoLevantamento);
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
                        value={obj.numMoradores}
                        name="numMoradores"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Idade dos Residentes(ex: 3 moradores - 12, 20, 35):</label>
                    <input 
                        type="text"
                        value={obj.idadeResidentes}
                        name="idadeResidentes"
                        onChange={(event) => handleChange(event)}
                        placeholder={obj.numMoradores === "0" ? "12, 20, 30" : `Insira as ${obj.numMoradores} idades!`}
                    />
                </div>

                <div className="celula">
                    <label>Os adultos da família estão empregados?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="adultosEmpregados"
                            value="true"
                            style={{backgroundColor: obj.adultosEmpregados === "true" ? "#F0A22E" : "#ffffff"}}
                            onClick={(event) => {
                                handleChange(event)
                                obj.adultosEmpregados === "true" ? console.log("gugu") : console.log("juju");
                            }}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="adultosEmpregados"
                            value="false"
                            onClick={(event) => handleChange(event)}
                            style={{backgroundColor: obj.adultosEmpregados === "false" ? "#F0A22E" : "#ffffff"}}
                        >
                            Não
                        </button>
                    </div>
                </div>
                
                <div className="celula">
                    <label>Qual a Renda mensal familiar total?</label>
                    <input 
                        type="text"
                        value={obj.rendaMensalTotal}
                        name="rendaMensalTotal"
                        onChange={(event) => handleChange(event)}
                        placeholder="R$ 0,00"
                    />
                </div>

                <div className="celula">
                    <label>Possui uma mulher como chefe de família?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="mulherChefeFamilia"
                            value="true"
                            onClick={(event) => handleChange(event)}
                            style={{backgroundColor: obj.mulherChefeFamilia === "true" ? "#F0A22E" : "#ffffff"}}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="mulherChefeFamilia"
                            value="false"
                            onClick={(event) => handleChange(event)}
                            style={{backgroundColor: obj.mulherChefeFamilia === "false" ? "#F0A22E" : "#ffffff"}}
                        >
                            Não
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>A familia é chefiada por pessoa idosa?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="idosoChefeFamilia"
                            value="true"
                            onClick={(event) => handleChange(event)}
                            style={{backgroundColor: obj.idosoChefeFamilia === "true" ? "#F0A22E" : "#ffffff"}}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="idosoChefeFamilia"
                            value="false"
                            onClick={(event) => handleChange(event)}
                            style={{backgroundColor: obj.idosoChefeFamilia === "false" ? "#F0A22E" : "#ffffff"}}
                        >
                            Não
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Qual o número de crianças morando na casa?</label>
                    <input 
                        type="number" 
                        min={0}
                        value={obj.numCriancas}
                        name="numCriancas"
                        onChange={(event) => handleChange(event)}
                    />
                </div>
                
                <div className="celula">
                    <label>A família se autodeclara:</label>
                    <Select 
                        callback={handleSelectChange} 
                        name="autoDeclaracaoFamilia"
                    />
                </div>

                <div className="celula">
                    <label>A família está cadastrada no Bolsa Família? Qual o número do NIS?</label>
                    <input 
                        type="text"
                        value={obj.cadastradaBolsaFamilia}
                        name="cadastradaBolsaFamilia"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Algum membro da família apresenta alguma comorbidade ou Doença incapacitante? Alguém recebe algum Benefício de Prestação Continuada(BPC)?</label>
                    <input 
                        type="text"
                        value={obj.comorbidadeNaFamilia}
                        name="comorbidadeNaFamilia"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Alguém apresenta doenças respiratórias crônicas?</label>
                    <input 
                        type="text"
                        value={obj.apresentaDoencaRespiratoria}
                        name="apresentaDoencaRespiratoria"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Qual a forma de aquisição do imóvel?</label>
                    <Select 
                        callback={handleSelectChange} 
                        name="formaAquisicaoImovel"
                    />
                </div>

                <div className="celula">
                    <label>Sabem dizer em que ano a casa foi construída? Há quanto tempo residem neste imóvel?</label>
                    <input 
                        type="text"
                        value={obj.anoDeConstrucaoTempoResidindo}
                        name="anoDeConstrucaoTempoResidindo"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>A família possui algum outro imóvel?</label>
                    <input 
                        type="text"
                        value={obj.possuiOutroImovel}
                        name="possuiOutroImovel"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>A família está residindo no imóvel levantado?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="resideNoImovelLevantado"
                            value="true"
                            onClick={(event) => handleChange(event)}
                            style={{backgroundColor: obj.resideNoImovelLevantado === "true" ? "#F0A22E" : "#ffffff"}}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="resideNoImovelLevantado"
                            value="false"
                            onClick={(event) => handleChange(event)}
                            style={{backgroundColor: obj.resideNoImovelLevantado === "false" ? "#F0A22E" : "#ffffff"}}
                        >
                            Não
                        </button>
                    </div>
                </div>
                
                <div className="celula">
                    <label>Se a família está morando de aluguel, qual o valor?</label>
                    <input 
                        type="text"
                        value={obj.qualValorAluguel}
                        name="qualValorAluguel"
                        onChange={(event) => handleChange(event)}
                        placeholder="R$ 0,00"
                    />
                </div>

                <div className="celula">
                    <label>O aluguel em relação a renda familiar mensal:</label>
                    <input 
                        type="text"
                        value={obj.relacaoAluguelRenda}
                        name="relacaoAluguelRenda"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>O imóvel já foi alvo de alguma ação anterior? (Quando / Como / Quem) </label>
                    <input 
                        type="text"
                        value={obj.imovelTeveAcaoAnterior}
                        name="imovelTeveAcaoAnterior"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Boa convivência com a vizinhança?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="boaVivenciaVizinhos"
                            value="true"
                            onClick={(event) => handleChange(event)}
                            style={{backgroundColor: obj.boaVivenciaVizinhos === "true" ? "#F0A22E" : "#ffffff"}}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="boaVivenciaVizinhos"
                            value="false"
                            onClick={(event) => handleChange(event)}
                            style={{backgroundColor: obj.boaVivenciaVizinhos === "false" ? "#F0A22E" : "#ffffff"}}
                        >
                            Não
                        </button>
                    </div>
                </div>
                
                <div className="celula">
                    <label>Participa das reuniões do Fórum Bem Maior e/ou das ações da comunidade?</label>
                    <input 
                        type="text"
                        value={obj.participaReuniaoAcaoComunidade}
                        name="participaReuniaoAcaoComunidade"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Utilização dos serviços do Banco Comunitário?</label>
                    <Select 
                        callback={handleSelectChange} 
                        name="utilizaBancoComunitario"
                    />
                </div>

                <div className="celula">
                    <label>Profissionais e lojas indicadas pela família:</label>
                    <input 
                        type="text"
                        value={obj.indicacaoDeProfissionais}
                        name="indicacaoDeProfissionais"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Qual o ponto mais próximo de entrega de materiais?</label>
                    <input 
                        type="text"
                        value={obj.pontoProximoEntrega}
                        name="pontoProximoEntrega"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Estão recebendo boleto de cobrança (talão) de água e energia?</label>
                    <input 
                        type="text"
                        value={obj.recebeBoletoAguaEnergia}
                        name="recebeBoletoAguaEnergia"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Possui reservatório de água na residência?</label>
                    <Select 
                        callback={handleSelectChange} 
                        name="possuiReservatorioAgua"
                    />
                </div>

                <div className="celula">
                    <label>Qual o estado do reservatório de água?</label>
                    <Select 
                        callback={handleSelectChange} 
                        name="estadoReservatorioAgua"
                    />
                </div>

                <div className="celula">
                    <label>Possui espaço para criação de hortas / canteiros?</label>
                    <Select 
                        callback={handleSelectChange} 
                        name="espacoParaHortasCanteiro"
                    />
                </div>

                <div className="celula">
                    <label>A unidade tem banheiro?</label>
                    <Select 
                        callback={handleSelectChange} 
                        name="possuiBanheiro"
                    />
                </div>

                <div className="celula">
                    <label>A unidade tem cozinha?</label>
                    <Select 
                        callback={handleSelectChange} 
                        name="possuiCozinha"
                    />
                </div>
                
                <div className="celula">
                    <label>Data 1° visita:</label>
                        <input //DESCOBRIR UMA MANEIRA MELHOR PARA ESSE CAMPO
                            type="text"
                            value={obj.dataPrimeiraVisita}
                            name="dataPrimeiraVisita"
                            onChange={(event) => handleChange(event)}
                        />
                </div>

                <div className="celula">
                    <label>Nome do responsável pelo formulário:</label>
                        <input 
                            type="text"
                            value={obj.nomeResponsavelFormulario}
                            name="nomeResponsavelFormulario"
                            onChange={(event) => handleChange(event)}
                        />
                </div>

                <div className="celula">
                    <label>Nome do responsável pelo relatório fotográfico:</label>
                        <input 
                            type="text"
                            value={obj.nomeResponsavelFotografico}
                            name="nomeResponsavelFotografico"
                            onChange={(event) => handleChange(event)}
                        />
                </div>
                
                <div className="celula">
                    <label>Nome do responsável pelo levantamento arquitetônico:</label>
                        <input 
                            type="text"
                            value={obj.nomeResponsavelArquitetonico}
                            name="nomeResponsavelArquitetonico"
                            onChange={(event) => handleChange(event)}
                        />
                </div>

                <div className="celula">
                    <label>Nome do agente comunitário:</label>
                        <input 
                            type="text"
                            value={obj.nomeAgenteComunitario}
                            name="nomeAgenteComunitario"
                            onChange={(event) => handleChange(event)}
                        />
                </div>

                <div className="celula">
                    <label>Outros profissionais envolvidos(nomes e funções desempenhadas):</label>
                        <input 
                            type="text"
                            value={obj.outrosProfissionaisEnvolvidos}
                            name="outrosProfissionaisEnvolvidos"
                            onChange={(event) => handleChange(event)}
                        />
                </div>

                <div className="celula">
                    <label>Demanda apresentada pela família:</label>
                        <input 
                            type="text"
                            value={obj.demandaDaFamilia}
                            name="demandaDaFamilia"
                            onChange={(event) => handleChange(event)}
                        />
                </div>

                <div className="celula">
                    <label>Descrição das pendências:</label>
                        <input 
                            type="text"
                            value={obj.descricaoPendencias}
                            name="descricaoPendencias"
                            onChange={(event) => handleChange(event)}
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