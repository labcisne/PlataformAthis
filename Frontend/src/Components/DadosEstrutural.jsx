import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function DadosEstrutural(){

    const [estrutural, setEstrutural] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    useEffect(() => {

        axios.get(`http://localhost:3000/familia/${familiaId}`, {withCredentials:true})
        .then((response) => setEstrutural(response.data.familia.tabelaEstrutural))
        .catch((error) => console.log(error))
    }, [])

    return (
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia", {state: {id: familiaId, role}})}>
                ⬅
            </button>
            <div className="detailsContainer">
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>ID Levantamento: </span>
                <p className="detailsData">{estrutural ? estrutural._id : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Problemas de Insalubridade: </span>
                <p className="detailsData">{estrutural ? estrutural.problemasInsalubridade : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Necessita de Reparos Estrutural: </span>
                <p className="detailsData">{estrutural ? estrutural.necessitaReparosEstrutural : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Resolve o Problema no Próprio Terreno: </span>
                <p className="detailsData">{estrutural ? estrutural.resolveProblemaNoProprioTerreno : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Edificação em Área de Risco: </span>
                <p className="detailsData">{estrutural ? estrutural.edificacaoEmAreaDeRisco : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Número de Quartos: </span>
                <p className="detailsData">{estrutural ? estrutural.numQuartos : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Coabitação: </span>
                <p className="detailsData">{estrutural ? estrutural.coabitacao : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Inserção do Lote: </span>
                <p className="detailsData">{estrutural ? estrutural.insercaoLote : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Fundações: </span>
                <p className="detailsData">{estrutural ? estrutural.fundacoes : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Estrutura: </span>
                <p className="detailsData">{estrutural ? estrutural.estrutura : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Paredes: </span>
                <p className="detailsData">{estrutural ? estrutural.paredes : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Cobertura: </span>
                <p className="detailsData">{estrutural ? estrutural.cobertura : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Esquadrias: </span>
                <p className="detailsData">{estrutural ? estrutural.esquadrias : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Hidrossanitário: </span>
                <p className="detailsData">{estrutural ? estrutural.hidrossanitario : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Elétrico: </span>
                <p className="detailsData">{estrutural ? estrutural.eletrico : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Banheiros: </span>
                <p className="detailsData">{estrutural ? estrutural.banheiros : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Cozinha / Área de Serviço: </span>
                <p className="detailsData">{estrutural ? estrutural.cozinhaAreaDeServico: "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Conforto: </span>
                <p className="detailsData">{estrutural ? estrutural.conforto : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Avaliação da Residência: </span>
                <p className="detailsData">{estrutural ? estrutural.avaliacaoResidencia : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Necessita de Acompanhamento Psicossocial: </span>
                <p className="detailsData">{estrutural ? estrutural.acompanhamentoPsicossocial : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Circulacao Interna é Segura: </span>
                <p className="detailsData">{estrutural ? estrutural.circulacaoInternaSegura : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Avaliação da Infraestrutura Urbana: </span>
                <p className="detailsData">{estrutural ? estrutural.avaliacaoInfraestruturaUrbana : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Avaliação Acessibilidade, Transporte, Lazer e Saneamento Básico: </span>
                <p className="detailsData">{estrutural ? estrutural.avaliacaoAcessibilidadeTransporteLazerSaneamento : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Opinião Geral da Casa: </span>
                <p className="detailsData">{estrutural ? estrutural.opiniaoGeralDaCasa : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Diagnóstico Preliminar: </span>
                <p className="detailsData">{estrutural ? estrutural.diagnosticoPreliminar : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Pontos Positivos da Casa: </span>
                <p className="detailsData">{estrutural ? estrutural.situacaoPositiva : "No data"}</p>
                <span style={{fontWeight: "bold", fontSize: "1.2rem"}}>Observações Gerais: </span>
                <p className="detailsData">{estrutural ? estrutural.observacoesGerais : "No data"}</p>
            </div>
        </div>
    )
}


export default DadosEstrutural;