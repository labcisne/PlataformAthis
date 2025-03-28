import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";

import { IconContext } from "react-icons";

function ArquivosGerais(){
    
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [descricao, setDescricao] = useState("");
    const [arquivos, setArquivos] = useState([]);

    const referenciaDialog = useRef(null);
    const [arquivoParaEditar, setArquivoParaEditar] = useState("");
    const [novaDescricao, setNovaDescricao] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    useEffect(() => {
        axios.get(`http://localhost:3000/familia/${familiaId}`, {withCredentials: true})
        .then((response) => setArquivos(response.data.familia.arquivos))
        .catch((error) => console.log(error));
    }, []);

    const handleUpload = () => {
        if(!arquivoSelecionado){
            alert("Selecione pelo menos um arquivo!");
            return;
        }

        const formData = new FormData();
        formData.append("arquivo", arquivoSelecionado);
        formData.append("descricao", descricao);

        axios.post(`http://localhost:3000/familia/upload/arquivo/${familiaId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
        .then((response) => {
            setArquivos(response.data.arquivos);
            alert("Arquivo enviado com sucesso!");
            setArquivoSelecionado(null);
            setDescricao("");
        })
        .catch((error) => console.log(error));
    }

    const handleDelete = (caminho) => {
        axios.delete(`http://localhost:3000/familia/upload/arquivo/${familiaId}`, {
            data: {
                caminhoArquivo: caminho
            },
            withCredentials: true
        })
        .then((response) => setArquivos(response.data.arquivos))
        .catch((error) => console.log(error));
    }

    const apareceDialog = () => {
        if(!referenciaDialog.current){
            return;
        }

        referenciaDialog.current.hasAttribute("open")
            ? referenciaDialog.current.close()
            : referenciaDialog.current.showModal();
    }

    const handleEdit = (caminho) => {
        if(novaDescricao){
            axios.patch(`http://localhost:3000/familia/upload/arquivo/${familiaId}`, {
                
                caminhoArquivo: caminho,
                novaDescricao
            },
            {withCredentials: true})
            .then((response) => setArquivos(response.data.arquivos))
            .catch((error) => console.log(error));
            setNovaDescricao("");
        }
    }

    return(
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia/arquivos", {state: {id: familiaId, role}})}>
                ⬅
            </button>
            <div style={{textAlign:"left"}}>

                <div style={{display: "flex", flexDirection:"column", gap: "8px", marginBottom: "8px"}}>
                    <h2>Upload de Arquivo</h2>
                    <div className="uploadContainer">
                        <label htmlFor="arqFile" className="detailsBtn">Escolha um Arquivo</label>
                        <input 
                            type="file" 
                            onChange={(event) => {setArquivoSelecionado(event.target.files[0])}}
                            id="arqFile"
                        />
                        {arquivoSelecionado && (
                            <p style={{color:"green"}}>Arquivo selecionado com sucesso!</p>
                        )}
                    </div>
                    <div className="descriptionContainer">
                        <input 
                            type="text" 
                            placeholder="Descrição do arquivo"
                            value={descricao}
                            onChange={(event) => setDescricao(event.target.value)}
                        />
                        <button 
                            onClick={handleUpload}
                            className="detailsBtn"
                        >
                            Enviar
                        </button>
                    </div>
                </div>

                <div>
                    <h3 style={{marginBottom:"8px"}}>Arquivos enviados</h3>
                    <div style={{display:"flex", flexDirection:"column"}}>
                        {arquivos?.map((arquivo, index) => (
                            <div key={index} className="imgContainer">
                                <div className="imgAndDescriptionContainer">
                                    <div>
                                        <IconContext.Provider value={{size: "3.5rem"}}>
                                            <FaFileAlt />
                                        </IconContext.Provider>
                                    </div>
                                    <a 
                                        href={`http://localhost:3000/familia/dadosFamilia/arquivosGerais${arquivo.caminho}`}
                                        target="_blank"
                                        className="imgDescriptionLink"
                                    >
                                        <p>{arquivo.descricao}</p>
                                    </a>
                                </div>

                                <div style={{display:"flex", gap: "8px"}}>
                                    <button 
                                        className="imgBtn" 
                                        onClick={() =>{
                                            setArquivoParaEditar(arquivo.caminho);
                                            apareceDialog();
                                        }}
                                    >
                                        <IconContext.Provider value={{size: "1.5rem"}}>        
                                            <MdEdit />
                                        </IconContext.Provider>
                                    </button>
                                    <button className="imgBtn" onClick={() => handleDelete(arquivo.caminho)}>
                                        <IconContext.Provider value={{size: "1.3rem"}}>        
                                            <FaTrash />
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <dialog ref={referenciaDialog} className="dialogOnImg">
                <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                    <div>
                        <input 
                            type="text"
                            placeholder="Descricao do arquivo"
                            value={novaDescricao}
                            onChange={(event) => setNovaDescricao(event.target.value)}
                        />
                    </div>
                    <div style={{display:"flex", justifyContent:"space-evenly"}}>
                        <button
                            onClick={() => {
                                handleEdit(arquivoParaEditar);
                                setArquivoParaEditar("");
                                apareceDialog();
                            }}
                            className="detailsBtn"
                        >
                            Confirmar
                        </button>
                        <button
                            onClick={() => {
                                setArquivoParaEditar("");
                                setNovaDescricao("");
                                apareceDialog();
                            }}
                            className="detailsBtn"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default ArquivosGerais;