import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { FaArrowLeft } from "react-icons/fa6";

import { IconContext } from "react-icons";

function AlterarSenha(){

    const location = useLocation();
    const navigate = useNavigate();

    const [obj, setObj] = useState({
        senhaAtual: "",
        novaSenha: "",
        confirmarNovaSenha: ""
    });

    const id = location.state?.id;
    const role = location.state?.role;

    const handleChange = (event) => {
        const {name, value} = event.target;
        setObj({...obj, [name]: value});
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if(!role){

            axios.patch("http://localhost:3000/alterarSenha", {...obj, id}, {withCredentials: true})
            .then(() => {
                alert("Senha alterada com sucesso!");
                navigate("/usuarios/detalhesUsuario", {state: { id }});
            })
            .catch((error) => alert(error.response.data.message));
        }
        else{
            axios.patch("http://localhost:3000/alterarSenha", obj, {withCredentials: true})
            .then(() => {
                alert("Senha alterada com sucesso!");
                navigate("/");
            })
            .catch((error) => alert(error.response.data.message));
        }
    }

    return (
        <div className="container">
            {role ? (
                <button className="returnBtn" onClick={() => {navigate("/usuarios/detalhesUsuario", {state: {id, role }})}}>
                    <IconContext.Provider value={{size: "2rem"}}>
                        <FaArrowLeft />
                    </IconContext.Provider>
                </button>
            ) : (

                <button className="returnBtn" onClick={() => {navigate("/usuarios/detalhesUsuario", {state: { id }})}}>
                    <IconContext.Provider value={{size: "2rem"}}>
                        <FaArrowLeft />
                    </IconContext.Provider>
                </button>
            )}
            <h2 style={{marginBottom: "16px"}}>Definir nova Senha</h2>
            <form onSubmit={handleSubmit}>
                {role && (
                <div className="celula">
                    <label>Senha Atual:</label>
                    <input 
                        type="password"
                        name="senhaAtual"
                        value={obj.senhaAtual}
                        onChange={handleChange}
                    />
                </div>
                )}
                <div className="celula">
                    <label>Nova Senha:</label>
                    <input 
                        type="password"
                        name="novaSenha"
                        value={obj.novaSenha}
                        onChange={handleChange} 
                    />
                </div>
                <div className="celula">
                    <label>Repetir Nova Senha:</label>
                    <input 
                        type="password"
                        name="confirmarNovaSenha"
                        value={obj.confirmarNovaSenha}
                        onChange={handleChange} 
                    />
                </div>
                <div className="celula">
                    <input type="submit" id="acessar" value="Mudar Senha"/>
                </div>
            </form>
        </div>
    )
}

export default AlterarSenha;