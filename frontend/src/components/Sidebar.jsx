import React, { useState, useEffect} from 'react';
import {
  HomeOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  PoweroffOutlined,
  AreaChartOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Button, Modal} from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme, Space, Typography} from 'antd';
import { useAuth } from "../context/authContext";
import '../styles/Sidebar.css';


const { Text } = Typography;
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
export const Sidebar = () => {
const navigate = useNavigate();
const {usuario, cerrarSesion} = useAuth();

const handleLogout = () => {
  cerrarSesion(); 
  navigate("/");  
};
//Modal
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

//Heard
const [tiempo, setTiempo] = useState(new Date());
//const [user, setUser] = useState('');

const items = [
  usuario && getItem(<Link to="/Home" className="text-decoration-none">Home</Link>, '1', <HomeOutlined />),
  usuario && getItem(<Link to="/Sensores" className="text-decoration-none">Registro sensores</Link>, '2', <AreaChartOutlined />),
  usuario?.tipo === "1" && getItem(<Link to="/Usuario" className="text-decoration-none">Usuarios</Link>, '3', <UserOutlined />),
   usuario?.tipo === "1" && getItem(<Link to="/Configuracion2" className="text-decoration-none">Configuración</Link>, '4', <UserOutlined />),
  usuario?.tipo === "2" && getItem(<Link to="/Configuracion" className="text-decoration-none">Configuración</Link>, '5', <SettingOutlined />),
  usuario && getItem('Cerrar Sesión', '6', <PoweroffOutlined  /> ),
 
].filter(Boolean);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Actualizar la hora cada segundo
    const interval = setInterval(() => {
      setTiempo(new Date());
    }, 1000);

  return () => clearInterval(interval);

},[]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
        width={240}
        className="modern-sidebar"
      >
      {!collapsed && (
       <div className="logo-menu">
        <div className="logo-container">
          <img
            src="../assets/appif.png"
            alt="logo"
          />
          <div className="logo-title">
            Monitoreo Ambiental
          </div>
          <div className="logo-subtitle">
            Sistema de Sensores
          </div>
        </div>
      </div>
      )}
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} style={{ background: "transparent", border: "none" }}  className="custom-menu" 
        onClick={({ key }) => {
              if (key === '6') {
              handleShow();
              }}
        }/>
      </Sider>
      <Layout>
      <Header className="topbar-modern">
            {/* IZQUIERDA */}
            <div className="topbar-welcome">
              <div className="topbar-icon">
                <img
                  src="../assets/appif.png"
                  alt="logo"
                  style={{
                    width: "22px",
                    height: "22px",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div>
                <h5>
                  Bienvenido de vuelta
                </h5>
                <p>
                  Aquí tienes el estado actual
                  de tu entorno.
                </p>
              </div>
            </div>

            {/* DERECHA */}

        <div className="topbar-user">
          <div className="topbar-date">
            <ClockCircleOutlined />
            <Text type="secondary">
              {tiempo.toLocaleDateString()}
              {" "}
              {tiempo.toLocaleTimeString()}
            </Text>
          </div>

          <div className="topbar-divider"></div>
          <div className="topbar-profile">
            <div className="profile-circle">
                  <img
                    src="../assets/appif.png"
                    alt="perfil"
                    style={{
                      width: "18px",
                      height: "18px",
                      objectFit: "contain"
                    }}
                  />
                </div>
            <div>
              <h6>
                {usuario?.email}
              </h6>
              <span>
                {usuario?.tipo === "1"
                  ? "Administrador"
                  : "Usuario"}

              </span>
            </div>
          </div>
        </div>
      </Header>
        <Content style={{ margin: '16px', marginTop: '0px' }}>
          <div
            style={{
              padding: 24,
              //minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet/>
             <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>
                   <img src="../assets/close.png" style={{height: '20px', width: '20px', marginRight: '10px'}}/>
                   Cerrar sesión</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Deseas cerrar Sesión?</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleLogout}>
                  Aceptar
                </Button>
                <Button variant="danger" onClick={handleClose}>
                  Cancelar
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Alertas y prevencion de incendios Forestales
        </Footer>
      </Layout>
    </Layout>

    
  );
};
export default Sidebar;