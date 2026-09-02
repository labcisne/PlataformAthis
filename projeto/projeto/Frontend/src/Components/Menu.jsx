import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Tabela from "./Tabela";

import { TbLogout2 } from "react-icons/tb";
import { FaUserGear } from "react-icons/fa6";

import "./Menu.css";
import { IconContext } from "react-icons";


function Menu(){
    
    const [familias, setFamilias] = useState([]);
    const navigate = useNavigate();

    const [role, setRole] = useState("");
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [id, setId] = useState("");

    const referenciaDialogLogOut = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:3000/protected", {withCredentials: true})
        .then((response) => {
            setRole(response.data.user.tipoUsuario);
            setNomeUsuario(response.data.user.nome);
            setId(response.data.user._id);
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
                    </>
                );
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
    
    const apareceDialog = () => {
        if(!referenciaDialogLogOut.current){
            return;
        }

        referenciaDialogLogOut.current.hasAttribute("open")
            ? referenciaDialogLogOut.current.close()
            : referenciaDialogLogOut.current.showModal();
    }

    return (
        <div className="container">
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <button className="returnBtn" onClick={apareceDialog}>
                    <IconContext.Provider value={{size: "0.95em"}}>
                        <TbLogout2 />
                    </IconContext.Provider>
                </button>
                <button className="returnBtn" onClick={() => {navigate("/usuarios/detalhesUsuario", {state: {id, role}})}}>
                    <IconContext.Provider value={{size: "0.8em"}}>
                        <FaUserGear />
                    </IconContext.Provider>
                </button>
            </div>
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
            <dialog ref={referenciaDialogLogOut} className="dialogContainer">
                <h3 style={{marginBottom:"8px"}}>Tem certeza que gostaria de fazer log out?</h3>
                <div style={{display: "flex", justifyContent:"center", gap: "8px"}}>
                    <button
                        className="detailsBtn"
                        onClick={apareceDialog}
                    >
                        Cancelar
                    </button>
                    <button
                        className="detailsBtn"
                        onClick={() => {
                            apareceDialog();
                            navigate("/")
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </dialog>
        </div>
    );
}

export default Menu;