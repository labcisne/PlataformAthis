import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function EsqueciSenhaUsuario(){

    const location = useLocation();
    const navigate = useNavigate();
    const [perguntaSeguranca, setPerguntaSeguranca] = useState("");
    const [resposta, setResposta] = useState("");
    const [recuperarPorEmail, setRecuperarPorEmail] = useState(false);

    const id = location.state?.id;

    useEffect(() => {
        axios.get(`http://localhost:3000/esqueciMinhaSenha/usuario/${id}`)
        .then((response) => setPerguntaSeguranca(response.data.perguntaSeguranca))
        .catch((error) => {console.log(error)});
    }, []);


    const handleRespostaSeguranca = (event) => {
        event.preventDefault();

        axios.post(`http://localhost:3000/esqueciMinhaSenha/usuario/${id}`, {respostaSeguranca: resposta})
        .then((response) => {
            navigate("/esqueciMinhaSenha/resetaSenha", {state: {link: response.data.link}});
        })
        .catch(() => alert("Resposta incorreta!"));
    }

    const handleRespostaEmail = (event) => {
        event.preventDefault();
        console.log("Conferindo e-mail", resposta);
    }

    return (
        <div className="container">
            <h2 style={{marginBottom: "16px"}}>Recuperar Senha</h2>
            {recuperarPorEmail ? (
                <>
                    <form onSubmit={handleRespostaEmail}>
                        <div className="row">
                            <label style={{textAlign: "left"}}>Digite seu e-mail:</label>
                            <input 
                                type="email" 
                                placeholder="usuario@email.com"
                                value={resposta}
                                onChange={(event) => setResposta(event.target.value)}
                            />
                        </div>
                        <div className="row">
                            <input type="submit" value="Enviar Resposta" id="acessar"/>
                        </div>
                    </form>
                    <a 
                        className="esqueciSenha" 
                        style={{display: "block", textAlign: "left"}}
                        onClick={() => {setRecuperarPorEmail(false)}}
                    >
                        Recuperar senha via resposta de segurança
                    </a>
                </>
            ) : (
                <>
                    <form onSubmit={handleRespostaSeguranca}>
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
                    <a 
                        className="esqueciSenha" 
                        style={{display: "block", textAlign: "left"}}
                        onClick={() => {setRecuperarPorEmail(true)}}
                    >
                        Recuperar senha via e-mail
                    </a>
                </>
            )}
        </div>
    );
}

export default EsqueciSenhaUsuario;