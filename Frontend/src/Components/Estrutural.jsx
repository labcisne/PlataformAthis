import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa6";
import { IconContext } from "react-icons";
import BotoesSelecionaveis from "./BotoesSelecionaveis";

function Estrutural() {
    const location = useLocation();
    const navigate = useNavigate();
    const familiaId = location.state?.id;
    const role = location.state?.role;
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState({});
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!familiaId) {
            setErro("Família não especificada.");
            setLoading(false);
            return;
        }

        Promise.all([
            axios.get("http://localhost:3000/entrevista/perguntas?formulario=Edificacoes", { withCredentials: true }),
            axios.get(`http://localhost:3000/familia/${familiaId}`, { withCredentials: true })
        ]).then(([perguntasRes, familiaRes]) => {
            const lista = perguntasRes.data.perguntas || [];
            const salvas = familiaRes.data.familia?.tabelaEstrutural || {};
            const iniciais = {};
            lista.forEach(pergunta => {
                const padrao = pergunta.tipo === "resposta_multipla" ? [] : "";
                iniciais[pergunta.codigo] = salvas[pergunta.codigo] ?? padrao;
            });
            setPerguntas(lista);
            setRespostas(iniciais);
            setLoading(false);
        }).catch(() => {
            setErro("Erro ao carregar perguntas ou respostas.");
            setLoading(false);
        });
    }, [familiaId]);

    const alterarResposta = (codigo, valor) => setRespostas(anterior => ({ ...anterior, [codigo]: valor }));

    const enviar = event => {
        event.preventDefault();
        const faltantes = perguntas.filter(pergunta => {
            const valor = respostas[pergunta.codigo];
            return pergunta.obrigatoria && (valor === "" || valor == null || (Array.isArray(valor) && !valor.length));
        });
        if (faltantes.length) {
            alert(`Preencha as perguntas obrigatórias:\n- ${faltantes.map(p => p.texto).join("\n- ")}`);
            return;
        }
        const answers = perguntas.map(pergunta => ({
            questionId: pergunta.id,
            value: respostas[pergunta.codigo]
        }));
        axios.post("http://localhost:3000/familia/entrevista/estrutural", { id: familiaId, answers }, { withCredentials: true })
            .then(() => {
                alert("Relatório enviado com sucesso!");
                navigate("/familia/entrevista", { state: { id: familiaId, role } });
            })
            .catch(() => alert("Erro ao enviar o formulário."));
    };

    const renderPergunta = pergunta => {
        const valor = respostas[pergunta.codigo];
        if (pergunta.tipo === "resposta_unica") {
            if (pergunta.allowOther && (!pergunta.opcoes || pergunta.opcoes.length === 0)) {
                return <input type="text" value={valor || ""} onChange={e => alterarResposta(pergunta.codigo, e.target.value)} />;
            }
            return <BotoesSelecionaveis
                arrayDeOpcoes={pergunta.opcoes || []}
                selecionado={valor || ""}
                setSelecionado={atualizador => alterarResposta(pergunta.codigo, typeof atualizador === "function" ? atualizador(valor || "") : atualizador)}
            />;
        }
        if (pergunta.tipo === "resposta_multipla") {
            const selecionadas = Array.isArray(valor) ? valor : [];
            return <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(pergunta.opcoes || []).map(opcao => <label key={opcao} style={{ fontWeight: "normal" }}>
                    <input type="checkbox" checked={selecionadas.includes(opcao)} onChange={() => alterarResposta(pergunta.codigo, selecionadas.includes(opcao) ? selecionadas.filter(item => item !== opcao) : [...selecionadas, opcao])} /> {opcao}
                </label>)}
            </div>;
        }
        return <input type={pergunta.tipo === "number" ? "number" : pergunta.tipo === "data" ? "date" : "text"} value={valor ?? ""} onChange={e => alterarResposta(pergunta.codigo, e.target.value)} />;
    };

    if (loading) return <div className="container"><p>Carregando perguntas...</p></div>;
    if (erro) return <div className="container"><p>{erro}</p></div>;

    return <div className="container">
        <button className="returnBtn" onClick={() => navigate("/familia/entrevista", { state: { id: familiaId, role } })}>
            <IconContext.Provider value={{ size: "2rem" }}><FaArrowLeft /></IconContext.Provider>
        </button>
        <h2>Entrevista Estrutural</h2>
        <form onSubmit={enviar}>
            {perguntas.map(pergunta => <div className="celula" key={pergunta.id}>
                <label>{pergunta.texto} {pergunta.obrigatoria && "*"}</label>
                {renderPergunta(pergunta)}
            </div>)}
            <div className="celula"><input id="acessar" type="submit" value="Enviar relatório" /></div>
        </form>
    </div>;
}

export default Estrutural;
