import { useLocation, useNavigate } from "react-router-dom";

function Arquivos(){

    const location = useLocation();
    const navigate = useNavigate();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    const navImagens = () => {
        navigate("/familia/dadosFamilia/arquivos/imagens", {state: {id: familiaId, role}})
    }

    const navArquivosGerais = () => {
        navigate("/familia/dadosFamilia/arquivos/arquivosGerais", {state: {id: familiaId, role}})
    }

    return (
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia", {state: {id: familiaId, role}})}>
                ⬅
            </button>
            <h2 style={{marginBottom: "16px"}}>Escolha uma das opções</h2>
            <div style={{display: "flex", gap:"10px"}}>
                <button 
                    className="familyDetailsBtn"
                    onClick={navImagens}
                >
                    Adicionar fotos
                </button>
                <button 
                    className="familyDetailsBtn"
                    onClick={navArquivosGerais}
                >
                    Adicionar arquivos
                </button>
            </div>
        </div>
    )
}

export default Arquivos;