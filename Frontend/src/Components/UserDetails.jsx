import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tabela from "./Tabela.jsx";
import axios from "axios";

function UserDetails(){

    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [userEditado, setUserEditado] = useState({});
    const [modoEdicao, setModoEdicao] = useState(false);
    
    const referenciaDialog = useRef(null);
    const [tabelaFamiliasAssociadas, setTabelaFamiliasAssociadas] = useState(null);

    const id = location.state?.id;
    const role = location.state?.role;


    useEffect(() => {
        axios.get(`http://localhost:3000/usuarios/${id}`, {withCredentials: true})
        .then((response) => {
            setUser(response.data.user);
            setUserEditado(response.data.user);
        })
        .catch((error) => console.log(error));
    }, [])

    const salvarAlteracoes = () => {
        const obj = {
            tipoUsuario: userEditado.tipoUsuario,
            nome: userEditado.nome,
            email: userEditado.email
        }
        userEditado.login !== user.login ? obj.login = userEditado.login : undefined;
        axios.patch("http://localhost:3000/alterarDadosPessoais", {obj, id}, {withCredentials: true})
        .then((response) => {
            alert(response.data.message);
            setUser(userEditado);
        })
        .catch((error) => console.log(error));
        setModoEdicao(false);
    }

    const deletaUsuario = () => {
        axios.delete(`http://localhost:3000/usuarios/${id}`, {withCredentials: true})
        .then((response) => {
            alert(response.data.message);
            navigate("/usuarios");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setUserEditado({...userEditado, [name]: value});
    }

    const handleAlteraSenha = () => {
        navigate("/usuarios/detalhesUsuario/alterarSenha", {state: { id }});
    }

    const handleAlteraPergunta = () => {
        navigate("/usuarios/detalhesUsuario/alterarPerguntaSeguranca", {state: { id, perguntaSeguranca: user.perguntaSeguranca }});
    }

    const getDocumentoResponsavel = (familia) => {
        return familia.dadosFamilia.documentoResponsavel;
    }

    const getNomeMorador = (familia) => {
        return familia.dadosFamilia.nomeMorador;
    }

    const apareceDialog = () => {
        if(!referenciaDialog.current){
            return;
        }
        referenciaDialog.current.hasAttribute("open")
            ? referenciaDialog.current.close()
            : referenciaDialog.current.showModal();
    }

    const handleFamiliasAssociadas = () => {
        axios.get("http://localhost:3000/familia", {
            withCredentials: true,
            params: {user}
        })
        .then((response) => {
            setTabelaFamiliasAssociadas(
                <Tabela
                    dados={response.data.familias}
                    firstHeader={"Documento"}
                    secondHeader={"Nome"}
                    getFirstHeader={getDocumentoResponsavel}
                    getSecondHeader={getNomeMorador}
                />
            )
            apareceDialog();
        })
        .catch((error) => console.log(error));

    }

    return (
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/usuarios")}>
                ⬅
            </button>
            <h3 className="detailsHeader">Dados do usuário:</h3>
            <div className="detailsContainer">
                {modoEdicao ? (
                    <div>
                        <div className="celula">
                            <label>Login:</label>
                            <input 
                                type="text"
                                name="login"
                                value={userEditado ? userEditado.login : "Loading..."} 
                                onChange={handleChange}
                            />
                        </div>
                        {!role && (
                            <div className="celula">
                                <label>Tipo de usuário:</label>
                                <div>
                                    <input 
                                        type="checkbox"
                                        id="administrador"
                                        value="Administrador"
                                        name="tipoUsuario"
                                        checked={userEditado?.tipoUsuario === "Administrador"}
                                        onChange={handleChange}
                                    />
                                    <label 
                                        htmlFor="administrador"
                                        style={{display: "inline", marginLeft: "4px"}}
                                    >
                                        Administrador
                                    </label>
                                </div>
                                <div>
                                    <input 
                                        type="checkbox"
                                        id="entrevistador"
                                        value="Entrevistador"
                                        name="tipoUsuario"
                                        checked={userEditado?.tipoUsuario === "Entrevistador"}
                                        onChange={handleChange}
                                    />
                                    <label 
                                        htmlFor="entrevistador"
                                        style={{display: "inline", marginLeft: "4px"}}
                                    >
                                        Entrevistador
                                    </label>
                                </div>
                                <div>
                                    <input 
                                        type="checkbox"
                                        id="liderComunitario"
                                        value="Lider Comunitario"
                                        name="tipoUsuario"
                                        checked={userEditado?.tipoUsuario === "Lider Comunitario"}
                                        onChange={handleChange}
                                    />
                                    <label 
                                        htmlFor="liderComunitario"
                                        style={{display: "inline", marginLeft: "4px"}}
                                    >
                                        Líder Comunitário
                                    </label>
                                </div>
                            </div>
                        )}
                        <div className="celula">
                            <label>Nome:</label>
                            <input 
                                type="text"
                                name="nome"
                                value={userEditado ? userEditado.nome : "Loading..."} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="celula">
                            <label>E-mail:</label>
                            <input 
                                type="email"
                                name="email"
                                value={userEditado ? userEditado.email : "Loading..."} 
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                ): (
                    <div>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>ID: </span>{user ? user._id : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Login: </span>{user ? user.login : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Tipo de usuário: </span>{user ? user.tipoUsuario : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Nome: </span>{user ? user.nome : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>E-mail: </span>{user.email ? user.email : "Não informado"}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Data de cadastro: </span>{user ? `${user.dataCadastro?.slice(8, 10)}/${user.dataCadastro?.slice(5, 7)}/${user.dataCadastro?.slice(0, 4)}` : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Pergunta de segurança: </span>{user ? user.perguntaSeguranca : "Loading..."}</p>
                    </div>
                )}

                {modoEdicao ? (
                    <button
                        className="detailsBtn editDeleteBtn"
                        onClick={salvarAlteracoes}
                    >
                        Salvar alterações
                    </button>
                ) : (
                    <div
                        style={{display: "flex", gap: "12px"}}
                    >
                        <button
                            className="detailsBtn editDeleteBtn"
                            onClick={() => setModoEdicao(true)}
                        >
                            Editar Usuário
                        </button>

                        <button
                            className="detailsBtn editDeleteBtn"
                            onClick={deletaUsuario}
                        >
                            Excluir usuário
                        </button>
                    </div>
                )}

            </div>
            <div className="familyDetailsBtnContainer">
                <button
                    className="detailsBtn"
                    onClick={handleAlteraSenha}
                >
                    Alterar Senha
                </button>
                <button
                    className="detailsBtn"
                    onClick={handleAlteraPergunta}
                >
                    Alterar Pergunta de Segurança
                </button>
                <button
                    className="detailsBtn"
                    onClick={handleFamiliasAssociadas}
                >
                    Famílias Associadas
                </button>
            </div>
            <dialog ref={referenciaDialog} className="dialogContainer">
                {tabelaFamiliasAssociadas}
                <button onClick={apareceDialog}>Fechar</button>
            </dialog>
        </div>
    )
}


export default UserDetails;