import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa6";
import { IconContext } from "react-icons";
import BotoesSelecionaveis from "./BotoesSelecionaveis";

function BotoesMultiplosSelecionaveis({ arrayDeOpcoes, selecionados = [], onChange }) {
    const handleToggle = (opcao) => {
        let novos;
        if (selecionados.includes(opcao)) {
            novos = selecionados.filter(item => item !== opcao);
        } else {
            novos = [...selecionados, opcao];
        }
        onChange(novos);
    };

    return (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {arrayDeOpcoes.map((opcao, idx) => {
                const isSelected = selecionados.includes(opcao);
                return (
                    <button
                        type="button"
                        key={idx}
                        onClick={() => handleToggle(opcao)}
                        className={isSelected ? "botaoSelecionado" : "botaoNaoSelecionado"}
                    >
                        {opcao}
                    </button>
                );
            })}
        </div>
    );
}

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
                return <input type="text" value={valor || ""} onChange={e => alterarResposta(pergunta.codigo, e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "1rem" }} />;
            }
            return <BotoesSelecionaveis
                arrayDeOpcoes={pergunta.opcoes || []}
                selecionado={valor || ""}
                setSelecionado={atualizador => alterarResposta(pergunta.codigo, typeof atualizador === "function" ? atualizador(valor || "") : atualizador)}
            />;
        }
        if (pergunta.tipo === "resposta_multipla") {
            const selecionadas = Array.isArray(valor) ? valor : [];
            return <BotoesMultiplosSelecionaveis
                arrayDeOpcoes={pergunta.opcoes || []}
                selecionados={selecionadas}
                onChange={novos => alterarResposta(pergunta.codigo, novos)}
            />;
        }
        return <input type={pergunta.tipo === "number" ? "number" : pergunta.tipo === "data" ? "date" : "text"} value={valor ?? ""} onChange={e => alterarResposta(pergunta.codigo, e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "1rem" }} />;
    };

    if (loading) return <div className="container"><p>Carregando perguntas...</p></div>;
    if (erro) return <div className="container"><p>{erro}</p></div>;

    const categorias = {};
    perguntas.forEach(pergunta => {
        const categoria = pergunta.categoria || "Outros";
        if (!categorias[categoria]) categorias[categoria] = [];
        categorias[categoria].push(pergunta);
    });

    return (
        <div className="container" style={{ maxWidth: "600px", width: "100%", margin: "0 auto", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "24px" }}>
            <button className="returnBtn" onClick={() => navigate("/familia/entrevista", { state: { id: familiaId, role } })}>
                <IconContext.Provider value={{ size: "2rem" }}><FaArrowLeft /></IconContext.Provider>
            </button>
            <h2 style={{ marginBottom: "24px", color: "#333", fontSize: "1.6rem", borderBottom: "3px solid #F0A22E", paddingBottom: "8px", textAlign: "left" }}>
                Entrevista Estrutural
            </h2>
            <form onSubmit={enviar} style={{ textAlign: "left" }}>
                {Object.keys(categorias).map((categoria, categoriaIndex) => (
                    <div key={categoriaIndex} style={{ marginBottom: "32px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #F0A22E", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                        <h3 style={{ marginBottom: "20px", color: "#F0A22E", fontSize: "1.3rem" }}>{categoria}</h3>
                        {categorias[categoria].map(pergunta => (
                            <div key={pergunta.id} className="celula" style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={{ fontWeight: "600", fontSize: "1.05rem", color: "#444" }}>
                                    {pergunta.texto} {pergunta.obrigatoria && <span style={{ color: "red" }}>*</span>}
                                </label>
                                {renderPergunta(pergunta)}
                            </div>
                        ))}
                    </div>
                ))}
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                    <input
                        id="acessar"
                        type="submit"
                        value="Enviar relatório"
                        style={{ backgroundColor: "#F0A22E", color: "white", padding: "14px 28px", border: "none", borderRadius: "5px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", transition: "background-color 0.2s" }}
                        onMouseOver={e => e.target.style.backgroundColor = "#e0901e"}
                        onMouseOut={e => e.target.style.backgroundColor = "#F0A22E"}
                    />
                </div>
            </form>
        </div>
    );
}

export default Estrutural;
