import { useState, useEffect } from "react";
import axios from "axios";

import Tabela from "./Tabela";

import "./Users.css";


function Users(){

    const [usuarios, setUsuarios] = useState([]);

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


    return (
        <div className="container">
            <a href="#" className="returnBtn">
                <button className="returnIcon">
                    ⬅
                </button>
            </a>
            <label className="tableTitle">Usuários Cadastrados:</label>
            <Tabela 
                dados={usuarios}
                firstHeader={"Nome"}
                secondHeader={"Tipo de Usuário"}
                getFirstHeader={getNomeUsuario}
                getSecondHeader={getTipoUsuario}
            />
        </div>
    )
}

export default Users;