import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Estrutural(){

    const location = useLocation();
    const navigate = useNavigate();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    const [obj, setObj] = useState({

        problemasInsalubridade: "",
        necessitaReparosEstrutural: "",
        resolveProblemaNoProprioTerreno: "",
        edificacaoEmAreaDeRisco: "",
        numQuartos: "0",
        coabitacao: "",
        insercaoLote: "",
        fundacoes: "",
        estrutura: "",
        paredes: "",
        cobertura: "",
        esquadrias: "",
        hidrossanitario: "",
        eletrico: "",
        banheiros: "",
        cozinhaAreaDeServico: "",
        conforto: "",
        avaliacaoResidencia: "",
        acompanhamentoPsicossocial: "",
        circulacaoInternaSegura: "",
        avaliacaoInfraestruturaUrbana: "",
        avaliacaoAcessibilidadeTransporteLazerSaneamento: "",
        opiniaoGeralDaCasa: "",
        diagnosticoPreliminar: "",
        situacaoPositiva: "",
        observacoesGerais: ""
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setObj({...obj, [name]: value});
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("gugu");
    }

    return (
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/entrevista", {state: {id: familiaId, role}})}>
                ⬅
            </button>
            <form action="#" onSubmit={handleSubmit}>

                <div className="celula">
                    <label>Há problemas de insalubridade (cada elemento separado por vírgula):</label>
                    <input 
                            type="text"
                            value={obj.problemasInsalubridade}
                            name="problemasInsalubridade"
                            onChange={(event) => handleChange(event)}
                            placeholder="Aberturas, Áreas molhadas, Saneamento"
                    />
                </div>

                <div className="celula">
                    <label>Existe a necessidade de realização de reparos estruturais?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="necessitaReparosEstrutural"
                            value="true"
                            onClick={handleChange}
                            style={{backgroundColor: obj.necessitaReparosEstrutural === "true" ? "#F0A22E" : "#ffffff"}}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="necessitaReparosEstrutural"
                            value="false"
                            onClick={handleChange}
                            style={{backgroundColor: obj.necessitaReparosEstrutural === "false" ? "#F0A22E" : "#ffffff"}}
                        >
                            Não
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="necessitaReparosEstrutural"
                            value="engenheiro"
                            onClick={handleChange}
                            style={{backgroundColor: obj.necessitaReparosEstrutural === "engenheiro" ? "#F0A22E" : "#ffffff"}}
                        >
                            Verificar com Engenheiro
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Existe a possibilidade de resolver os problemas dentro do próprio terreno (a partir da estrutura existente)?</label>
                    <input 
                        type="text" 
                        value={obj.resolveProblemaNoProprioTerreno}
                        name="resolveProblemaNoProprioTerreno"
                        onChange={handleChange}
                    />
                </div>

                <div className="celula">
                    <label>A edificação encontra-se em área de risco?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="edificacaoEmAreaDeRisco"
                            value="true"
                            onClick={handleChange}
                            style={{backgroundColor: obj.edificacaoEmAreaDeRisco === "true" ? "#F0A22E" : "#ffffff"}}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="edificacaoEmAreaDeRisco"
                            value="false"
                            onClick={handleChange}
                            style={{backgroundColor: obj.edificacaoEmAreaDeRisco === "false" ? "#F0A22E" : "#ffffff"}}
                        >
                            Não
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Número de quartos:</label>
                    <input 
                        type="number" 
                        min={0}
                        value={obj.numQuartos}
                        name="numQuartos"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Coabitação:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="coabitacao"
                            value="true"
                            onClick={handleChange}
                            style={{backgroundColor: obj.coabitacao === "true" ? "#F0A22E" : "#ffffff"}}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="coabitacao"
                            value="false"
                            onClick={handleChange}
                            style={{backgroundColor: obj.coabitacao === "false" ? "#F0A22E" : "#ffffff"}}
                        >
                            Não
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Inserção no lote:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="insercaoLote"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.insercaoLote === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="insercaoLote"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.insercaoLote === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="insercaoLote"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.insercaoLote === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Fundações:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="fundacoes"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.fundacoes === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="fundacoes"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.fundacoes === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="fundacoes"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.fundacoes === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Estrutura:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="estrutura"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.estrutura === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="estrutura"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.estrutura === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="estrutura"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.estrutura === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Paredes:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="paredes"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.paredes === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="paredes"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.paredes === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="paredes"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.paredes === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Cobertura:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="cobertura"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.cobertura === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="cobertura"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.cobertura === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="cobertura"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.cobertura === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Esquadrias:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="esquadrias"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.esquadrias === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="esquadrias"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.esquadrias === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="esquadrias"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.esquadrias === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Hidrossanitário:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="hidrossanitario"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.hidrossanitario === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="hidrossanitario"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.hidrossanitario === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="hidrossanitario"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.hidrossanitario === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Elétrico:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="eletrico"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.eletrico === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="eletrico"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.eletrico === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="eletrico"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.eletrico === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Banheiro(s):</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="banheiros"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.banheiros === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="banheiros"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.banheiros === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="banheiros"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.banheiros === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Cozinha/área de serviço:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="cozinhaAreaDeServico"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.cozinhaAreaDeServico === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="cozinhaAreaDeServico"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.cozinhaAreaDeServico === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="cozinhaAreaDeServico"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.cozinhaAreaDeServico === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Conforto:</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="conforto"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.conforto === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="conforto"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.conforto === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="conforto"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.conforto === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Avaliação da residência:</label>
                    <div style={{display: "flex", gap: "12px", flexWrap: "wrap"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="avaliacaoResidencia"
                            value="reforma"
                            onClick={handleChange}
                            style={{backgroundColor: obj.avaliacaoResidencia === "reforma" ? "#F0A22E" : "#ffffff"}}
                        >
                            Reforma
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="avaliacaoResidencia"
                            value="reconstrucao"
                            onClick={handleChange}
                            style={{backgroundColor: obj.avaliacaoResidencia === "reconstrucao" ? "#F0A22E" : "#ffffff"}}
                        >
                            Reconstrução
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="avaliacaoResidencia"
                            value="expansao"
                            onClick={handleChange}
                            style={{backgroundColor: obj.avaliacaoResidencia === "expansao" ? "#F0A22E" : "#ffffff"}}
                        >
                            Expansão
                        </button>

                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="avaliacaoResidencia"
                            value="novaUnidade"
                            onClick={handleChange}
                            style={{backgroundColor: obj.avaliacaoResidencia === "novaUnidade" ? "#F0A22E" : "#ffffff"}}
                        >
                            Nova unidade
                        </button>

                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="avaliacaoResidencia"
                            value="maisAvaliacao"
                            onClick={handleChange}
                            style={{backgroundColor: obj.avaliacaoResidencia === "maisAvaliacao" ? "#F0A22E" : "#ffffff"}}
                        >
                            Precisa de mais avaliação
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>É necessário acompanhamento psicossocial?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="acompanhamentoPsicossocial"
                            value="true"
                            onClick={handleChange}
                            style={{backgroundColor: obj.acompanhamentoPsicossocial === "true" ? "#F0A22E" : "#ffffff"}}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="acompanhamentoPsicossocial"
                            value="false"
                            onClick={handleChange}
                            style={{backgroundColor: obj.acompanhamentoPsicossocial === "false" ? "#F0A22E" : "#ffffff"}}
                        >
                            Não
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="acompanhamentoPsicossocial"
                            value="avaliar"
                            onClick={handleChange}
                            style={{backgroundColor: obj.acompanhamentoPsicossocial === "avaliar" ? "#F0A22E" : "#ffffff"}}
                        >
                            Avaliar melhor
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>A circulação interna na unidade é segura e adequada para todos os membros da família?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="circulacaoInternaSegura"
                            value="true"
                            onClick={handleChange}
                            style={{backgroundColor: obj.circulacaoInternaSegura === "true" ? "#F0A22E" : "#ffffff"}}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="circulacaoInternaSegura"
                            value="false"
                            onClick={handleChange}
                            style={{backgroundColor: obj.circulacaoInternaSegura === "false" ? "#F0A22E" : "#ffffff"}}
                        >
                            Não
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Como você avaliaria a infraestrutura urbana no entorno da residência?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="avaliacaoInfraestruturaUrbana"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.avaliacaoInfraestruturaUrbana === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="avaliacaoInfraestruturaUrbana"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.avaliacaoInfraestruturaUrbana === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="avaliacaoInfraestruturaUrbana"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.avaliacaoInfraestruturaUrbana === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Como você avaliaria a acessibilidade, transporte, lazer, saneamento básico e serviços?</label>
                    <input 
                        type="text"
                        value={obj.avaliacaoAcessibilidadeTransporteLazerSaneamento}
                        name="avaliacaoAcessibilidadeTransporteLazerSaneamento"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Na sua opinião, qual a situação geral da casa?</label>
                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="opiniaoGeralDaCasa"
                            value="1"
                            onClick={handleChange}
                            style={{backgroundColor: obj.opiniaoGeralDaCasa === "1" ? "#F0A22E" : "#ffffff"}}
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="opiniaoGeralDaCasa"
                            value="2"
                            onClick={handleChange}
                            style={{backgroundColor: obj.opiniaoGeralDaCasa === "2" ? "#F0A22E" : "#ffffff"}}
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="entrevistaBtn"
                            name="opiniaoGeralDaCasa"
                            value="3"
                            onClick={handleChange}
                            style={{backgroundColor: obj.opiniaoGeralDaCasa === "3" ? "#F0A22E" : "#ffffff"}}
                        >
                            3
                        </button>
                    </div>
                </div>

                <div className="celula">
                    <label>Diagnóstico preliminar:</label>
                    <input 
                        type="text"
                        value={obj.diagnosticoPreliminar}
                        name="diagnosticoPreliminar"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Aponte pelo menos uma situação positiva da edificação que você observou:</label>
                    <input 
                        type="text"
                        value={obj.situacaoPositiva}
                        name="situacaoPositiva"
                        onChange={(event) => handleChange(event)}
                    />
                </div>

                <div className="celula">
                    <label>Observações gerais:</label>
                    <input 
                        type="text"
                        value={obj.observacoesGerais}
                        name="observacoesGerais"
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

export default Estrutural;