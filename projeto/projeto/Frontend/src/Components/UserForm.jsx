import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./UserForm.css"
import { FaArrowLeft } from "react-icons/fa6";

import { IconContext } from "react-icons";

function UserForm(){

    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [opcaoSelecionada, setOpcaoSelecionada] = useState("");
    const [perguntaSeguranca, setPerguntaSeguranca] = useState("");
    const [respostaSeguranca, setRespostaSeguranca] = useState("");
    const [nomeUser, setNomeUser] = useState("");
    const [email, setEmail] = useState("");

    //função de submissão do formulário
    const handleSubmit = (event) => {
        event.preventDefault();
        const obj = {
            login,
            senha,
            confirmarSenha,
            tipoUsuario: opcaoSelecionada,
            perguntaSeguranca,
            respostaSeguranca,
            nome: nomeUser,
            email
        }

        //response.data pega o objeto da resposta que enviamos pelo backend
        axios.post("http://localhost:3000/criarUsuario", obj, {withCredentials: true})
        .then((response) => {
            console.log(response);
            alert("Usuário criado com sucesso!");
            navigate("/menu");
        })
        .catch((error) => console.error(error.response.data.message));

        setLogin("");
        setSenha("");
        setConfirmarSenha("");
        setOpcaoSelecionada("");
        setPerguntaSeguranca("");
        setRespostaSeguranca("");
        setNomeUser("");
        setEmail("");
    }

    return (
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/menu")}>
                <IconContext.Provider value={{size: "2rem"}}>
                    <FaArrowLeft />
                </IconContext.Provider>
            </button>
            <h3 className="userFormHeader">Entre com os dados do novo usuário:</h3>
            <form action="#" className="userFormContainer" onSubmit={handleSubmit}>
                <div className="celula preencher" id="loginContainer">
                    <label htmlFor="login">Login:</label>
                    <input type="text" id="login" name="login" placeholder="Login" required value={login}
                           onChange={(event) => {setLogin(event.target.value)}}/>
                </div>
                <div className="celula" id="senhaContainer">
                    <label htmlFor="senha">Senha:</label>
                    <input type="password" id="senha" name="senha" placeholder="Senha" required value={senha}
                           onChange={(event) => {setSenha(event.target.value)}}/>
                </div>
                <div className="celula" id="confirmarSenhaContainer">
                    <label htmlFor="confirmarSenha">Confirmar senha:</label>
                    <input type="password" id="confirmarSenha" name="confirmarSenha" placeholder="Senha" required 
                           value={confirmarSenha} onChange={(event) => {setConfirmarSenha(event.target.value)}}/>
                </div>
                <div className="celula checkContainer">
                    <div>
                        <input type="checkbox" id="administrador" name="tipoUsuario" 
                               value="Administrador" checked={opcaoSelecionada === "Administrador"}
                               onChange={() => {setOpcaoSelecionada("Administrador")}}/>
                        <label htmlFor="administrador" className="checkLabel">Administrador</label>
                    </div>
                    
                    <div>
                        <input type="checkbox" id="entrevistador" name="tipoUsuario" 
                               value="Entrevistador" checked={opcaoSelecionada === "Entrevistador"}
                               onChange={() => {setOpcaoSelecionada("Entrevistador")}}/>
                        <label htmlFor="entrevistador" className="checkLabel">Entrevistador</label>
                    </div>
                </div>
                <div className="celula checkContainer">
                    <div>
                        <input type="checkbox" id="liderComunitario" name="tipoUsuario" 
                               value="Lider Comunitario" checked={opcaoSelecionada === "Lider Comunitario"}
                               onChange={() => {setOpcaoSelecionada("Lider Comunitario")}}/>
                        <label htmlFor="liderComunitario" className="checkLabel">Líder Comunitario</label>
                    </div>
                </div>
                <div className="celula preencher" id="perguntaSegurancaContainer">
                    <label htmlFor="perguntaSeguranca">Pergunta de segurança:</label>
                    <select name="perguntaSeguranca" id="perguntaSeguranca" required value={perguntaSeguranca}
                            onChange={(event) => {setPerguntaSeguranca(event.target.value)}}>

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
                <div className="celula preencher" id="respostaSegurancaContainer">
                    <label htmlFor="respostaSeguranca">Resposta de Segurança:</label>
                    <input type="text" id="respostaSeguranca" name="respostaSeguranca" placeholder="Resposta de Segurança" required 
                           value={respostaSeguranca} onChange={(event) => {setRespostaSeguranca(event.target.value)}}/>
                </div>
                <div className="celula preencher" id="nomeUsuarioContainer">
                    <label htmlFor="nomeUsuario">Nome de usuário:</label>
                    <input type="text" id="nomeUsuario" name="nomeUsuario" placeholder="Nome de usuário" required 
                           value={nomeUser} onChange={(event) => {setNomeUser(event.target.value)}}/>
                </div>
                <div className="celula preencher" id="emailContainer">
                    <label htmlFor="email">E-mail:</label>
                    <input type="email" id="email" name="email" placeholder="nome@email.com" 
                           value={email} onChange={(event) => {setEmail(event.target.value)}}/>
                </div>
                <div className="celula preencher" id="btnContainer">
                    <input type="submit" name="cadastrar" id="cadastrar" value="Cadastrar"/>
                </div>
            </form>
        </div>
    );
}

export default UserForm;