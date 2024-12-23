import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import Tabela from "./Tabela";

import "./FamilyDetails.css";

function Componente() {

    const [tabelaUsuarios, setTabelaUsuarios] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const referenciaDialog = useRef(null);
    const [dadosFamilia, setDadosFamilia] = useState({});

    const location = useLocation();
    const familiaId = location.state?.id;
    const role = location.state?.role;
    

    useEffect(() => {
        axios.get(`http://localhost:3000/familia/${familiaId}`, {withCredentials:true})
            .then((response) => setDadosFamilia(response.data.familia.dadosFamilia))
            .catch((error) => console.log(error));
    }, [])


    //Essa função será executada com base na role. Só adm e entrevistador poderão executar
    if(role === "Administrador" || role === "Entrevistador"){

        useEffect(() => {
            axios.get("http://localhost:3000/usuariosParaAssociar", {withCredentials:true})
            .then((response) => setUsuarios(response.data.users))
            .catch((error) => console.log(error));
        }, [])
    }

    const apareceDialog = () => {
        if(!referenciaDialog.current){
            return;
        }
        referenciaDialog.current.hasAttribute("open")
            ? referenciaDialog.current.close()
            : referenciaDialog.current.showModal();
    }

    const getNomeUsuario = (usuario) => {
        return usuario.nome;
    }

    const getTipoUsuario = (usuario) => {
        return usuario.tipoUsuario;
    }

    const associaUsuario = (usuario) => {
        return () => {
            axios.post(`http://localhost:3000/familia/${familiaId}`, {userId: usuario._id}, {withCredentials:true})
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
        }
    }

    return (
        <div className="container">
            <h3 className="familyDetailsHeader">Dados da família:</h3>
            <div className="familyDataContainer">
                <p className="familyData"><span className="familyAttribute">ID: </span>{dadosFamilia ? dadosFamilia._id : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Nome do Morador: </span>{dadosFamilia ? dadosFamilia.nomeMorador : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Documento: </span>{dadosFamilia ? dadosFamilia.documentoResponsavel : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Tipo de Documento: </span>{dadosFamilia ? dadosFamilia.opcaoSelecionada : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Endereço: </span>{dadosFamilia ? dadosFamilia.endereco : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Número: </span>{dadosFamilia ? dadosFamilia.numeroCasa : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Cidade: </span>{dadosFamilia ? dadosFamilia.cidade : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Região: </span>{dadosFamilia ? dadosFamilia.regiao : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Telefone: </span>{dadosFamilia ? dadosFamilia.telefone : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Dono do Telefone: </span>{dadosFamilia ? dadosFamilia.donoTelefone : "Loading..."}</p>
            </div>
            <div className="familyDetailsBtnContainer">
                <button className="familyDetailsBtn">Localização</button>
                <button className="familyDetailsBtn">Tabela Socioeconômica</button>
                <button className="familyDetailsBtn">Tabela Estrutural</button>
                <button className="familyDetailsBtn">Arquivos</button>
                <button className="familyDetailsBtn" onClick={() => {
                    setTabelaUsuarios(<Tabela 
                        dados={usuarios}
                        firstHeader={"Nome"}
                        secondHeader={"Tipo de Usuário"}
                        getFirstHeader={getNomeUsuario}
                        getSecondHeader={getTipoUsuario}
                        action={associaUsuario}
                    />);
                    apareceDialog();
                }}>Associar Usuarios</button>
                <button className="familyDetailsBtn">Editar Família</button>
                <button className="familyDetailsBtn">Excluir Família</button>
            </div>
            <dialog ref={referenciaDialog} className="dialogContainer">
                {tabelaUsuarios}
                <button onClick={apareceDialog}>Fechar</button>
            </dialog>
        </div>
    )
}


export default Componente;