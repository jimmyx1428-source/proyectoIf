import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ children, tipo }) => {
  const { usuario, Cargar} = useAuth();

  if (Cargar) return <p>Cargando...</p>; // spinner opcional
  if (!usuario) return <Navigate to="/" replace />;
  if (tipo && usuario.tipo !== tipo) return <Navigate to="/no-autorizado" replace />;
  return children;
};

export default PrivateRoute;