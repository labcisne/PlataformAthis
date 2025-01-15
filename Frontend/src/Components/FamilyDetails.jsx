import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import Tabela from "./Tabela";

import "./FamilyDetails.css";

function Componente() {

    const [tabelaUsuariosParaAssociar, setTabelaUsuariosParaAssociar] = useState(null);
    const [tabelaUsuariosAssociados, setTabelaUsuariosAssociados] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosAssociados, setUsuariosAssociados] = useState([]);
    const referenciaDialog1 = useRef(null);
    const referenciaDialog2 = useRef(null);
    const [familia, setFamilia] = useState({});

    const location = useLocation();
    const familiaId = location.state?.id;
    const role = location.state?.role;

    useEffect(() => {
        axios.get(`http://localhost:3000/familia/${familiaId}`, {withCredentials:true})
        .then((response) => {
                setFamilia(response.data.familia);
                const usuariosAssociadosId = response.data.familia.usuariosAssociados;
                return axios.get("http://localhost:3000/familia/usuariosAssociados", {params: {usuariosAssociadosId}, withCredentials: true})
            })
        .then((response => {setUsuariosAssociados(response.data.users)}))
        .catch((error) => console.log(error));
    }, [])

    //Essa função será executada com base na role. Só adm e entrevistador poderão executar
    if(role === "Administrador" || role === "Entrevistador"){
        useEffect(() => {
            axios.get("http://localhost:3000/usuariosParaAssociar", {params: {familiaId}, withCredentials:true})
            .then((response) => setUsuarios(response.data.users))
            .catch((error) => console.log(error));
        }, [])
    }

    // const usuariosParaAssociar = async () => {
    //     axios.get("http://localhost:3000/usuariosParaAssociar", {params: {familiaId}, withCredentials:true})
    //         .then((response) => setUsuarios(response.data.users))
    //         .catch((error) => console.log(error));
    // }

    const apareceDialog = (referenciaDialog) => {
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

    const deletaFamilia = () => {
        
        axios.delete(`http://localhost:3000/familia/${familiaId}`, {data: {userRole: role}, withCredentials: true})
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    }

    return (
        <div className="container">
            <a href="#">
                <div className="returnIcon">
                    ⬅
                </div>
            </a>
            <h3 className="familyDetailsHeader">Dados da família:</h3>
            <div className="familyDataContainer">
                <p className="familyData"><span className="familyAttribute">ID: </span>{familiaId ? familiaId : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Nome do Morador: </span>{familia.dadosFamilia ? familia.dadosFamilia.nomeMorador : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Documento: </span>{familia.dadosFamilia ? familia.dadosFamilia.documentoResponsavel : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Tipo de Documento: </span>{familia.dadosFamilia ? familia.dadosFamilia.opcaoSelecionada?.toUpperCase() : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Endereço: </span>{familia.dadosFamilia ? familia.dadosFamilia.endereco : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Número: </span>{familia.dadosFamilia ? familia.dadosFamilia.numeroCasa : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Cidade: </span>{familia.dadosFamilia ? familia.dadosFamilia.cidade : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Região: </span>{familia.dadosFamilia ? familia.dadosFamilia.regiao : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Telefone: </span>{familia.dadosFamilia ? familia.dadosFamilia.telefone : "Loading..."}</p>
                <p className="familyData"><span className="familyAttribute">Dono do Telefone: </span>{familia.dadosFamilia ? familia.dadosFamilia.donoTelefone : "Loading..."}</p>
            </div>
            <div className="familyDetailsBtnContainer">
                <button className="familyDetailsBtn">Localização</button>
                <button className="familyDetailsBtn">Tabela Socioeconômica</button>
                <button className="familyDetailsBtn">Tabela Estrutural</button>
                <button className="familyDetailsBtn">Arquivos</button>
                <button 
                    className="familyDetailsBtn" 
                    onClick={() => {
                        setTabelaUsuariosParaAssociar(<Tabela 
                            dados={usuarios}
                            firstHeader={"Nome"}
                            secondHeader={"Tipo de Usuário"}
                            getFirstHeader={getNomeUsuario}
                            getSecondHeader={getTipoUsuario}
                            action={associaUsuario}
                        />);
                        apareceDialog(referenciaDialog1);
                    }}
                >Associar Usuarios</button>
                <button
                    className="familyDetailsBtn"
                    onClick={() => {
                        setTabelaUsuariosAssociados(<Tabela
                            dados={usuariosAssociados}
                            firstHeader={"Nome"}
                            secondHeader={"Tipo de Usuário"}
                            getFirstHeader={getNomeUsuario}
                            getSecondHeader={getTipoUsuario}
                        />);
                        apareceDialog(referenciaDialog2);
                    }}
                >Usuarios Associados</button>
                <button className="familyDetailsBtn">Editar Família</button>
                <button 
                    className="familyDetailsBtn"
                    onClick={deletaFamilia}
                >
                    Excluir Família
                </button>
            </div>
            <dialog ref={referenciaDialog1} className="dialogContainer">
                {tabelaUsuariosParaAssociar}
                <button onClick={() => {apareceDialog(referenciaDialog1)}}>Fechar</button>
            </dialog>
            <dialog ref={referenciaDialog2} className="dialogContainer">
                {tabelaUsuariosAssociados}
                <button onClick={() => {apareceDialog(referenciaDialog2)}}>Fechar</button>
            </dialog>
        </div>
    )
}

export default Componente;