import React, { useState, useEffect } from "react";
import { Card, Slider, Switch, Typography, Row, Col, Button } from "antd";
import { Modal } from "react-bootstrap";
import { ExclamationCircleOutlined, FireOutlined, CloudOutlined, SunOutlined } from "@ant-design/icons";

const API_URL = import.meta.env.VITE_API_URL;
const { Title, Text } = Typography;

export function Configuracion2() {
  const [edit, setEdit] = useState(false);

  // Estados de configuración
  const [prevTemp, setPrevTemp] = useState(40);
  const [fireTemp, setFireTemp] = useState(60);
  const [minHumedad, setMinHumedad] = useState(20);
  const [maxHumedad, setMaxHumedad] = useState(90);
  const [deteccionFuego, setDeteccionFuego] = useState(0);

  // Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Cargar configuración desde Firebase
  useEffect(() => {
    const traerConfig = async () => {
      
      try {

      const response = await fetch(`${API_URL}/configuracion`);

      const data = await response.json();

      if (data) {

        setPrevTemp(data.prevTemp || 40);
        setFireTemp(data.fireTemp || 60);
        setMinHumedad(data.minHumedad || 20);
        setMaxHumedad(data.maxHumedad || 90);
        setDeteccionFuego(data.deteccionFuego || 0);
      }

    } catch (error) {
      console.error(error);
    }
  };
   traerConfig();

}, []);
  // Guardar configuración en Firebase
  const guardarConfiguracion = async () => {
    try {
       const response = await fetch(`${API_URL}/configuracion`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prevTemp,
        fireTemp,
        minHumedad,
        maxHumedad,
        deteccionFuego,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al guardar configuración");
    }
      setEdit(false);
      handleShow();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "#f5f7fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Encabezado */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <img src="../assets/warning.png" alt="alerta" style={{ height: 50, marginBottom: 10 }} />
        <Title level={2} style={{ marginBottom: 8 }}>
          Configuración de alertas de sensores
        </Title>
        <Text type="secondary">
          Ajusta los valores límite para activar las alertas de prevención, incendio, humedad y detección de fuego.
        </Text>
      </div>

      {/* Contenedor vertical de tarjetas */}
      <div style={{ width: "100%", maxWidth: 600, display: "flex", flexDirection: "column", gap: 24 }}>
      
        <Card
          title={<span><ExclamationCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />Alerta de prevención (Temperatura)</span>}
          style={{ borderLeft: "6px solid #faad14", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={2} style={{ color: "#faad14", margin: 0 }}>{prevTemp}°C</Title>
          </div>
          {edit && (
            <Slider min={0} max={100} step={1} value={prevTemp} onChange={setPrevTemp} tooltip={{ formatter: v => `${v}°C` }} />
          )}
        </Card>

        <Card
          title={<span><FireOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />Alerta de incendio (Temperatura)</span>}
          style={{ borderLeft: "6px solid #ff4d4f", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={2} style={{ color: "#ff4d4f", margin: 0 }}>{fireTemp}°C</Title>
          </div>
          {edit && (
            <Slider min={0} max={100} step={1} value={fireTemp} onChange={setFireTemp} tooltip={{ formatter: v => `${v}°C` }} />
          )}
        </Card>

        <Card
          title={<span><CloudOutlined style={{ color: "#1890ff", marginRight: 8 }} />Alerta de humedad</span>}
          style={{ borderLeft: "6px solid #1890ff", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={4} style={{ color: "#1890ff" }}>Rango permitido</Title>
            <Title level={3} style={{ color: "#1890ff", margin: 0 }}>{minHumedad}% - {maxHumedad}%</Title>
          </div>
          {edit && (
            <>
              <Text>Humedad mínima</Text>
              <Slider min={0} max={100} step={1} value={minHumedad} onChange={setMinHumedad} tooltip={{ formatter: v => `${v}%` }} />
              <Text>Humedad máxima</Text>
              <Slider min={0} max={100} step={1} value={maxHumedad} onChange={setMaxHumedad} tooltip={{ formatter: v => `${v}%` }} />
            </>
          )}
        </Card>

        <Card
          title={<span><SunOutlined style={{ color: "#fadb14", marginRight: 8 }} />Detección de fuego</span>}
          style={{ borderLeft: "6px solid #fadb14", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={2} style={{ color: "#fadb14", margin: 0 }}>
              Detector activo
            </Title>
          </div>
          {edit && (
            <Switch
              checked={deteccionFuego === 1}
              onChange={(checked) =>
               setDeteccionFuego(checked ? 1 : 0)
              }
            />
          )}
        </Card>
      </div>

      {/* Switch y botón */}
      <div style={{ marginTop: 40, textAlign: "center" }}>
        <Switch checked={edit} onChange={setEdit} style={{ marginRight: 10 }} />
        <Text>Editar valores</Text>
        {edit && (
          <div style={{ marginTop: 20 }}>
            <Button type="primary" size="large" onClick={guardarConfiguracion}>
              Guardar configuración
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <img src="../assets/bell.png" alt="notificación" style={{ height: 30, marginRight: 10 }} />
            Configuración guardada
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Se registró correctamente la nueva configuración de alertas.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
