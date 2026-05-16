import { useEffect, useState } from "react";
import { Button, Modal} from 'react-bootstrap';
import {UserAddOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

export function Usuario() {
  
const [usuarios, setUsuarios] = useState([]); // Listar usuarios
const [editingUser, setEditingUser] = useState(null);
const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "", tipo: "" });
const Navigate = useNavigate(); 


// Modal Eliminar
const [showEliminar, setShowEliminar] = useState(false);
const handleCloseEliminar = () => setShowEliminar(false);
const handleShowEliminar = () => setShowEliminar(true);

// Modal Editar
const [showEditar, setShowEditar] = useState(false);
const handleCloseEditar = () => setShowEditar(false);
const handleShowEditar = () => setShowEditar(true);

  // Editar usuario
 const EditUser = (usuario) => {
  setEditingUser(usuario.id);
  setFormData({ 
    nombre: usuario.nombre, 
    email: usuario.email, 
    telefono: usuario.telefono, 
    tipo: usuario.tipo 
  });
  };

  // Guardar edición
const UpdateUser = async () => {
  if (!editingUser) return;
  try {
    
     const response = await fetch(`${API_URL}/usuarios/${editingUser}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

   if (!response.ok) {
      throw new Error("Error al actualizar usuario");
    }

const data = await response.json();
    console.log(data);
    // Cierra el modal y refresca el estado local
    handleCloseEditar();
    setUsuarios(usuarios.map((u) => u.id === editingUser ? { ...u, ...formData } : u));
    setEditingUser(null);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
  }
};

// listar los datos de los usuarios en la tabla
useEffect(() => {

  fetch(`${API_URL}/usuarios`)
    .then((res) => res.json())
    .then((data) => {

      if (data) {
        const lista = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setUsuarios(lista);

      } else {
        setUsuarios([]);
      }
    })
    .catch((error) => {
      console.error(error);
    });

}, []);

//Eliminar registro de usuasrio
const DeleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al actualizar usuario");
    }

    const data = await response.json();
    console.log(data);
    handleShowEliminar();
    setUsuarios(usuarios.filter(u => u.id !== id));
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
  }
};

const AgregarUsuario = () => {
Navigate("/RegistroUsuarios");
};

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center p-4">
          <img src="../assets/group.png" style={{height: '40px', width: '40px', marginRight: '10px'}}/>
          <h2 className="mb-0">Consulta y Gestión de Usuarios</h2>
      </div>
      <hr/>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button className="btn btn-primary me-md-2" type="button" onClick={AgregarUsuario}><UserAddOutlined />Usuario</button>
      </div>
  {/* Formulario de edición */}
    {editingUser && (
        <div className="card p-3 mt-4">
          <h5>Editar Usuario</h5>
          <div className="row g-2">
            <div className="col-md-3">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="form-control"
                placeholder="Nombre"
              />
            </div>
            <div className="col-md-3">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-control"
                placeholder="Correo"
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="form-control"
                placeholder="Teléfono"
              />
            </div>
            <div className="col-md-2">
              <select
                name="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="form-select"
              >
                <option value="1">Administrador</option>
                <option value="2">Usuario General</option>
              </select>
            </div>
            <div className="col-md-1">
              <button className="btn btn-success w-100" onClick={handleShowEditar}>
                Guardar
              </button>
            </div>
          </div>
        </div> 
      )}

     {/* Tabla de usuarios */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No se encontraron usuarios</td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefono}</td>
               <td>
                  {usuario.tipo === "1"
                    ? "Administrador"
                    : usuario.tipo === "2"
                    ? "Usuario General"
                    : "Desconocido"}
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => EditUser(usuario)}>
                    <EditOutlined />Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => DeleteUser(usuario.id)}>
                   <DeleteOutlined /> Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    {/* Modal de eliminar */}
      <Modal show={showEliminar} onHide={handleCloseEliminar}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>¡Usuario eliminado con exito!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseEliminar}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal de editar */}
      <Modal show={showEditar} onHide={handleCloseEditar}>
        <Modal.Header closeButton>
          <Modal.Title>Editar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>¡El usuario se ha actualizado correctamente!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={UpdateUser}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
