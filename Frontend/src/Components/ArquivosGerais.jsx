import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

import { IconContext } from "react-icons";

function ArquivosGerais(){
    
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [descricao, setDescricao] = useState("");
    const [arquivos, setArquivos] = useState([]);

    const referenciaDialog1 = useRef(null);
    const referenciaDialog2 = useRef(null);

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

    const apareceDialog = (referenciaDialog) => {
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

    const handleDownload = async (caminho) => {
        
        try {
            // Busca o arquivo direto do link da API
            const response = await fetch(`http://localhost:3000/familia/dadosFamilia/arquivosGerais${caminho}`);

            // Converte o arquivo buscado em um objeto de arquivo para download
            const blob = await response.blob();  

            // Cria um link temporário para o arquivo (que agora é um objeto)
            const url = window.URL.createObjectURL(blob);

            // Cria um <a> tag e atribuit que a sua href será a url temporária criada anteriormente
            const link = document.createElement("a");
            link.href = url;

            // Seta qual será o nome do arquivo para download
            link.setAttribute("download", caminho.split('/').pop());

            // Insere o arquivo no body do documento, clica no link para realizar o download e remove o link do documento
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Remove o link temporário do objeto
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao baixar a imagem:", error);
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
                                        <IconContext.Provider value={{size: "2.8rem"}}>
                                            <FaFileAlt />
                                        </IconContext.Provider>
                                    </div>
                                    <a 
                                        href={`http://localhost:3000/familia/dadosFamilia/arquivosGerais${arquivo.caminho}`}
                                        target="_blank"
                                        className="imgDescriptionLink"
                                    >
                                        <p style={{fontSize: "0.9rem"}}>{arquivo.descricao}</p>
                                    </a>
                                </div>

                                <div style={{display:"flex", gap: "8px"}}>
                                    <button
                                        className="imgBtn"
                                        onClick={() => handleDownload(arquivo.caminho)}
                                    >
                                        <IconContext.Provider value={{size: "1.4rem"}}>        
                                            <IoMdDownload />
                                        </IconContext.Provider>
                                    </button>
                                    <button 
                                        className="imgBtn" 
                                        onClick={() =>{
                                            setArquivoParaEditar(arquivo.caminho);
                                            apareceDialog(referenciaDialog1);
                                        }}
                                    >
                                        <IconContext.Provider value={{size: "1.3rem"}}>        
                                            <MdEdit />
                                        </IconContext.Provider>
                                    </button>
                                    <button className="imgBtn" onClick={() => {
                                        setArquivoParaEditar(arquivo.caminho);
                                        apareceDialog(referenciaDialog2);
                                    }}>
                                        <IconContext.Provider value={{size: "1.1rem"}}>        
                                            <FaTrash />
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <dialog ref={referenciaDialog1} className="dialogOnImg">
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
                                setArquivoParaEditar("");
                                setNovaDescricao("");
                                apareceDialog(referenciaDialog1);
                            }}
                            className="detailsBtn"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={() => {
                                handleEdit(arquivoParaEditar);
                                setArquivoParaEditar("");
                                apareceDialog(referenciaDialog1);
                            }}
                            className="detailsBtn"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </dialog>
            <dialog ref={referenciaDialog2} className="dialogOnImg">
                <h3 style={{marginBottom:"8px"}}>Tem certeza que gostaria de deletar o arquivo?</h3>
                <div style={{display: "flex", justifyContent:"center", gap: "8px"}}>
                    <button
                        className="detailsBtn"
                        onClick={() => {
                            setArquivoParaEditar("");
                            apareceDialog(referenciaDialog2);
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        className="detailsBtn"
                        onClick={() => {
                            handleDelete(arquivoParaEditar);
                            setArquivoParaEditar("");
                            apareceDialog(referenciaDialog2);
                        }}
                    >
                        Deletar
                    </button>
                </div>
            </dialog>
        </div>
    )
}

export default ArquivosGerais;