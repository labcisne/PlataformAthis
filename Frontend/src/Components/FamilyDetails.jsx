import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Tabela from "./Tabela";

import "./FamilyDetails.css";

import { FaArrowLeft } from "react-icons/fa6";

import { IconContext } from "react-icons";

function Componente() {

    const [tabelaUsuariosParaAssociar, setTabelaUsuariosParaAssociar] = useState(null);
    const [tabelaUsuariosAssociados, setTabelaUsuariosAssociados] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosAssociados, setUsuariosAssociados] = useState([]);

    const referenciaDialog1 = useRef(null);
    const referenciaDialog2 = useRef(null);
    const referenciaDialog3 = useRef(null);

    const [familia, setFamilia] = useState({});
    const [familiaEditada, setFamiliaEditada] = useState({});
    const [modoEdicao, setModoEdicao] = useState(false);
    const [localizacao, setLocalizacao] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const familiaId = location.state?.id;
    const role = location.state?.role;

    const listaCidades  = [
        'Cariacica',
        'Fundão',
        'Guarapari',
        'Serra',
        'Viana',
        'Vila Velha',
        'Vitória'
    ];

    useEffect(() => {
        axios.get(`http://localhost:3000/familia/${familiaId}`, {withCredentials:true})
        .then((response) => {
                setFamilia(response.data.familia.dadosFamilia);
                setFamiliaEditada(response.data.familia.dadosFamilia);
                setLocalizacao(response.data.familia.localizacaoFamilia);
                if(role === "Administrador" || role === "Entrevistador"){
                    const usuariosAssociadosId = response.data.familia.usuariosAssociados;
                    return axios.get("http://localhost:3000/familia/usuariosAssociados", {params: {usuariosAssociadosId}, withCredentials: true})
                }
                else return undefined
            })
        .then((response => {if(response) setUsuariosAssociados(response.data.users);
                            else setUsuariosAssociados([]);
        }))
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
            .then(() => {
                alert("Família deletada com sucesso");
                navigate("/menu");
            })
            .catch((error) => console.log(error));
    }

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFamiliaEditada({...familiaEditada, [name]: value});
    }

    const salvarAlteracoes = () => {
        if(familiaEditada.regiao){
            familiaEditada.regiao = familiaEditada.regiao.trim().toLowerCase();
        }
        else{
            familiaEditada.regiao = "Data not found"
        }
        axios.patch(`http://localhost:3000/familia/${familiaId}`, {familiaEditada}, {params: {userRole: role}, withCredentials: true})
        .then((response) => {
            setFamilia(response.data.newFamily);
            alert("Dados da família alterados com sucesso!");
            setModoEdicao(false);
        })
        .catch(error => console.log(error));
    }

    const getLocalizacao = () => {
        const googleMapsLink = `https://www.google.com/maps?q=${localizacao.latitude},${localizacao.longitude}`;
        window.open(googleMapsLink, "_blank");
    }

    return (
        <div className="container">
            {modoEdicao ? (
                <button className="returnBtn" onClick={() => setModoEdicao(false)}>
                    <IconContext.Provider value={{size: "2rem"}}>
                        <FaArrowLeft />
                    </IconContext.Provider>
                </button>
            ) : (

                <button className="returnBtn" onClick={() => navigate("/menu")}>
                    <IconContext.Provider value={{size: "2rem"}}>
                        <FaArrowLeft />
                    </IconContext.Provider>
                </button>
            )}
            <h3 className="detailsHeader">Dados da família:</h3>
            <div className="detailsContainer">
                {modoEdicao ? (
                    <div>
                        <div className="celula">
                            <label htmlFor="" className="familyAttribute">Nome do Morador:</label>
                            <input 
                                type="text"
                                name="nomeMorador"
                                value={familiaEditada ? familiaEditada.nomeMorador : "Loading..."}
                                placeholder="Nome do morador"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="celula">
                            <label htmlFor="" className="familyAttribute">Documento:</label>
                            <input 
                                type="text"
                                name="documentoResponsavel"
                                value={familiaEditada ? familiaEditada.documentoResponsavel : "Loading..."}
                                placeholder="Nº documento"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="celula">
                            <label htmlFor="" className="familyAttribute">Tipo de Documento:</label>
                            <div style={{display: "flex", gap: "8px"}}>
                                <div>
                                    <input 
                                        type="checkbox"
                                        name="opcaoSelecionada"
                                        value={"cpf"}
                                        checked={familiaEditada?.opcaoSelecionada === "cpf"}
                                        onChange={handleInputChange}
                                        id="cpfEdit"
                                    />
                                    <label htmlFor="cpfEdit" className="checkLabel">CPF</label>
                                </div>
                                <div>
                                    <input 
                                        type="checkbox"
                                        name="opcaoSelecionada"
                                        value={"rg"}
                                        checked={familiaEditada?.opcaoSelecionada === "rg"}
                                        onChange={handleInputChange}
                                        id="rgEdit"
                                    />
                                    <label htmlFor="rgEdit" className="checkLabel">RG</label>
                                </div>
                            </div>
                        </div>
                        <div className="celula">
                            <label htmlFor="" className="familyAttribute">Endereço:</label>
                            <input 
                                type="text"
                                name="endereco"
                                value={familiaEditada ? familiaEditada.endereco : "Loading..."}
                                placeholder="Endereço"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="celula">
                            <label htmlFor="" className="familyAttribute">Número:</label>
                            <input 
                                type="text"
                                name="numeroCasa"
                                value={familiaEditada ? familiaEditada.numeroCasa : "Loading..."}
                                placeholder="Número"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="celula">
                            <label htmlFor="" className="familyAttribute">Cidade:</label>
                            <select 
                                name="cidade"
                                value={familiaEditada?.cidade}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>
                                    Escolha uma cidade
                                </option>
                                {listaCidades.map((cidade, index) => (
                                    <option key={index} value={cidade}>
                                        {cidade}
                                    </option>
                                ))}                                 
                            </select>
                        </div>
                        <div className="celula">
                            <label htmlFor="" className="familyAttribute">Região:</label>
                            <input 
                                type="text"
                                name="regiao"
                                value={familiaEditada ? familiaEditada.regiao : "Loading..."}
                                placeholder="Região"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="celula">
                            <label htmlFor="" className="familyAttribute">Telefone:</label>
                            <input 
                                type="text"
                                name="telefone"
                                value={familiaEditada ? familiaEditada.telefone : "Loading..."}
                                placeholder="(27)12345-6789"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="celula">
                            <label htmlFor="" className="familyAttribute">Dono do Telefone:</label>
                            <input 
                                type="text"
                                name="donoTelefone"
                                value={familiaEditada ? familiaEditada.donoTelefone : "Loading..."}
                                placeholder="Dono tel."
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    
                ) : (
                    <div>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>ID: </span>{familiaId ? familiaId : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Nome do Morador: </span>{familia ? familia.nomeMorador : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Documento: </span>{familia ? familia.documentoResponsavel : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Tipo de Documento: </span>{familia ? familia.opcaoSelecionada?.toUpperCase() : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Endereço: </span>{familia ? familia.endereco : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Número: </span>{familia ? familia.numeroCasa : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Cidade: </span>{familia ? familia.cidade : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Região: </span>{familia ? familia.regiao : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Telefone: </span>{familia ? familia.telefone : "Loading..."}</p>
                        <p className="detailsData"><span style={{fontWeight: "bold"}}>Dono do Telefone: </span>{familia ? familia.donoTelefone : "Loading..."}</p>
                    </div>
                )}
                {(role === "Administrador" || role === "Entrevistador") ? (

                    modoEdicao ? (
                        <button 
                            className="familyDetailsBtn editDeleteBtn"
                            onClick={salvarAlteracoes}                        
                        >
                            Salvar alterações
                        </button>
                    ) : (
                        <div 
                            style={{display: "flex", gap: "12px"}}
                        >
                            <button
                                className="familyDetailsBtn"
                                onClick={() => {navigate("/familia/entrevista", {state: {id: familiaId, role}});}}
                            >
                                Realizar entrevista
                            </button>

                            <button
                                className="familyDetailsBtn editDeleteBtn"
                                onClick={() => {setModoEdicao(true)}}
                            >
                                Editar Família
                            </button>

                            <button 
                                className="familyDetailsBtn editDeleteBtn"
                                onClick={() => apareceDialog(referenciaDialog3)}
                            >
                                Deletar Família
                            </button>
                        </div>
                    )
                ) : (
                    <></>
                )}
            </div>
            <div className="familyDetailsBtnContainer">
                <button 
                    className="familyDetailsBtn"
                    onClick={getLocalizacao}
                >
                    Localização
                </button>
                <button 
                    className="familyDetailsBtn"
                    onClick={() => navigate("/familia/dadosFamilia/dadosFacilities", {state: {id: familiaId, role}})}
                >
                    Dados Formulário Socioeconômico
                </button>
                <button
                    className="familyDetailsBtn"
                    onClick={() => navigate("/familia/dadosFamilia/dadosEstrutural", {state: {id: familiaId, role}})}
                >
                    Dados Formulário Estrutural
                </button>
                <button 
                    className="familyDetailsBtn"
                    onClick={() => navigate("/familia/dadosFamilia/arquivos", {state: {id: familiaId, role}})}
                >
                    Arquivos
                </button>
                {(role === "Administrador" || role === "Entrevistador") && (
                    <>
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
                        >
                            Usuarios Associados
                        </button>
                    </>
                )}
                
            </div>
            <dialog ref={referenciaDialog1} className="dialogContainer">
                {tabelaUsuariosParaAssociar}
                <button className="detailsBtn" onClick={() => {apareceDialog(referenciaDialog1)}}>Fechar</button>
            </dialog>
            <dialog ref={referenciaDialog2} className="dialogContainer">
                {tabelaUsuariosAssociados}
                <button className="detailsBtn" onClick={() => {apareceDialog(referenciaDialog2)}}>Fechar</button>
            </dialog>
            <dialog ref={referenciaDialog3} className="dialogOnImg">
                <h3 style={{marginBottom:"8px"}}>Tem certeza que gostaria de deletar a família?</h3>
                <div style={{display: "flex", justifyContent:"center", gap: "8px"}}>
                    <button
                        className="detailsBtn"
                        onClick={() => apareceDialog(referenciaDialog3)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="detailsBtn"
                        onClick={() => {
                            apareceDialog(referenciaDialog3);
                            deletaFamilia();
                        }}
                    >
                        Deletar
                    </button>
                </div>
            </dialog>
        </div>
    )
}

export default Componente;