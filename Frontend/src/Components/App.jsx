import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./LoginForm.jsx";
import Menu from "./Menu.jsx";
import UserForm from "./UserForm.jsx";
import FamilyForm from "./FamilyForm.jsx";
import Protected from "./Protected.jsx";
import Users from "./Users.jsx";
import FamilyDetails from "./FamilyDetails.jsx";
import EsqueciSenha from "./EsqueciSenha.jsx";
import EsqueciSenhaUsuario from "./EsqueciSenhaUsuario.jsx";
import ResetaSenha from "./ResetaSenha.jsx";
import UserDetails from "./UserDetails.jsx";
import AlterarSenha from "./AlterarSenha.jsx";
import AlterarPerguntaSeg from "./AlterarPerguntaSeg.jsx";

function App(){
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/criarUsuario" element={<Protected pageToReturn="/"> <UserForm /> </Protected>} />
                <Route path="/familia" element={<Protected pageToReturn="/"> <FamilyForm /> </Protected>} />
                <Route path="/usuarios" element={ <Protected pageToReturn="/"> <Users /> </Protected>}/>
                <Route path="/familia/dadosFamilia" element={<Protected pageToReturn="/"> <FamilyDetails /> </Protected>} />
                <Route path="/esqueciMinhaSenha" element={<EsqueciSenha />} />
                <Route path="/esqueciMinhaSenha/usuario" element={<EsqueciSenhaUsuario />} />
                <Route path="/esqueciMinhaSenha/resetaSenha" element={<ResetaSenha />} />
                <Route path="/usuarios/detalhesUsuario" element={<UserDetails />} />
                <Route path="/usuarios/detalhesUsuario/alterarSenha" element={<AlterarSenha />} />
                <Route path="/usuarios/detalhesUsuario/alterarPerguntaSeguranca" element={<AlterarPerguntaSeg />} />
            </Routes>
        </Router>
    );
}

export default App;