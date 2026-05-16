import { useState } from "react";
import { Form, Button, Container, Alert, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export function RegistroUser() {
  const [user, setUser] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    tipo: "",
  });

  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const Navigate = useNavigate();

  const limpiarCampos = () => {
    setUser({
      nombre: "",
      email: "",
      password: "",
      telefono: "",
      tipo: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Solo permitir números en el campo de teléfono
    if (name === "telefono" && !/^\d*$/.test(value)) {
      return;
    }

    setUser({
      ...user,
      [name]: value,
    });
  };


  const validarCampos = () => {
    if (!user.nombre.trim() || !user.email.trim() || !user.password.trim() || !user.telefono.trim() || !user.tipo) {
      return "Todos los campos son obligatorios.";
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return "El correo electrónico no es válido.";
    }

    // Validar teléfono (solo números y longitud mínima)
    if (user.telefono.length < 7 || user.telefono.length > 10) {
      return "El número de teléfono debe tener entre 7 y 10 dígitos.";
    }

    // Validar contraseña fuerte
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(user.password)) {
      return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
    }

    return null; // Todo correcto
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔍 Validar antes de enviar
    const errorValidacion = validarCampos();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/crear-usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      limpiarCampos();
      handleShow();
      Navigate("/Usuario");
    } catch (error) {
      console.error(error);
      setError("Error al registrar usuario: " + error.message);
    }
  };

  const CancelarRegistro = () => {
    Navigate("/Usuario");
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <div className="d-flex align-items-center p-4">
              <img src="../assets/user.png" style={{ height: "40px", width: "40px", marginRight: "10px" }} />
              <h2 className="mb-0">Registro de Usuario</h2>
            </div>
            <hr />

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre completo:</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={user.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa el nombre completo"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres, una mayúscula y un número"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>N° de Teléfono:</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={user.telefono}
                  onChange={handleChange}
                  placeholder="Solo números"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de usuario:</Form.Label>
                <Form.Select
                  name="tipo"
                  value={user.tipo}
                  onChange={handleChange}
                >
                  <option value="">Seleccione el tipo de Usuario</option>
                  <option value="1">Administrador</option>
                  <option value="2">Usuario General</option>
                </Form.Select>
              </Form.Group>

              {error && <Alert variant="danger" className="alerta-cv">{error}</Alert>}

              <Button variant="primary" type="submit" className="mt-4 me-2">
                Agregar
              </Button>
              <Button variant="danger" type="button" className="mt-4" onClick={CancelarRegistro}>
                Cancelar
              </Button>

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Registro de usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>El usuario se registró con éxito</Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleClose}>
                    Aceptar
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
