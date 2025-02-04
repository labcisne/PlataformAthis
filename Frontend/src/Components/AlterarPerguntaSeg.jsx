import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


function AlterarPerguntaSeg(){

    const navigate = useNavigate();
    const location = useLocation();

    const id = location.state?.id;
    const [perguntaSeguranca, setPerguntaSeguranca] = useState(location.state?.perguntaSeguranca);
    const [respostaSeguranca, setRespostaSeguranca] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.patch("http://localhost:3000/alterarPerguntaSeguranca", {perguntaSeguranca, respostaSeguranca, id}, {withCredentials: true})
        .then((response) => {
            alert(response.data.message)
            navigate("/usuarios/detalhesUsuario", {state: { id }})
        })
        .catch((error) => console.log(error));
    }

    return(
        <div className="container">
            <button className="returnBtn" onClick={() => {navigate("/usuarios/detalhesUsuario", {state: { id }})}}>
                ⬅
            </button>
            <h2 style={{marginBottom: "28px"}}>Definir nova Pergunta de segurança</h2>
            <form onSubmit={handleSubmit}>
                <div className="celula">
                    <label htmlFor="perguntaSeguranca" style={{textAlign: "left"}}>Pergunta de segurança:</label>
                    <select 
                        id="perguntaSeguranca"
                        value={perguntaSeguranca}
                        onChange={(event) => setPerguntaSeguranca(event.target.value)}
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
                    <label>Resposta de segurança:</label>
                    <input 
                        type="text"
                        value={respostaSeguranca}
                        onChange={(event) => {setRespostaSeguranca(event.target.value)}}
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