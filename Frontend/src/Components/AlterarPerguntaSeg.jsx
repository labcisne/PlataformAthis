import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { FaArrowLeft } from "react-icons/fa6";

import { IconContext } from "react-icons";

function AlterarPerguntaSeg(){

    const navigate = useNavigate();
    const location = useLocation();

    const id = location.state?.id;
    const role = location.state?.role;

    const [novaPerguntaSeguranca, setNovaPerguntaSeguranca] = useState(location.state?.perguntaSeguranca);
    const [novaRespostaSeguranca, setNovaRespostaSeguranca] = useState("");
    const [respostaSegurancaAtual, setRespostaSegurancaAtual] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if(!role){
            axios.patch("http://localhost:3000/alterarPerguntaSeguranca", {novaPerguntaSeguranca, novaRespostaSeguranca, id}, {withCredentials: true})
            .then((response) => {
                alert(response.data.message);
                navigate("/usuarios/detalhesUsuario", {state: { id }});
            })
            .catch((error) => alert(error.response.data.message));
        }
        else{

            axios.patch("http://localhost:3000/alterarPerguntaSeguranca", {respostaSegurancaAtual, novaPerguntaSeguranca, novaRespostaSeguranca}, {withCredentials: true})
            .then((response) => {
                alert(response.data.message);
                navigate("/usuarios/detalhesUsuario", {state: {id, role }});
            })
            .catch((error) => alert(error.response.data.message));

        }
    }

    return(
        <div className="container">
            {role ? (
                <button className="returnBtn" onClick={() => {navigate("/usuarios/detalhesUsuario", {state: {id, role }})}}>
                    <IconContext.Provider value={{size: "2rem"}}>
                        <FaArrowLeft />
                    </IconContext.Provider>
                </button>
            ) : (

                <button className="returnBtn" onClick={() => {navigate("/usuarios/detalhesUsuario", {state: { id }})}}>
                    <IconContext.Provider value={{size: "2rem"}}>
                        <FaArrowLeft />
                    </IconContext.Provider>
                </button>
            )}
            <h2 style={{marginBottom: "28px"}}>Definir nova Pergunta de segurança</h2>
            <form onSubmit={handleSubmit}>
                {role && (
                    <div className="celula">
                        <label htmlFor="">{location.state?.perguntaSeguranca}</label>
                        <input 
                            type="text"
                            value={respostaSegurancaAtual}
                            onChange={(event) => setRespostaSegurancaAtual(event.target.value)}
                        />
                    </div>
                )}
                <div className="celula">
                    <label htmlFor="perguntaSeguranca" style={{textAlign: "left"}}>Nova Pergunta de segurança:</label>
                    <select 
                        id="perguntaSeguranca"
                        value={novaPerguntaSeguranca}
                        onChange={(event) => setNovaPerguntaSeguranca(event.target.value)}
                    >
                        <option value="" disabled>
                            Escolha uma das opções
                        </option>
                        <option value="Qual é o nome do seu animal de estimação?">
                            Qual é o nome do seu animal de estimação?
                        </option>
                        <option value="Qual é a sua comida favorita?">
                            Qual é a sua comida favorita?
                        </option>
                        <option value="Qual é o seu esporte favorito?">
                            Qual é o seu esporte favorito?
                        </option>
                    </select>
                </div>
                <div className="celula">
                    <label>Nova Resposta de segurança:</label>
                    <input 
                        type="text"
                        value={novaRespostaSeguranca}
                        onChange={(event) => {setNovaRespostaSeguranca(event.target.value)}}
                    />
                </div>
                <div className="celular">
                    <input type="submit" value="Mudar Pergunta de Segurança" id="acessar"/>
                </div>
            </form>
        </div>
    )
}

export default AlterarPerguntaSeg;