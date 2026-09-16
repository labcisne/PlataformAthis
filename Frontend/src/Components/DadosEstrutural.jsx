import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa6";
import { IconContext } from "react-icons";

function DadosEstrutural() {
    const navigate = useNavigate();
    const location = useLocation();
    const familiaId = location.state?.id;
    const role = location.state?.role;
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3000/entrevista/perguntas?formulario=Edificacoes", { withCredentials: true }),
            axios.get(`http://localhost:3000/familia/${familiaId}`, { withCredentials: true })
        ]).then(([perguntasRes, familiaRes]) => {
            setPerguntas(perguntasRes.data.perguntas || []);
            setRespostas(familiaRes.data.familia?.tabelaEstrutural || {});
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [familiaId]);

    const formatar = valor => {
        if (valor === undefined || valor === null || valor === "") return "Não informado";
        return Array.isArray(valor) ? valor.join(", ") : String(valor);
    };

    const categorias = {};
    perguntas.forEach(pergunta => {
        const categoria = pergunta.categoria || "Outros";
        if (!categorias[categoria]) categorias[categoria] = [];
        categorias[categoria].push(pergunta);
    });

    return (
        <div className="container" style={{ maxWidth: "600px", width: "100%", margin: "0 auto", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "24px" }}>
            <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia", { state: { id: familiaId, role } })}>
                <IconContext.Provider value={{ size: "2rem" }}><FaArrowLeft /></IconContext.Provider>
            </button>
            <h2 style={{ marginBottom: "24px", color: "#333", fontSize: "1.6rem", borderBottom: "3px solid #F0A22E", paddingBottom: "8px", textAlign: "left" }}>
                Dados do Formulário Estrutural
            </h2>
            <div className="detailsContainer" style={{ textAlign: "left" }}>
                {loading ? <p>Carregando dados...</p> : Object.keys(categorias).map((categoria, categoriaIndex) => (
                    <div key={categoriaIndex} style={{ marginBottom: "24px", backgroundColor: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", borderLeft: "4px solid #F0A22E" }}>
                        <h3 style={{ marginBottom: "16px", color: "#F0A22E", fontSize: "1.2rem", borderBottom: "1px solid #eee", paddingBottom: "6px" }}>{categoria}</h3>
                        {categorias[categoria].map(pergunta => (
                            <div key={pergunta.id} style={{ marginBottom: "12px" }}>
                                <span style={{ fontWeight: "bold", fontSize: "1.05rem", color: "#555", display: "block" }}>{pergunta.texto}</span>
                                <p className="detailsData" style={{ fontSize: "1rem", color: "#333", marginTop: "4px", paddingLeft: "8px" }}>
                                    {formatar(respostas[pergunta.codigo])}
                                </p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DadosEstrutural;
