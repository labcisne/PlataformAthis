import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./LoginForm.css"

function LoginForm(){

    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [stayConnected, setStayConnected] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const obj = {
            login,
            senha
        }

        axios.post("http://localhost:3000", obj, {withCredentials: true})
        .then((response) => {
            navigate("/menu", {state: {role: response.data.user.tipoUsuario, 
                                       nomeUsuario: response.data.user.nome}});
        })
        .catch((error) => {console.error(error.response.data.message)});

        setLogin("");
        setSenha("");
        setStayConnected(false);
    }

    return (
        <div className="container">
            <a href="#">
                <div className="returnIcon">
                    ⬅
                </div>
            </a>
            <h1>Acesso</h1>
            <form action="#" className="loginFormContainer" onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="login">Login:</label>
                    <input type="text" name="login" id="login" placeholder="Entre com seu login" required
                           value={login} onChange={(event => {setLogin(event.target.value)})}/>
                </div>
                <div className="row">
                    <label htmlFor="senha">Senha:</label>
                    <input type="password" name="senha" id="senha" placeholder="Entre com sua senha" required
                           value={senha} onChange={(event) => {setSenha(event.target.value)}}/>
                </div>
                <div className="row specialRow">
                    <div>
                        <input type="checkbox" name="conectado" id="conectado" checked={stayConnected}
                               onChange={(event) => {setStayConnected(event.target.checked)}}/>
                        <label htmlFor="conectado" id="checkLabel">Mantenha-me conectado</label>
                    </div>
                    <div>
                        <a href="#" className="esqueciSenha">Esqueci minha senha</a>
                    </div>
                </div>
                <div className="row buttonContainer">
                    <input type="submit" name="acessar" id="acessar" value="Acessar"/>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;