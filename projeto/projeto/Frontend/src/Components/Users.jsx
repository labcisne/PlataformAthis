import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Tabela from "./Tabela";

import "./Users.css";

import { FaArrowLeft } from "react-icons/fa6";

import { IconContext } from "react-icons";


function Users(){

    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/usuarios", {withCredentials:true})
        .then((response) => setUsuarios(response.data.users))
        .catch((error) => console.log(error))
    }, [])

    const getNomeUsuario = (usuario) => {
        return usuario.nome;
    }

    const getTipoUsuario = (usuario) => {
        return usuario.tipoUsuario;
    }

    const changePage = (usuario) => {
        return () => {
            navigate("/usuarios/detalhesUsuario", { state: { id: usuario._id } });
        }
    }

    return (
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/menu")}>
                <IconContext.Provider value={{size: "2rem"}}>
                    <FaArrowLeft />
                </IconContext.Provider>
            </button>
            <label className="tableTitle">Usuários Cadastrados:</label>
            <Tabela 
                dados={usuarios}
                firstHeader={"Nome"}
                secondHeader={"Tipo de Usuário"}
                getFirstHeader={getNomeUsuario}
                getSecondHeader={getTipoUsuario}
                action={changePage}
            />
        </div>
    )
}

export default Users;