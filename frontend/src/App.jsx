import { Routes, Route } from "react-router-dom";
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Usuario } from './pages/Usuario';
import { RegistroSensores } from './pages/RegistroSensores';
import { Configuracion } from './pages/Configuracion';
import { Configuracion2 } from './pages/Configuracion2';
import { RegistroUser } from './pages/RegistroUser';
import { Layout } from './components/Layout';
import { AuthProvider } from "./context/authContext";
import PrivateRoute from "./components/ProtectedRoute";

function App() {
  

  return (
    <div className="bg-slate-300 h-screen flex">
      <AuthProvider>
        <Routes>
          <Route path="/" element={ <Login/>}/>
          <Route element={<Layout />}>
            <Route path="/Home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/Sensores" element={<PrivateRoute><RegistroSensores /></PrivateRoute>} />
            <Route path="/Usuario" element={<PrivateRoute><Usuario /></PrivateRoute>} />
            <Route path="/RegistroUsuarios" element={<PrivateRoute><RegistroUser /></PrivateRoute>} />
            <Route path="/Configuracion2" element={<PrivateRoute><Configuracion2 /></PrivateRoute>} />
            <Route path="/Configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
            <Route path="/no-autorizado" element={<h2>No autorizado</h2>} />
          </Route>
        </Routes> 
      </AuthProvider> 
    </div>
  )
}

export default App
