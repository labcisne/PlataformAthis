import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetaSenha(){

    const location = useLocation();
    const navigate = useNavigate();
    const [obj, setObj] = useState({
        novaSenha: "",
        confirmarNovaSenha: ""
    });
    const link = location.state?.link;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setObj({...obj, [name]: value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.patch(link, obj)
        .then((response) => {
            console.log(response);
            alert("Senha alterada com sucesso!")
            navigate("/");
        })
        .catch((error) => alert(error.response.data.message));
    }

    return (
        <div className="container">
            <h2 style={{marginBottom: "16px"}}>Definir nova Senha</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label>Nova Senha:</label>
                    <input 
                        type="password"
                        placeholder="Senha"
                        name="novaSenha"
                        value={obj.novaSenha}
                        onChange={handleChange}
                    />
                </div>
                <div className="row">
                    <label>Repetir Nova Senha:</label>
                    <input 
                        type="password"
                        placeholder="Nova Senha"
                        name="confirmarNovaSenha"
                        value={obj.confirmarNovaSenha}
                        onChange={handleChange}
                    />
                </div>
                <div className="row">
                    <input type="submit" id="acessar" value="Mudar Senha"/>
                </div>
            </form>
        </div>
    );
}


export default ResetaSenha;