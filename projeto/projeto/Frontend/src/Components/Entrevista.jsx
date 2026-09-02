import { useLocation, useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa6";

import { IconContext } from "react-icons";

function Entrevista(){
    
    const location = useLocation();
    const navigate = useNavigate();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    const navSocioeconomica = () => {
        navigate("/familia/entrevista/facilities", {state: {id: familiaId, role}})
    }

    const navEstrutural = () => {
        navigate("/familia/entrevista/estrutural", {state: {id: familiaId, role}})
    }

    return (
        
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia", {state: {id: familiaId, role}})}>
                <IconContext.Provider value={{size: "2rem"}}>
                    <FaArrowLeft />
                </IconContext.Provider>
            </button>
            <h2 style={{marginBottom: "16px"}}>Escolha uma das opções</h2>
            <div className="familyDetailsBtnContainer">
                <button 
                    className="familyDetailsBtn"
                    onClick={navSocioeconomica}
                >
                    Entrevista Socioeconômica
                </button>
                <button 
                    className="familyDetailsBtn"
                    onClick={navEstrutural}
                >
                    Entrevista Estrutural
                </button>
            </div>
        </div>
    
    )
}

export default Entrevista;