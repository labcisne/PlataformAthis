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
import Entrevista from "./Entrevista.jsx";
import Facilities from "./Facilities.jsx";
import Estrutural from "./Estrutural.jsx";
import DadosFacilities from "./DadosFacilities.jsx";
import DadosEstrutural from "./DadosEstrutural.jsx";
import Arquivos from "./Arquivos.jsx";
import Imagens from "./Imagens.jsx";
import ArquivosGerais from "./ArquivosGerais.jsx";
import PrimeiroUsuarioAdmin from "./PrimeiroUsuarioAdmin.jsx";

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
                <Route path="/usuarios/detalhesUsuario" element={<Protected pageToReturn="/"><UserDetails /> </Protected>} />
                <Route path="/usuarios/detalhesUsuario/alterarSenha" element={<Protected pageToReturn="/"> <AlterarSenha /> </Protected>} />
                <Route path="/usuarios/detalhesUsuario/alterarPerguntaSeguranca" element={<Protected pageToReturn="/"> <AlterarPerguntaSeg /> </Protected>} />
                <Route path="/familia/entrevista" element={<Protected pageToReturn="/"> <Entrevista /> </Protected>} />
                <Route path="/familia/entrevista/facilities" element={<Protected pageToReturn="/"> <Facilities /> </Protected>} />
                <Route path="/familia/entrevista/estrutural" element={<Protected pageToReturn="/">  <Estrutural /> </Protected>} />
                <Route path="/familia/dadosFamilia/dadosFacilities" element={<Protected pageToReturn="/"> <DadosFacilities /> </Protected>} />
                <Route path="/familia/dadosFamilia/dadosEstrutural" element={<Protected pageToReturn="/"> <DadosEstrutural /> </Protected>} />
                <Route path="/familia/dadosFamilia/arquivos" element={<Protected pageToReturn="/"> <Arquivos /> </Protected>} />
                <Route path="/familia/dadosFamilia/arquivos/imagens" element={<Protected pageToReturn="/"> <Imagens /> </Protected>} />
                <Route path="/familia/dadosFamilia/arquivos/arquivosGerais" element={<Protected pageToReturn="/"> <ArquivosGerais /> </Protected>} />
                <Route path="/primeiroUsuario" element={<PrimeiroUsuarioAdmin />} />
            </Routes>
        </Router>
    );
}

export default App;