import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Tabela from "./Tabela";

import "./Menu.css";


function Menu(){
    
    const [familias, setFamilias] = useState([]);
    const navigate = useNavigate();

    const [role, setRole] = useState("");
    const [nomeUsuario, setNomeUsuario] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/protected", {withCredentials: true})
        .then((response) => {
            setRole(response.data.user.tipoUsuario);
            setNomeUsuario(response.data.user.nome);
        })
        .catch(() => navigate("/"));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3000/familia", {withCredentials: true})
        .then((response) => {
            setFamilias(response.data.familias);
        })
        .catch((error) => console.log(error));
    }, []);

    const renderButtons = () => {
        switch(role){
            case "Administrador":
                return (
                    <>
                        <button 
                            onClick={() => {role === "Administrador" ? navigate("/criarUsuario") : navigate("/menu", {state: {role}})}}
                            className="menuBtn"
                        >
                            Cadastrar novo usuário
                        </button>
                        <button 
                            onClick={() => {role === "Administrador" ? navigate("/usuarios") : navigate("/menu", {state: {role}})}}
                            className="menuBtn"
                        >
                            Gerenciar usuário
                        </button>
                        <button 
                            onClick={() => navigate("/familia")}
                            className="menuBtn"
                        >
                            Cadastrar nova família
                        </button>
                        <button className="menuBtn">
                            Realizar entrevista
                        </button>
                    </>
                );
            case "Entrevistador":
                return (
                    <>
                        <button 
                            onClick={() => navigate("/familia")}
                            className="menuBtn"
                        >
                            Cadastrar nova família
                        </button>
                        <button className="menuBtn">
                            Realizar entrevista
                        </button>
                    </>
                );
            case "Lider Comunitario":
                return (
                    <>
                        <button className="menuBtn">
                            Gerenciar usuário
                        </button>
                    </>
                );
            case "Morador":
                return (
                    <>
                        <button className="menuBtn">
                            Gerenciar usuário
                        </button>
                    </>
                );
            default:
                return <p>Loading...</p>
        }
    }

    const getDocumentoResponsavel = (familia) => {
        return familia.dadosFamilia.documentoResponsavel;
    }

    const getNomeMorador = (familia) => {
        return familia.dadosFamilia.nomeMorador;
    }

    const changePage = (familia) => {

        return () => navigate(`/familia/dadosFamilia`, {
            state: {
                id: familia._id,
                role
            }});
    }

    return (
        <div className="container">
            <button className="returnBtn" onClick={() => {navigate("/")}}>
                ⬅
            </button>
            <h3 className="menuHeader">{nomeUsuario ? `Olá, ${nomeUsuario}` : `Olá, usuário`}</h3>
            <div className="buttonsContainer">
                {renderButtons()}
            </div>
            <label className="tableTitle">Famílias cadastradas:</label>
            <Tabela 
                dados={familias}
                firstHeader={"Documento"}
                secondHeader={"Nome"}
                getFirstHeader={getDocumentoResponsavel}
                getSecondHeader={getNomeMorador}
                action={changePage}
            />
        </div>
    );
}

export default Menu;