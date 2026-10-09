import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { FaArrowLeft } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

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
            .then(response => setImagens((response.data.imagens || []).map(imagem => ({
                ...imagem,
                imagemUrl: `http://localhost:3000${imagem.imagemUrl}`
            }))))
            .catch(() => setImagens([]))
            .finally(() => setCarregandoImagens(false));
    }, [familiaId]);

    const categorias = [...new Set(imagens.map(imagem => imagem.tipo))];
    const imagensDaCategoria = imagens.filter(imagem => imagem.tipo === categoriaSelecionada);

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
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "16px" }}>
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
                        )}
                    </>
                )}
            </div>
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