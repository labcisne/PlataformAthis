import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EsqueciSenha(){

    const [login, setLogin] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post("http://localhost:3000/esqueciMinhaSenha", {login})
        .then((response) => {
            const link = response.data.link.slice(21, 47);
            const id = response.data.link.slice(48);
            navigate(link, { state: { id } });
        })
        .catch(() => alert("Usuário não encontrado"));
    }

    return(

        <div className="container">
            <button className="returnBtn" onClick={() => {navigate("/")}}>
                ⬅
            </button>
            <h2>Recuperar Senha</h2>
            <form action="#" onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="login">Login:</label>
                    <input type="text" name="login" id="login" placeholder="Entre com seu login" required
                            value={login} onChange={(event => {setLogin(event.target.value)})}/>
                </div>
                <div className="row">
                    <input type="submit" value="Encontrar usuário" id="acessar" />
                </div>
            </form>
        </div>
    );
}

export default EsqueciSenha;