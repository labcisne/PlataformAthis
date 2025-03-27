import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { IconContext } from "react-icons";

function Imagens(){

    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [descricao, setDescricao] = useState("");
    const [imagens, setImagens] = useState([]);

    const referenciaDialog = useRef(null);
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

        axios.post(`http://localhost:3000/familia/upload/${familiaId}`, formData, {
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
        axios.delete(`http://localhost:3000/familia/upload/${familiaId}`, {
            data: {
                caminhoArquivo: caminho
            },
            withCredentials: true
        })
        .then((response) => setImagens(response.data.imagens))
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
            axios.patch(`http://localhost:3000/familia/upload/${familiaId}`, {
                
                caminhoArquivo: caminho,
                novaDescricao
            },
            {withCredentials: true})
            .then((response) => setImagens(response.data.imagens))
            .catch((error) => console.log(error));
            setNovaDescricao("");
        }
    }

    return (

        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia", {state: {id: familiaId, role}})}>
                ⬅
            </button>
            <div style={{textAlign: "left"}}>
                <div style={{display: "flex", flexDirection:"column", gap: "8px", marginBottom: "8px"}}>
                    <h2>Upload de Imagens</h2>
                    <div className="uploadContainer">
                        <label htmlFor="imgFile" className="detailsBtn">Escolha uma Imagem</label>
                        <input 
                            type="file" 
                            onChange={(event) => {setArquivoSelecionado(event.target.files[0])}}
                            id="imgFile"
                        />
                        {arquivoSelecionado && (
                            <p style={{color:"green"}}>Arquivo selecionado com sucesso!</p>
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
                                        src={`http://localhost:3000/familia/dadosFamilia/arquivos${image.caminho}`} 
                                        alt="Upload" 
                                        style={{ width: '100px', height: '100px'}}
                                    />
                                    <a
                                        href={`http://localhost:3000/familia/dadosFamilia/arquivos${image.caminho}`}
                                        target="_blank"
                                        className="imgDescriptionLink"
                                    >
                                        <p>{image.descricao}</p>
                                    </a>
                                </div>
                                <div style={{display:"flex", gap: "8px"}}>
                                    <button 
                                        className="imgBtn" 
                                        onClick={() => {
                                            setImagemParaEditar(image.caminho);
                                            apareceDialog();
                                        }}
                                    >
                                        <IconContext.Provider value={{size: "1.5rem"}}>        
                                            <MdEdit />
                                        </IconContext.Provider>
                                    </button>
                                    <button className="imgBtn" onClick={() => handleDelete(image.caminho)}>
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
                <div style={{display: "flex", flexDirection: "column", gap: "8px", width: "100%"}}>
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
                                handleEdit(imagemParaEditar);
                                setImagemParaEditar("");
                                apareceDialog();
                            }}
                            className="detailsBtn"
                        >
                            Confirmar
                        </button>
                        <button
                            onClick={() => {
                                setImagemParaEditar("");
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

export default Imagens;