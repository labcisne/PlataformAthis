import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";

import { IconContext } from "react-icons";

function Imagens(){

    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [descricao, setDescricao] = useState("");
    const [imagens, setImagens] = useState([]);

    const referenciaDialog1 = useRef(null);
    const referenciaDialog2 = useRef(null);

    const [imagemParaEditar, setImagemParaEditar] = useState("");
    const [novaDescricao, setNovaDescricao] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const familiaId = location.state?.id;
    const role = location.state?.role;

    useEffect(() => {
        axios.get(`http://localhost:3000/familia/${familiaId}`, {withCredentials: true})
        .then((response) => setImagens(response.data.familia.imagens))
        .catch((error) => console.log(error));
    }, []);

    const handleUpload = () => {
        if(!arquivoSelecionado){
            alert("Selecione pelo menos uma imagem!");
            return;
        }

        const formData = new FormData();
        formData.append("image", arquivoSelecionado);
        formData.append("descricao", descricao);

        axios.post(`http://localhost:3000/familia/upload/imagem/${familiaId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
        .then((response) => {
            setImagens(response.data.imagens);
            alert("Imagem enviada com sucesso!");
            setArquivoSelecionado(null);
            setDescricao("");
        })
        .catch((error) => console.log(error));
    }

    const handleDelete = (caminho) => {
        axios.delete(`http://localhost:3000/familia/upload/imagem/${familiaId}`, {
            data: {
                caminhoArquivo: caminho
            },
            withCredentials: true
        })
        .then((response) => setImagens(response.data.imagens))
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
            axios.patch(`http://localhost:3000/familia/upload/imagem/${familiaId}`, {
                
                caminhoArquivo: caminho,
                novaDescricao
            },
            {withCredentials: true})
            .then((response) => setImagens(response.data.imagens))
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

    return (

        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia/arquivos", {state: {id: familiaId, role}})}>
                ⬅
            </button>
            <div style={{textAlign: "left"}}>
                <div style={{display: "flex", flexDirection:"column", gap: "8px", marginBottom: "8px"}}>
                    <h2>Upload de Imagem</h2>
                    <div className="uploadContainer">
                        <label htmlFor="imgFile" className="detailsBtn">Escolha uma Imagem</label>
                        <input 
                            type="file" 
                            onChange={(event) => {setArquivoSelecionado(event.target.files[0])}}
                            id="imgFile"
                        />
                        {arquivoSelecionado && (
                            <p style={{color:"green"}}>Imagem selecionada com sucesso!</p>
                        )}
                    </div>
                    <div className="descriptionContainer">
                        <input 
                            type="text" 
                            placeholder="Descrição da imagem"
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
                    <h3 style={{marginBottom:"8px"}}>Imagens Enviadas</h3>
                    <div style={{ display: 'flex', flexDirection:"column" }}>
                        {imagens?.map((image, index) => (
                            <div key={index} className="imgContainer">
                                <div className="imgAndDescriptionContainer">
                                    <img 
                                        src={`http://localhost:3000/familia/dadosFamilia/arquivosGerais${image.caminho}`} 
                                        alt="Upload" 
                                        style={{ width: '50px', height: '50px'}}
                                    />
                                    <a
                                        href={`http://localhost:3000/familia/dadosFamilia/arquivosGerais${image.caminho}`}
                                        target="_blank"
                                        className="imgDescriptionLink"
                                    >
                                        <p style={{fontSize: "0.9rem"}}>{image.descricao}</p>
                                    </a>
                                </div>
                                <div style={{display:"flex", gap: "8px"}}>
                                    <button
                                        className="imgBtn"
                                        onClick={() => handleDownload(image.caminho)}
                                    >
                                        <IconContext.Provider value={{size: "1.4rem"}}>        
                                            <IoMdDownload />
                                        </IconContext.Provider>
                                    </button>
                                    <button 
                                        className="imgBtn" 
                                        onClick={() => {
                                            setImagemParaEditar(image.caminho);
                                            apareceDialog(referenciaDialog1);
                                        }}
                                    >
                                        <IconContext.Provider value={{size: "1.3rem"}}>        
                                            <MdEdit />
                                        </IconContext.Provider>
                                    </button>
                                    <button className="imgBtn" onClick={() => {
                                        setImagemParaEditar(image.caminho);
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
                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Descrição da imagem"
                            value={novaDescricao}
                            onChange={(event) => setNovaDescricao(event.target.value)}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: "space-evenly"}}>
                        <button
                            onClick={() => {
                                setImagemParaEditar("");
                                setNovaDescricao("");
                                apareceDialog(referenciaDialog1);
                            }}
                            className="detailsBtn"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={() => {
                                handleEdit(imagemParaEditar);
                                setImagemParaEditar("");
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
                <h3 style={{marginBottom:"8px"}}>Tem certeza que gostaria de deletar a imagem?</h3>
                <div style={{display: "flex", justifyContent:"center", gap: "8px"}}>
                    <button
                        className="detailsBtn"
                        onClick={() => {
                            setImagemParaEditar("");
                            apareceDialog(referenciaDialog2);
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        className="detailsBtn"
                        onClick={() => {
                            handleDelete(imagemParaEditar);
                            setImagemParaEditar("");
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

export default Imagens;