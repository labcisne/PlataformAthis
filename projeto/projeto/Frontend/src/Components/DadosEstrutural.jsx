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

    return <div className="container">
        <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia", { state: { id: familiaId, role } })}>
            <IconContext.Provider value={{ size: "2rem" }}><FaArrowLeft /></IconContext.Provider>
        </button>
        <h2>Dados do Formulário Estrutural</h2>
        <div className="detailsContainer">
            {loading ? <p>Carregando dados...</p> : perguntas.map(pergunta => <div key={pergunta.id}>
                <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{pergunta.texto}</span>
                <p className="detailsData">{formatar(respostas[pergunta.codigo])}</p>
            </div>)}
        </div>
    </div>;
}

export default DadosEstrutural;
