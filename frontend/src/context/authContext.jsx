import { createContext, useContext, useEffect, useState } from "react";
import {signInWithEmailAndPassword, signOut, onAuthStateChanged} from "firebase/auth";
import { auth } from "../utils/firebase";


const API_URL = import.meta.env.VITE_API_URL;
export const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [Cargar, setCargar] = useState(true);

useEffect(() => {

  const unsubscribe = onAuthStateChanged(
    auth,
    async (firebaseUser) => {

      try {
        if (firebaseUser) {
          const response = await fetch(
            `${API_URL}/usuarios/${firebaseUser.uid}`
          );
          const userData = await response.json();
          const nuevoUsuario = {
            ...firebaseUser,
            tipo: userData?.tipo || "2",
            nombre: userData?.nombre || "",
            telefono: userData?.telefono || "",
          };
          setUsuario(nuevoUsuario);
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCargar(false);
      }
    }
  );

  return () => unsubscribe();

  }, [API_URL]);
   
//Login
  const sesionlogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);    
    return userCredential; 
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    throw error; 
  }
};

//Cerrar sesión
const cerrarSesion = async () => {
    await signOut(auth);
};


return(
    <AuthContext.Provider value ={{sesionlogin, cerrarSesion, usuario, Cargar }}>
          {children} 
    </AuthContext.Provider>
    );
}
export const useAuth = () => useContext(AuthContext); 