import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { FaArrowLeft } from "react-icons/fa6";
import { IconContext } from "react-icons";

function DadosFacilities() {
    const navigate = useNavigate();
    const location = useLocation();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    const [perguntas, setPerguntas] = useState([]);
    const [facilities, setFacilities] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!familiaId) {
            setErro("Família não especificada.");
            setLoading(false);
            return;
        }

        // Fetch questions and family info
        Promise.all([
            axios.get("http://localhost:3000/entrevista/perguntas?formulario=Facilities", { withCredentials: true }),
            axios.get(`http://localhost:3000/familia/${familiaId}`, { withCredentials: true })
        ])
        .then(([perguntasRes, familiaRes]) => {
            setPerguntas(perguntasRes.data.perguntas || []);
            setFacilities(familiaRes.data.familia?.tabelaSocioeconomica || null);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro ao carregar dados:", err);
            setErro("Erro ao carregar respostas ou perguntas.");
            setLoading(false);
        });
    }, [familiaId]);

    const formatAnswerValue = (val, type, codigo) => {
        if (val === undefined || val === null || val === "") {
            return "Não informado";
        }
        if (type === "resposta_multipla" && Array.isArray(val)) {
            return val.join(", ");
        }
        if (codigo === "valor_aluguel") {
            const num = parseFloat(val);
            return isNaN(num) ? val : `R$ ${num.toFixed(2).replace(".", ",")}`;
        }
        return String(val);
    };

    if (loading) {
        return (
            <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Carregando dados...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="container" style={{ color: "red", padding: "20px" }}>
                <p>{erro}</p>
                <button onClick={() => navigate("/familia/dadosFamilia", { state: { id: familiaId, role } })} className="detailsBtn" style={{ marginTop: "16px" }}>Voltar</button>
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
            <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia", { state: { id: familiaId, role } })}>
                <IconContext.Provider value={{ size: "2rem" }}>
                    <FaArrowLeft />
                </IconContext.Provider>
            </button>

            <h2 style={{ marginBottom: "24px", color: "#333", fontSize: "1.6rem", borderBottom: "3px solid #F0A22E", paddingBottom: "8px", textAlign: "left" }}>
                Dados do Formulário Facilities
            </h2>

            <div className="detailsContainer" style={{ textAlign: "left" }}>
                {Object.keys(categorias).map((catName, catIdx) => (
                    <div key={catIdx} style={{ marginBottom: "24px", backgroundColor: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", borderLeft: "4px solid #F0A22E" }}>
                        <h3 style={{ marginBottom: "16px", color: "#F0A22E", fontSize: "1.2rem", borderBottom: "1px solid #eee", paddingBottom: "6px" }}>{catName}</h3>
                        
                        {categorias[catName].map((q) => {
                            const val = facilities ? facilities[q.codigo] : null;
                            return (
                                <div key={q.id} style={{ marginBottom: "12px" }}>
                                    <span style={{ fontWeight: "bold", fontSize: "1.05rem", color: "#555", display: "block" }}>{q.texto}</span>
                                    <p className="detailsData" style={{ fontSize: "1rem", color: "#333", marginTop: "4px", paddingLeft: "8px" }}>
                                        {formatAnswerValue(val, q.tipo, q.codigo)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DadosFacilities;