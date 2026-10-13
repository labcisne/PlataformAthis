import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { FaArrowLeft } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

import { IconContext } from "react-icons";

function Arquivos(){

    const location = useLocation();
    const navigate = useNavigate();

    const familiaId = location.state?.id;
    const role = location.state?.role;
    const [imagens, setImagens] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [carregandoImagens, setCarregandoImagens] = useState(true);
    const [imagemEmPreview, setImagemEmPreview] = useState(null);
    const [excluindoImagem, setExcluindoImagem] = useState(false);
    const [baixandoCategoria, setBaixandoCategoria] = useState(false);
    const [edificacoes, setEdificacoes] = useState([]);
    const [edificacaoSelecionada, setEdificacaoSelecionada] = useState("");
    const [arquivoCategoria, setArquivoCategoria] = useState(null);
    const [enviandoCategoria, setEnviandoCategoria] = useState(false);
    const arquivoCategoriaRef = useRef(null);
    const referenciaCamera = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const nomesCategorias = {
        FUNDACAO: "Fotos fundação",
        LOCALIZACAO: "Fotos localização",
        ESTRUTURA: "Fotos estrutura",
        VEDACOES: "Fotos vedações",
        COBERTURA: "Fotos cobertura",
        ESQUADRIAS: "Fotos esquadrias",
        HIDROSANITARIO: "Fotos hidrossanitário",
        ELETRICO: "Fotos elétrico",
        BANHEIROS: "Fotos banheiro",
        COZINHA_SERVICO: "Fotos cozinha e área de serviço",
        OUTROS: "Fotos outros"
    };

    useEffect(() => {
            axios.get(`http://localhost:3000/familia/imagens-edificacoes/${familiaId}`, { withCredentials: true })
            .then(response => {
                setImagens((response.data.imagens || []).map(imagem => ({
                    ...imagem,
                    imagemUrl: `http://localhost:3000${imagem.imagemUrl}`
                })));
                const listaEdificacoes = response.data.edificacoes || [];
                setEdificacoes(listaEdificacoes);
                if (listaEdificacoes.length === 1) setEdificacaoSelecionada(listaEdificacoes[0].id);
            })
            .catch(() => setImagens([]))
            .finally(() => setCarregandoImagens(false));
    }, [familiaId]);

    const categorias = Object.keys(nomesCategorias);
    const imagensDaCategoria = imagens.filter(imagem => imagem.tipo === categoriaSelecionada);

    const enviarImagemCategoria = async (arquivoParaEnviar = arquivoCategoria) => {
        if (!arquivoParaEnviar || !categoriaSelecionada || !edificacaoSelecionada || enviandoCategoria) return;
        setEnviandoCategoria(true);
        const formData = new FormData();
        formData.append("image", arquivoParaEnviar);
        try {
            const response = await axios.post(
                `http://localhost:3000/familia/imagens-edificacoes/${familiaId}/${edificacaoSelecionada}/${categoriaSelecionada}/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
            );
            setImagens(imagensAtuais => [...imagensAtuais, {
                ...response.data,
                imagemUrl: `http://localhost:3000${response.data.imagemUrl}`
            }]);
            setArquivoCategoria(null);
            if (arquivoCategoriaRef.current) arquivoCategoriaRef.current.value = "";
        } catch (error) {
            window.alert(error.response?.data?.message || "Não foi possível enviar a imagem.");
        } finally {
            setEnviandoCategoria(false);
        }
    };

    const fechaCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
        referenciaCamera.current?.close();
    };

    const acessaCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            referenciaCamera.current?.showModal();
        } catch (error) {
            window.alert("Não foi possível acessar a câmera.");
        }
    };

    const tirarFoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video?.videoWidth || !canvas) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        const bytes = atob(dataUrl.split(",")[1]);
        const buffer = new Uint8Array(bytes.length);
        for (let index = 0; index < bytes.length; index += 1) buffer[index] = bytes.charCodeAt(index);
        const arquivo = new File([buffer], "foto-camera.jpg", { type: "image/jpeg" });
        fechaCamera();
        setArquivoCategoria(arquivo);
        enviarImagemCategoria(arquivo);
    };

    const excluirImagem = async () => {
        if (!imagemEmPreview || !window.confirm("Excluir esta foto da edificação?")) return;
        setExcluindoImagem(true);
        try {
            await axios.delete(`http://localhost:3000/familia/imagens-edificacoes/${familiaId}/${imagemEmPreview.id}`, { withCredentials: true });
            setImagens(imagensAtuais => imagensAtuais.filter(imagem => imagem.id !== imagemEmPreview.id));
            setImagemEmPreview(null);
        } catch (error) {
            window.alert("Não foi possível excluir a foto.");
        } finally {
            setExcluindoImagem(false);
        }
    };

    const baixarCategoria = async () => {
        if (!categoriaSelecionada || baixandoCategoria) return;
        setBaixandoCategoria(true);
        try {
            const response = await fetch(`http://localhost:3000/familia/imagens-edificacoes/${familiaId}/${encodeURIComponent(categoriaSelecionada)}/zip`, { credentials: "include" });
            if (!response.ok) throw new Error(`Download HTTP ${response.status}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `fotos-${categoriaSelecionada.toLowerCase()}.zip`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            window.alert(error.message.includes("HTTP 404") ? "Nenhuma foto encontrada nesta categoria." : "Não foi possível baixar todas as fotos da categoria.");
        } finally {
            setBaixandoCategoria(false);
        }
    };

    const baixarImagem = async () => {
        if (!imagemEmPreview) return;
        try {
            const response = await fetch(`${imagemEmPreview.imagemUrl}?download=1`, { credentials: "include" });
            if (!response.ok) throw new Error(`Download HTTP ${response.status}`);
            const blob = await response.blob();
            const contentDisposition = response.headers.get("content-disposition");
            const filename = contentDisposition?.match(/filename="?([^";]+)"?/i)?.[1]
                || `imagem-${imagemEmPreview.id}.${blob.type.split("/")[1] || "bin"}`;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            window.alert("Não foi possível baixar a foto.");
        }
    };

    const navImagens = () => {
        navigate("/familia/dadosFamilia/arquivos/imagens", {state: {id: familiaId, role}})
    }

    const navArquivosGerais = () => {
        navigate("/familia/dadosFamilia/arquivos/arquivosGerais", {state: {id: familiaId, role}})
    }

    return (
        <div className="container">
            <button className="returnBtn" onClick={() => navigate("/familia/dadosFamilia", {state: {id: familiaId, role}})}>
                <IconContext.Provider value={{size: "2rem"}}>
                    <FaArrowLeft />
                </IconContext.Provider>
            </button>
            <h2 style={{marginBottom: "16px"}}>Escolha uma das opções</h2>
            <div style={{display: "flex", gap:"10px"}}>
                <button 
                    className="familyDetailsBtn"
                    onClick={navImagens}
                >
                    Adicionar fotos
                </button>
                <button 
                    className="familyDetailsBtn"
                    onClick={navArquivosGerais}
                >
                    Adicionar arquivos
                </button>
            </div>
            <div style={{ marginTop: "24px", textAlign: "left" }}>
                <h3>Imagens das edificações</h3>
                {carregandoImagens ? <p>Carregando categorias...</p> : categorias.length === 0 ? (
                    <p>Nenhuma imagem de edificação disponível.</p>
                ) : (
                    <>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                            {categorias.map(categoria => (
                                <button
                                    key={categoria}
                                    className="familyDetailsBtn"
                                    onClick={() => setCategoriaSelecionada(categoria)}
                                >
                                    {nomesCategorias[categoria] || categoria}
                                </button>
                            ))}
                        </div>
                        {categoriaSelecionada && (
                            <div style={{ marginTop: "16px" }}>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                                    {edificacoes.length > 1 && (
                                        <select value={edificacaoSelecionada} onChange={event => setEdificacaoSelecionada(event.target.value)}>
                                            <option value="">Selecione a edificação</option>
                                            {edificacoes.map((edificacao, index) => <option key={edificacao.id} value={edificacao.id}>Edificação {index + 1}</option>)}
                                        </select>
                                    )}
                                    <input ref={arquivoCategoriaRef} type="file" accept="image/*" onChange={event => setArquivoCategoria(event.target.files?.[0] || null)} />
                                    <button className="imgBtn" type="button" onClick={acessaCamera} disabled={!edificacaoSelecionada || enviandoCategoria} title="Tirar foto">
                                        <IconContext.Provider value={{ size: "1.2rem" }}><FaCamera /></IconContext.Provider>
                                    </button>
                                    <button className="familyDetailsBtn" type="button" onClick={enviarImagemCategoria} disabled={!arquivoCategoria || !edificacaoSelecionada || enviandoCategoria}>
                                        {enviandoCategoria ? "Enviando..." : "Enviar foto"}
                                    </button>
                                </div>
                                {!edificacoes.length && <p>Nenhuma edificação disponível para esta família.</p>}
                                <button className="familyDetailsBtn" type="button" onClick={baixarCategoria} disabled={baixandoCategoria}>
                                    {baixandoCategoria ? "Preparando ZIP..." : "Baixar todas as fotos"}
                                </button>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
                                {imagensDaCategoria.length === 0 ? <p>Nenhuma imagem nesta categoria.</p> : imagensDaCategoria.map(imagem => (
                                    <button
                                        key={imagem.id}
                                        type="button"
                                        onClick={() => setImagemEmPreview(imagem)}
                                        style={{ border: "none", padding: 0, background: "transparent", cursor: "pointer" }}
                                    >
                                        <img
                                            src={imagem.imagemUrl}
                                            alt={imagem.descricao || nomesCategorias[imagem.tipo] || "Imagem da edificação"}
                                            loading="lazy"
                                            onError={event => { event.currentTarget.style.display = "none"; }}
                                            style={{ width: "110px", height: "110px", objectFit: "cover" }}
                                        />
                                    </button>
                                ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <dialog ref={referenciaCamera} className="dialogOnImg">
                <video ref={videoRef} width="380px" autoPlay playsInline />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div style={{ display: "flex", justifyContent: "space-evenly", gap: "8px", marginTop: "8px" }}>
                    <button className="detailsBtn" type="button" onClick={fechaCamera}>Cancelar</button>
                    <button className="detailsBtn" type="button" onClick={tirarFoto}>Capturar e enviar</button>
                </div>
            </dialog>
            {imagemEmPreview && (
                <div
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setImagemEmPreview(null)}
                    style={{ position: "fixed", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.75)" }}
                >
                    <div onClick={event => event.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", background: "white", padding: "16px", textAlign: "center" }}>
                        <img src={imagemEmPreview.imagemUrl} alt={imagemEmPreview.descricao || "Imagem da edificação"} style={{ maxWidth: "80vw", maxHeight: "70vh", objectFit: "contain" }} />
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "12px" }}>
                            <button className="imgBtn" type="button" onClick={baixarImagem} title="Baixar foto">
                                <IconContext.Provider value={{ size: "1.2rem" }}><IoMdDownload /></IconContext.Provider>
                            </button>
                            <button className="imgBtn" type="button" onClick={excluirImagem} disabled={excluindoImagem} title="Excluir foto">
                                <IconContext.Provider value={{ size: "1.2rem" }}><FaTrash /></IconContext.Provider>
                            </button>
                            <button className="detailsBtn" type="button" onClick={() => setImagemEmPreview(null)}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Arquivos;