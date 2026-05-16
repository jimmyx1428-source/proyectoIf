import { useState, useEffect } from "react";
import { Form, Button, Modal, Tab, Tabs, Alert} from 'react-bootstrap';
import { auth } from "../utils/firebase"; // tu config Firebase
import { updatePassword } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

export function Configuracion() {

const [key, setKey] = useState('DatosUsuario');
const [error, setError] = useState('');
const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [editable, setEditable] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  //Modales de editar datos
 const [showEditar, ObtenerModalEdit] = useState(false);
 const verModalEdit = () => ObtenerModalEdit(true);

  //Obtener usuario actual
  useEffect(() => {
  const obtenerUsuario = async () => {

    try {
      const user = auth.currentUser;
      if (!user) return;
      const response = await fetch(`${API_URL}/usuarios/${user.uid}`);

      const data = await response.json();

      if (data) {

        setUsuario({
          nombre: data.nombre || "",
          email: data.email || user.email,
          telefono: data.telefono || "",
        });
      }

    } catch (error) {

      console.error(error);
    }
  };
  obtenerUsuario();
}, []);

  //Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar cambios en DB
  const EditarUsuario = async (e) => {

  e.preventDefault();

  try {

    const user = auth.currentUser;

    if (!user) {
      throw new Error("No hay usuario autenticado");
    }

    const response = await fetch(`${API_URL}/usuarios/${user.uid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: usuario.nombre,
          telefono: usuario.telefono,
          email: usuario.email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar usuario");
    }

    setEditable(false);

  } catch (error) {

    console.error("Error al actualizar:", error);
  }
};

   //Modal de Cambio de contraseña
    const [show, ObtenerModalPass] = useState(false);
    const CerrarModalPass = () => ObtenerModalPass(false);
    const verModalPass = () => ObtenerModalPass(true);

  //Cambiar contraseña
  const handleCambioPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No hay usuario autenticado");

      await updatePassword(user, password);
      verModalPass();
      setPassword("");
      setConfirmar("");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setError("Error al cambiar contraseña:", error);
    }
  };

  return (
    <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
      {/*Datos del Usuario */}
      <Tab eventKey="DatosUsuario" title="Datos del usuario">
           <div className="d-flex align-items-center p-4">
        <img src="../assets/usuario.png"  style={{ height: "40px", width: "40px", marginRight: "15px" }}/>
        <h2 className="mb-0">Datos del usuario</h2>
        </div>
        <hr />
        <Form onSubmit={EditarUsuario}>
          <Form.Group className="mb-3 col-md-4">
            <Form.Label>Nombre completo:</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
              disabled={!editable}
            />
          </Form.Group>
          <Form.Group className="mb-3 col-md-4">
            <Form.Label>Correo electrónico:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              disabled={!editable}
            />
          </Form.Group>
          <Form.Group className="mb-3 col-md-4">
            <Form.Label>N° de Teléfono:</Form.Label>
            <Form.Control
              type="number"
              name="telefono"
              value={usuario.telefono}
              onChange={handleChange}
              disabled={!editable}
            />
          </Form.Group>

          {!editable ? (
            <Button
              variant="warning"
              className="mt-2 me-2"
              onClick={() => setEditable(true)}
            >
              Editar
            </Button>
          ) : (
            <div>
              <Button variant="primary" onClick={verModalEdit} className="mt-2 me-2">Guardar</Button>
              <Button variant="danger" className="mt-2 me-2" onClick={() =>setEditable(false)}>Cancelar </Button>

            <Modal show={showEditar} onHide={ObtenerModalEdit}>
              <Modal.Header closeButton>
                <Modal.Title>Editar Datos de Usuario</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  src="../assets/check.png"
                  alt="check"
                  style={{ height: '30px', width: '30px', marginRight: '10px' }}
                />
                ¡Los datos se han actualizado exitosamente!
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={EditarUsuario}>
                  Aceptar
                </Button>
              </Modal.Footer>
            </Modal>
             </div>        
          )}
        </Form>
      </Tab>

      {/*Cambiar Contraseña */}
      <Tab eventKey="CambioContraseña" title="Cambiar contraseña">
        <div className="d-flex align-items-center p-4">
        <img src="../assets/reset-password.png"  style={{ height: "40px", width: "40px", marginRight: "15px" }}/>
        <h2 className="mb-0">Cambiar contraseña</h2>
        </div>
        <hr />
        <Form onSubmit={handleCambioPassword}>
          <Form.Group className="mb-3 col-md-4">
            <Form.Label>Nueva Contraseña:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 col-md-4">
            <Form.Label>Confirmar contraseña:</Form.Label>
            <Form.Control
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
          </Form.Group>
           {error && <Alert variant="danger" className="alerta-cv">{error}</Alert>}
           <Modal show={show} onHide={CerrarModalPass}>
            <Modal.Header closeButton>
              <Modal.Title>Registro de contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img 
                  src="../assets/check.png"  
                  style={{ height: '30px', width: '30px', marginRight: '10px' }}/>exitoso!!!</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={CerrarModalPass}>
                Aceptar
              </Button>
            </Modal.Footer>
          </Modal>
          <Button variant="primary" type="submit" className="mt-2 me-2">
            Aceptar
          </Button>
        </Form>
      </Tab>
    </Tabs>
  );
}

