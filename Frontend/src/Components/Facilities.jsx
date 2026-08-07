import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import BotoesSelecionaveis from "./BotoesSelecionaveis";
import { FaArrowLeft } from "react-icons/fa6";
import { IconContext } from "react-icons";

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

function Entrevista() {
    const location = useLocation();
    const navigate = useNavigate();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState({});
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    // Minimum wage for rent relation calculation
    const MINIMUM_WAGE = 1412.00;

    // Pure function — receives values explicitly, no closure dependency on `respostas`
    const getRendaNumericValue = (rendaBrackets) => {
        if (!rendaBrackets) return 0;
        if (rendaBrackets.includes("1/2 s.m.")) return 0.5 * MINIMUM_WAGE;
        if (rendaBrackets.includes("1/2 a 1")) return 0.75 * MINIMUM_WAGE;
        if (rendaBrackets.includes("1 a 2")) return 1.5 * MINIMUM_WAGE;
        if (rendaBrackets.includes("2 a 3")) return 2.5 * MINIMUM_WAGE;
        if (rendaBrackets.includes("3 a 5")) return 4.0 * MINIMUM_WAGE;
        if (rendaBrackets.includes("5 a 10")) return 7.5 * MINIMUM_WAGE;
        if (rendaBrackets.includes("Acima de 10")) return 10.0 * MINIMUM_WAGE;
        return 0;
    };

    // Pure function — receives both values as parameters to avoid stale closure
    const calcRelacao = (renda, aluguel) => {
        const rendaVal = getRendaNumericValue(renda);
        const aluguelVal = parseFloat(aluguel) || 0;
        if (aluguelVal === 0) return "0,00%";
        if (rendaVal === 0) return "Indefinido (preencha a renda)";
        return ((aluguelVal / rendaVal) * 100).toFixed(2).replace(".", ",") + "%";
    };

    useEffect(() => {
        if (!familiaId) {
            setErro("Família não especificada.");
            setLoading(false);
            return;
        }

        // Fetch questions and family info in parallel
        Promise.all([
            axios.get("http://localhost:3000/entrevista/perguntas?formulario=Facilities", { withCredentials: true }),
            axios.get(`http://localhost:3000/familia/${familiaId}`, { withCredentials: true })
        ])
        .then(([perguntasRes, familiaRes]) => {
            const listPerguntas = perguntasRes.data.perguntas || [];
            setPerguntas(listPerguntas);

            const family = familiaRes.data.familia;
            const socio = family?.tabelaSocioeconomica || {};

            // Initialize responses state
            const initialRespostas = {};
            listPerguntas.forEach(q => {
                // Determine default value based on type
                let defaultVal = "";
                if (q.tipo === "number") {
                    defaultVal = 0;
                } else if (q.tipo === "resposta_multipla") {
                    defaultVal = [];
                }
                initialRespostas[q.codigo] = defaultVal;
            });

            // Map saved responses
            Object.keys(initialRespostas).forEach(code => {
                if (socio[code] !== undefined && socio[code] !== null) {
                    initialRespostas[code] = socio[code];
                }
            });

            // Pre-populate Identificação from Family's personal data if not filled
            if (family?.dadosFamilia) {
                const dados = family.dadosFamilia;
                if (!initialRespostas.nome_morador && dados.nomeMorador) {
                    initialRespostas.nome_morador = dados.nomeMorador;
                }
                if (!initialRespostas.endereco && dados.endereco) {
                    let endStr = dados.endereco;
                    if (dados.numeroCasa) endStr += `, Nº ${dados.numeroCasa}`;
                    initialRespostas.endereco = endStr;
                }
                if (!initialRespostas.telefone_contato && dados.telefone) {
                    initialRespostas.telefone_contato = dados.telefone;
                }
                if (!initialRespostas.dono_telefone && dados.donoTelefone) {
                    initialRespostas.dono_telefone = dados.donoTelefone;
                }
            }

            setRespostas(initialRespostas);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro ao carregar dados:", err);
            setErro("Erro ao carregar perguntas ou dados da família.");
            setLoading(false);
        });
    }, [familiaId]);

    // Update rent-to-income relation; values passed explicitly to avoid stale closure
    useEffect(() => {
        const renda = respostas.renda_mensal_total;
        const aluguel = respostas.valor_aluguel;
        const rel = calcRelacao(renda, aluguel);
        setRespostas(prev => {
            if (prev.relacao_aluguel_renda === rel) return prev; // avoid unnecessary re-render
            return { ...prev, relacao_aluguel_renda: rel };
        });
    }, [respostas.renda_mensal_total, respostas.valor_aluguel]);

    const handleValueChange = (codigo, valor) => {
        setRespostas(prev => ({ ...prev, [codigo]: valor }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate mandatory questions
        const missing = [];
        perguntas.forEach(q => {
            if (q.obrigatoria) {
                const val = respostas[q.codigo];
                if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
                    missing.push(q.texto);
                }
            }
        });

        if (missing.length > 0) {
            alert(`Por favor, preencha as seguintes perguntas obrigatórias:\n- ${missing.join("\n- ")}`);
            return;
        }

        // Send submission request
        axios.post("http://localhost:3000/familia/entrevista/facilities", { id: familiaId, obj: respostas }, { withCredentials: true })
        .then(() => {
            alert("Formulário de Facilities enviado com sucesso!");
            navigate("/familia/entrevista", { state: { id: familiaId, role } });
        })
        .catch(error => {
            console.error("Erro ao enviar formulário:", error);
            alert("Erro ao enviar o formulário.");
        });
    };

    if (loading) {
        return (
            <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Carregando perguntas...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="container" style={{ color: "red", padding: "20px" }}>
                <p>{erro}</p>
                <button onClick={() => navigate("/familia/entrevista", { state: { id: familiaId, role } })} className="detailsBtn" style={{ marginTop: "16px" }}>Voltar</button>
            </div>
        );
    }

    // Group questions by category
    const categorias = {};
    perguntas.forEach(q => {
        const cat = q.categoria || "Outros";
        if (!categorias[cat]) {
            categorias[cat] = [];
        }
        categorias[cat].push(q);
    });

    return (
        <div className="container" style={{ maxWidth: "600px", width: "100%", margin: "0 auto", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "24px" }}>
            <button className="returnBtn" onClick={() => navigate("/familia/entrevista", { state: { id: familiaId, role } })}>
                <IconContext.Provider value={{ size: "2rem" }}>
                    <FaArrowLeft />
                </IconContext.Provider>
            </button>

            <h2 style={{ marginBottom: "24px", color: "#333", fontSize: "1.6rem", borderBottom: "3px solid #F0A22E", paddingBottom: "8px", textAlign: "left" }}>
                Entrevista de Facilities
            </h2>

            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                {Object.keys(categorias).map((catName, catIdx) => (
                    <div key={catIdx} style={{ marginBottom: "32px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #F0A22E", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                        <h3 style={{ marginBottom: "20px", color: "#F0A22E", fontSize: "1.3rem" }}>{catName}</h3>
                        
                        {categorias[catName].map((q) => {
                            const val = respostas[q.codigo];
                            return (
                                <div key={q.id} className="celula" style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ fontWeight: "600", fontSize: "1.05rem", color: "#444" }}>
                                        {q.texto} {q.obrigatoria && <span style={{ color: "red" }}>*</span>}
                                    </label>

                                    {/* Handle text type */}
                                    {q.tipo === "texto" && (
                                        <input
                                            type="text"
                                            value={val || ""}
                                            onChange={(e) => handleValueChange(q.codigo, e.target.value)}
                                            style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "1rem" }}
                                            readOnly={q.codigo === "relacao_aluguel_renda"}
                                        />
                                    )}

                                    {/* Handle number type */}
                                    {q.tipo === "number" && (
                                        <input
                                            type="number"
                                            value={val === undefined || val === null ? "" : val}
                                            onChange={(e) => handleValueChange(q.codigo, e.target.value === "" ? "" : Number(e.target.value))}
                                            style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "1rem" }}
                                        />
                                    )}

                                    {/* Handle single choice (resposta_unica) */}
                                    {q.tipo === "resposta_unica" && (() => {
                                        // Always guarantee opcoes is an array to prevent .map / .includes crashes
                                        const opcoes = Array.isArray(q.opcoes) ? q.opcoes : [];
                                        const valorAtual = typeof val === "string" ? val : "";

                                        if (!q.allowOther) {
                                            return (
                                                <BotoesSelecionaveis
                                                    arrayDeOpcoes={opcoes}
                                                    selecionado={valorAtual}
                                                    setSelecionado={(opt) => handleValueChange(q.codigo, opt)}
                                                />
                                            );
                                        }

                                        // allowOther: dropdown + optional free-text input
                                        const isOutro = valorAtual !== "" && !opcoes.includes(valorAtual);
                                        return (
                                            <div>
                                                <select
                                                    value={isOutro ? "outro" : valorAtual}
                                                    onChange={(e) => {
                                                        if (e.target.value === "outro") {
                                                            handleValueChange(q.codigo, "");
                                                        } else {
                                                            handleValueChange(q.codigo, e.target.value);
                                                        }
                                                    }}
                                                    style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "1rem" }}
                                                >
                                                    <option value="" disabled>Escolha uma opção</option>
                                                    {opcoes.map((opt, oIdx) => (
                                                        <option value={opt} key={oIdx}>{opt}</option>
                                                    ))}
                                                    <option value="outro">Outro...</option>
                                                </select>
                                                {isOutro && (
                                                    <input
                                                        type="text"
                                                        placeholder="Especifique outro valor"
                                                        value={valorAtual}
                                                        onChange={(e) => handleValueChange(q.codigo, e.target.value)}
                                                        style={{ width: "100%", marginTop: "8px", padding: "12px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "1rem" }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Handle multiple choice (resposta_multipla) */}
                                    {q.tipo === "resposta_multipla" && (
                                        <BotoesMultiplosSelecionaveis
                                            arrayDeOpcoes={Array.isArray(q.opcoes) ? q.opcoes : []}
                                            selecionados={Array.isArray(val) ? val : []}
                                            onChange={(selectedList) => handleValueChange(q.codigo, selectedList)}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}

                <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                    <input
                        id="acessar"
                        type="submit"
                        value="Enviar relatório"
                        style={{
                            backgroundColor: "#F0A22E",
                            color: "white",
                            padding: "14px 28px",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "background-color 0.2s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#e0901e"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#F0A22E"}
                    />
                </div>
            </form>
        </div>
    );
}

export default Entrevista;