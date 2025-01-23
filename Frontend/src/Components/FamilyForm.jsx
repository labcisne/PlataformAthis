import { useState } from "react";
import axios from "axios";

import Mapa from "./Mapa.jsx";

import "./FamilyForm.css";

function FamilyForm(){
    
    const [nomeMorador, setNomeMorador] = useState("");
    const [documentoResponsavel, setDocumentoResponsavel] = useState("");
    const [opcaoSelecionada, setOpocaoSelecionada] = useState("");
    const [endereco, setEndereco] = useState("");
    const [numeroCasa, setNumeroCasa] = useState("");
    const [telefone, setTelefone] = useState("");
    const [donoTelefone, setDonoTelefone] = useState("");

    const [cidadeSelecionada, setCidadeSelecionada] = useState("");
    const listaCidades  = [
        'Cariacica',
        'Fundão',
        'Guarapari',
        'Serra',
        'Viana',
        'Vila Velha',
        'Vitória'
    ];

    const [regiao, setRegiao] = useState("");
    const [localizacao, setLocalizacao] = useState(null);

    const handleGetLocalizacao = (location) => {
        setLocalizacao({
            latitude: location[0],
            longitude: location[1]
        });
    }

    const handleSubmit = (event) => {

        event.preventDefault();

        const obj = {
            nomeMorador,
            documentoResponsavel,
            opcaoSelecionada,
            endereco,
            numeroCasa,
            cidade: cidadeSelecionada,
            regiao: regiao.trim().toLowerCase(),
            telefone,
            donoTelefone,
        }

        axios.post("http://localhost:3000/familia", {dadosPessoais: obj, localizacao}, {withCredentials: true})
        .then((response) => {console.log(response.data); alert("família criada com sucesso")})
        .catch((error) => console.log(error.response.data.message));

        setNomeMorador("");
        setDocumentoResponsavel("");
        setOpocaoSelecionada("");
        setEndereco("");
        setNumeroCasa("");
        setTelefone("");
        setDonoTelefone("");
        setCidadeSelecionada("");
        setRegiao("");
        setLocalizacao(null);
    }

    return (
        <div className="container">
            <a href="#">
                <div className="returnIcon">
                    ⬅
                </div>
            </a>
            <h3 className="familyFormHeader">Entre com os dados da família:</h3>
            <form action="#" className="familyFormContainer" onSubmit={handleSubmit}>
                <div className="celula" id="nomeMoradorContainer">
                    <label htmlFor="nomeMorador">Nome do morador:</label>
                    <input type="text" id="nomeMorador" name="nomeMorador" required value={nomeMorador} placeholder="Nome do morador"
                           onChange={(event) => {setNomeMorador(event.target.value)}}/>
                </div>
                <div className="celula" id="documentoResponsavelContainer">
                    <label htmlFor="documentoResponsavel">Documento do responsável:</label>
                    <input type="text" id="documentoResponsavel" name="documentoResponsavel" required placeholder="Nº documento"
                           value={documentoResponsavel} onChange={(event) => {setDocumentoResponsavel(event.target.value)}}/>
                </div>
                <div className="celula" id="checkContainer">
                    <div>
                        <input type="checkbox" name="tipoDocumento" id="cpf" value="cpf" checked={opcaoSelecionada === "cpf"}
                               onChange={() => {setOpocaoSelecionada("cpf")}}/>
                        <label htmlFor="cpf" className="checkLabel">CPF</label>
                    </div>
                    <div>
                        <input type="checkbox" name="tipoDocumento" id="rg" value="rg" checked={opcaoSelecionada === "rg"}
                               onChange={() => {setOpocaoSelecionada("rg")}}/>
                        <label htmlFor="rg" className="checkLabel">RG</label>
                    </div>
                </div>
                <div className="celula" id="enderecoContainer">
                    <label htmlFor="endereco">Endereço:</label>
                    <input type="text" id="endereco" name="endereco" required value={endereco} placeholder="Endereço"
                           onChange={(event) => {setEndereco(event.target.value)}}/>
                </div>
                <div className="celula" id="numeroContainer">
                    <label htmlFor="numeroCasa">Número:</label>
                    <input type="text" id="numeroCasa" name="numeroCasa" required value={numeroCasa} placeholder="Número"
                           onChange={(event) => {setNumeroCasa(event.target.value)}}/>
                </div>
                <div className="celula" id="cidadeContainer">
                    <label htmlFor="cidades">Cidade:</label>
                    <select 
                        id="cidades"
                        value={cidadeSelecionada}
                        onChange={(event) => setCidadeSelecionada(event.target.value)}
                        required
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
                <div className="celula" id="regiaoContainer">
                    <label htmlFor="regiao">Região:</label>
                    <input type="text" id="regiao" name="regiao" required value={regiao} placeholder="Região/Bairro"
                           onChange={(event) => {setRegiao(event.target.value)}}/>
                </div>
                <div className="celula" id="localizacaoContainer">
                    <label >Localização:</label>
                    <Mapa onLocationChange={handleGetLocalizacao}/>
                </div>
                <div className="celula" id="telefoneContainer">
                    <label htmlFor="telefone">Telefone:</label>
                    <input type="text" id="telefone" name="telefone" required value={telefone} placeholder="(27)12345-6789"
                           onChange={(event) => {setTelefone(event.target.value)}}/>
                </div>
                <div className="celula" id="donoTelefoneContainer">
                    <label htmlFor="donoTelefone">Dono telefone:</label>
                    <input type="text" id="donoTelefone" name="donoTelefone" required value={donoTelefone} placeholder="Dono tel."
                           onChange={(event) => {setDonoTelefone(event.target.value)}}/>
                </div>
                <div className="celula" id="cadastrarContainer">
                    <input type="submit" id="cadastrar" name="cadastrar" value="Cadastrar Família"/>
                </div>
            </form>
        </div>
    );
}

export default FamilyForm;