import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Select from "./Select";
import BotoesSelecionaveis from "./BotoesSelecionaveis";

function Estrutural(){

    const location = useLocation();
    const navigate = useNavigate();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    const [problemasInsalubridade, setProblemasInsalubridade] = useState("");
    const [necesitaReparosEstrutural, setNecessitaReparosEstrutural] = useState("");
    const [resolveProblemaNoProprioTerreno, setResolveProblemaNoProprioTerreno] = useState("");
    const [edificacaoEmAreaDeRisco, setEdificacaoEmAreaDeRisco] = useState("");
    const [numQuartos, setNumQuartos] = useState("0");
    const [coabitacao, setCoabitacao] = useState("");
    const [insercaoLote, setInsercaoLote] = useState("");
    const [fundacoes, setFundacoes] = useState("");
    const [estrutura, setEstrutura] = useState("");
    const [paredes, setParedes] = useState("");
    const [cobertura, setCobertura] = useState("");
    const [esquadrias, setEsquadrias] = useState("");
    const [hidrossanitario, setHidrossanitario] = useState("");
    const [eletrico, setEletrico] = useState("");
    const [banheiros, setBanheiros] = useState("");
    const [cozinhaAreaDeServico, setCozinhaAreaDeServico] = useState("");
    const [conforto, setConforto] = useState("");
    const [avaliacaoResidencia, setAvaliacaoResidencia] = useState("");
    const [acompanhamentoPsicossocial, setAcompanhamentoPsicossocial] = useState("");
    const [circulacaoInternaSegura, setCirculacaoInternaSegura] = useState("");
    const [avaliacaoInfraestruturaUrbana, setAvaliacaoInfraestruturaUrbana] = useState("");
    const [avaliacaoAcessibilidadeTransporteLazerSaneamento, setAvaliacaoAcessibiliadadeTransporteLazerSaneamento] = useState("");
    const [opiniaoGeralDaCasa, setOpiniaoGeralDaCasa] = useState("");
    const [diagnosticoPreliminar, setDiagnosticoPreliminar] = useState("");
    const [situacaoPositiva, setSituacaoPositiva] = useState("");
    const [observacoesGerais, setObservacoesGerais] = useState("");
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(problemasInsalubridade);
        console.log(necesitaReparosEstrutural);
        console.log(resolveProblemaNoProprioTerreno);
        console.log(edificacaoEmAreaDeRisco);
        console.log(numQuartos);
        console.log(coabitacao);
        console.log(insercaoLote);
        console.log(fundacoes);
        console.log(estrutura);
        console.log(paredes);
        console.log(cobertura);
        console.log(hidrossanitario);
        console.log(eletrico);
        console.log(banheiros);
        console.log(cozinhaAreaDeServico);
        console.log(conforto);
        console.log(avaliacaoResidencia);
        console.log(acompanhamentoPsicossocial);
        console.log(circulacaoInternaSegura);
        console.log(avaliacaoInfraestruturaUrbana);
        console.log(avaliacaoAcessibilidadeTransporteLazerSaneamento);
        console.log(opiniaoGeralDaCasa);
        console.log(diagnosticoPreliminar);
        console.log(situacaoPositiva);
        console.log(observacoesGerais);
    }

    return (
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/entrevista", {state: {id: familiaId, role}})}>
                ⬅
            </button>
            <form action="#" onSubmit={handleSubmit}>

                <div className="celula">
                    <label>Há problemas de insalubridade (cada elemento separado por vírgula):</label>
                    <input // ESSE É UM SELECT DIFERENCIADO
                        type="text"
                        value={problemasInsalubridade}
                        onChange={(event) => setProblemasInsalubridade(event.target.value)}
                        placeholder="Aberturas, Áreas molhadas, Saneamento"
                    />
                </div>

                <div className="celula">
                    <label>Existe a necessidade de realização de reparos estruturais?</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["Sim", "Não", "Verificar com engenheiro"]}
                        selecionado={necesitaReparosEstrutural}
                        setSelecionado={setNecessitaReparosEstrutural}
                    />
                </div>

                <div className="celula">
                    <label>Existe a possibilidade de resolver os problemas dentro do próprio terreno (a partir da estrutura existente)?</label>
                    <Select 
                        callback={setResolveProblemaNoProprioTerreno} 
                        name="resolveProblemaNoProprioTerreno"
                    />
                </div>

                <div className="celula">
                    <label>A edificação encontra-se em área de risco?</label>
                    <Select 
                        callback={setEdificacaoEmAreaDeRisco} 
                        name="edificacaoEmAreaDeRisco"
                    />
                </div>

                <div className="celula">
                    <label>Número de quartos:</label>
                    <input 
                        type="number" 
                        min={0}
                        value={numQuartos}
                        onChange={(event) => setNumQuartos(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Coabitação:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["Sim", "Não"]}
                        selecionado={coabitacao}
                        setSelecionado={setCoabitacao}
                    />
                </div>

                <div className="celula">
                    <label>Inserção no lote:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={insercaoLote}
                        setSelecionado={setInsercaoLote}
                    />
                </div>

                <div className="celula">
                    <label>Fundações:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={fundacoes}
                        setSelecionado={setFundacoes}
                    />
                </div>

                <div className="celula">
                    <label>Estrutura:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={estrutura}
                        setSelecionado={setEstrutura}
                    />
                </div>

                <div className="celula">
                    <label>Paredes:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={paredes}
                        setSelecionado={setParedes}
                    />
                </div>

                <div className="celula">
                    <label>Cobertura:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={cobertura}
                        setSelecionado={setCobertura}
                    />
                </div>

                <div className="celula">
                    <label>Esquadrias:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={esquadrias}
                        setSelecionado={setEsquadrias}
                    />
                </div>

                <div className="celula">
                    <label>Hidrossanitário:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={hidrossanitario}
                        setSelecionado={setHidrossanitario}
                    />
                </div>

                <div className="celula">
                    <label>Elétrico:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={eletrico}
                        setSelecionado={setEletrico}
                    />
                </div>

                <div className="celula">
                    <label>Banheiro(s):</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={banheiros}
                        setSelecionado={setBanheiros}
                    />
                </div>

                <div className="celula">
                    <label>Cozinha/área de serviço:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={cozinhaAreaDeServico}
                        setSelecionado={setCozinhaAreaDeServico}
                    />
                </div>

                <div className="celula">
                    <label>Conforto:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={conforto}
                        setSelecionado={setConforto}
                    />
                </div>

                <div className="celula">
                    <label>Avaliação da residência:</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["Reforma", "Reconstrução", "Expansão", "Nova unidade", "Precisa de mais avaliação"]}
                        selecionado={avaliacaoResidencia}
                        setSelecionado={setAvaliacaoResidencia}
                    />
                </div>

                <div className="celula">
                    <label>É necessário acompanhamento psicossocial?</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["Sim", "Não", "Avaliar melhor"]}
                        selecionado={acompanhamentoPsicossocial}
                        setSelecionado={setAcompanhamentoPsicossocial}
                    />
                </div>

                <div className="celula">
                    <label>A circulação interna na unidade é segura e adequada para todos os membros da família?</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["Sim", "Não"]}
                        selecionado={circulacaoInternaSegura}
                        setSelecionado={setCirculacaoInternaSegura}
                    />
                </div>

                <div className="celula">
                    <label>Como você avaliaria a infraestrutura urbana no entorno da residência?</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={avaliacaoInfraestruturaUrbana}
                        setSelecionado={setAvaliacaoInfraestruturaUrbana}
                    />
                </div>

                <div className="celula">
                    <label>Como você avaliaria a acessibilidade, transporte, lazer, saneamento básico e serviços?</label>
                    <input 
                        type="text"
                        value={avaliacaoAcessibilidadeTransporteLazerSaneamento}
                        onChange={(event) => setAvaliacaoAcessibiliadadeTransporteLazerSaneamento(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Na sua opinião, qual a situação geral da casa?</label>
                    <BotoesSelecionaveis 
                        arrayDeOpcoes = {["1", "2", "3"]}
                        selecionado={opiniaoGeralDaCasa}
                        setSelecionado={setOpiniaoGeralDaCasa}
                    />
                </div>

                <div className="celula">
                    <label>Diagnóstico preliminar:</label>
                    <input 
                        type="text"
                        value={diagnosticoPreliminar}
                        onChange={(event) => setDiagnosticoPreliminar(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Aponte pelo menos uma situação positiva da edificação que você observou:</label>
                    <input 
                        type="text"
                        value={situacaoPositiva}
                        onChange={(event) => setSituacaoPositiva(event.target.value)}
                    />
                </div>

                <div className="celula">
                    <label>Observações gerais:</label>
                    <input 
                        type="text"
                        value={observacoesGerais}
                        onChange={(event) => setObservacoesGerais(event.target.value)}
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

export default Estrutural;