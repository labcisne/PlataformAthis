import { useState, useEffect } from "react";
import axios from "axios";

function Select({ callback, name }){

    const [opcaoSelecionada, setOpcaoSelecionada] = useState("");
    const [opcoes, setOpcoes] = useState([]);
    const [novaOpcao, setNovaOpcao] = useState("");
    const [adicionarOpcao, setAdicionarOpcao] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3000/options/${name}`)
            .then((response) => setOpcoes(response.data.opcoes))
            .catch((error) => console.log(error));
    }, [])

    const adicionaNoBanco = (elemento) => {
        axios.post(`http://localhost:3000/options/${name}`, {opcao: elemento})
            .then((response) => console.log(response.data))
            .catch((error) => console.log(error));
    }

    const handleChange = (event) => {
        
        if(event.target.value === "adicionar"){
            setAdicionarOpcao(true);
            setOpcaoSelecionada("adicionar");
            callback("");
        }
        else{
            setOpcaoSelecionada(event.target.value);
            callback(event.target.value);
            setAdicionarOpcao(false);
        }
    }

    const handleConfirm = () => {
        if(novaOpcao && !opcoes.includes(novaOpcao)){
            setOpcoes([...opcoes, novaOpcao]);
            setOpcaoSelecionada(novaOpcao);
            callback(novaOpcao);
            setNovaOpcao("");
            setAdicionarOpcao(false);
            adicionaNoBanco(novaOpcao);
        }
        else{
            setOpcaoSelecionada(novaOpcao);
            callback(novaOpcao);
            setNovaOpcao("");
            setAdicionarOpcao(false);
        }
    }

    const handleCancel = () => {
        setOpcaoSelecionada("");
        callback("");
        setNovaOpcao("");
        setAdicionarOpcao(false);
    }

    return (
        <div>
            <select value={opcaoSelecionada} onChange={handleChange}>
                <option value="" disabled>Escolha uma opção</option>
                {opcoes.map((opcao, idx) => (
                    <option value={opcao} key={idx}>{opcao}</option>
                ))}
                <option value="adicionar">Adicionar opção</option>
            </select>
            {adicionarOpcao && (
                <div>
                    <input 
                        type="text"
                        style={{marginTop: "8px"}}
                        placeholder="Nova opção"
                        value={novaOpcao}
                        onChange={(event) => setNovaOpcao(event.target.value)}
                    />
                    <div className="selectBtnContainer">
                        <button onClick={handleConfirm}>
                            Confirmar
                        </button>
                        <button onClick={handleCancel}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Select;