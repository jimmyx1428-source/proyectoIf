import React, {useState} from 'react';
import { Form, Button, Modal, Alert} from 'react-bootstrap';
import {useAuth} from "../context/authContext";
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';


export function Login() {

  const {sesionlogin} = useAuth();
  const Navigate = useNavigate();        
  const [error, setError] = useState('');

   //Modal de Inicio de sesion exitoso
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

 const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
  const { name, value } = e.target;
      setUser({
        ...user,
        [name]: value
      });
    }
    const EnviarRequerimiento = async (event) => {
      event.preventDefault();
      setError('');

      try {
        await sesionlogin(user.email, user.password);
        handleShow();

          setTimeout(() => {
            Navigate("/Home");
          }, 1500)
      } catch (error) {
        console.log('Error al iniciar sesión:', error.message);
        setError('Error en el inicio de sesión. Verifique sus credenciales.');
      }
    };

  return (
        <div className="login-wrapper">
          <div className="login-form-container">
            <div className='imagenInicioSecion'>
              <img src="../assets/CuiadoMundoLogin.jpg" alt="Imagen inicio Sesión" width="250" />
            </div>
            <h2 className="text-center mb-4">Inicio de Sesión</h2>
            {error && <Alert variant="danger" className="alerta-cv">{error}</Alert>}
            <Form onSubmit={EnviarRequerimiento}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingresar Usuario"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicpassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="**********"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Iniciar Sesión
              </Button>
            </Form>

             <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Inicio de Sesión</Modal.Title>
              </Modal.Header>
              <Modal.Body>Ha iniciado sesion exitosamente!!!</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                  Aceptar
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
  );
}
export default Login;