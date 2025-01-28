import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function EsqueciSenhaUsuario(){

    const location = useLocation();
    const [perguntaSeguranca, setPerguntaSeguranca] = useState("");
    const [resposta, setResposta] = useState("");

    const id = location.state?.id;

    useEffect(() => {
        axios.get(`http://localhost:3000/esqueciMinhaSenha/usuario/${id}`)
        .then((response) => setPerguntaSeguranca(response.data.perguntaSeguranca))
        .catch((error) => {console.log(error)});
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post(`http://localhost:3000/esqueciMinhaSenha/usuario/${id}`, {respostaSeguranca: resposta})
        .then((response) => console.log(response.data))
        .catch(() => alert("Resposta incorreta!"));
    }

    return (
        <div className="container">
            <h2 style={{marginBottom: "16px"}}>Recuperar Senha</h2>
            <form action="#" onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="" style={{textAlign: "left"}}> {perguntaSeguranca} </label>
                    <input 
                        type="text" 
                        placeholder="Digite sua resposta" 
                        value={resposta}
                        onChange={(event) => setResposta(event.target.value)}
                    />
                </div>
                <div className="row">
                    <input type="submit" value="Enviar Resposta" id="acessar"/>
                </div>
            </form>
        </div>
    );
}

export default EsqueciSenhaUsuario;