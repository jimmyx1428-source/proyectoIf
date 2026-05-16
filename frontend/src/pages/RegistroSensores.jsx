import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Form,
  Pagination
} from "react-bootstrap";
const API_URL = import.meta.env.VITE_API_URL;


export function RegistroSensores() {
  const [sensores, setSensores] = useState([]); // Listar sensores
  const [filtro, setFiltro] = useState(""); // buscador
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // listar los datos de los sensores registrados
 useEffect(() => {

  const obtenerSensores = async () => {

    try {

      const response = await fetch(`${API_URL}/sensores`);

      const data = await response.json();

      if (data) {

        const lista = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Ordenar por timestamp
        const listaOrdenada = lista.sort(
          (a, b) => b.timestamp - a.timestamp
        );

        console.log("Lista Ordenada:", listaOrdenada);

        setSensores(listaOrdenada);

      } else {

        setSensores([]);
      }

    } catch (error) {

      console.error(error);
    }
  };

  obtenerSensores();

}, []);


  const sensoresFiltrados = sensores.filter((item) => {
    const busqueda = filtro.toLowerCase();
    return (
      (item.IdModulo && item.IdModulo.toString().includes(busqueda))
     /* (item.temperatura && item.temperatura.toString().includes(busqueda)) ||
      (item.humedad && item.humedad.toString().includes(busqueda)) ||
      (item.detector_llama &&
        item.detector_llama.toString().includes(busqueda)) ||
      (item.sensor_humo && item.sensor_humo.toString().includes(busqueda))*/
    );
  });

const formatFecha = (timestamp) => {
  let ts = Number(timestamp);   

   if(!ts || isNaN(ts)){//Se validar si el timestamp existe y es numérico
      ts =  Date.now();
    }else{
      if(ts < 1e12){
        ts = ts*1000; //Convierto a milisegundos
      }else if (ts > 1e13) {
        ts = Math.floor(ts / 1000);
      }
    }

  const fechaObj = new Date(ts);
  
  const fecha = fechaObj.toLocaleDateString("es-CO");
  const hora = fechaObj.toLocaleTimeString("es-CO", { hour12: false });
  return { fecha, hora };
};

 //paginador
  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimero = indiceUltimo - registrosPorPagina;
  const registrosPagina = sensoresFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(sensoresFiltrados.length / registrosPorPagina);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center p-4">
        <img src="../assets/bar-chart.png" style={{height: '40px', width: '40px', marginRight: '10px'}}/>
        <h2 className="mb-0">Registro de Sensores</h2>
      </div>
      <hr />

      {/* Buscador */}
      <Form.Control
        type="text"
        className="mb-3"
        placeholder="Buscar por sensor"
        value={filtro}
        onChange={(e) => {
          setFiltro(e.target.value);
          setPaginaActual(1); // reset al buscar
        }}
      />

      {/* Tabla de registros */}
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Table striped bordered hover responsive className="table table-striped table-hover">
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              <th>Sensor</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Detector Llama</th>
              <th>Humedad %</th>
              <th>Irradiación solar</th>
              <th>Sensor Humo</th>
              <th>Temperatura °C</th>
            </tr>
          </thead>
          <tbody>
            {registrosPagina.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No se encontraron registros de sensores
                </td>
              </tr>
            ) : (
              registrosPagina.map((sensor) => {
                const { fecha, hora } = formatFecha(sensor.timestamp);
                return (
                  <tr key={sensor.id}>
                    <td>{sensor.IdModulo}</td>
                    <td>{fecha}</td>
                    <td>{hora}</td>
                    <td>{sensor.detector_llama == 1 ? "Activo" : "Inactivo"}</td>
                    <td className="text-center">{sensor.humedad}</td>
                    <td className="text-center">{sensor.irradiacion_solar}</td>
                    <td>{sensor.sensor_humo == 1 ? "Activo" : "Inactivo"}</td>
                    <td
                      style={{
                        color:
                          sensor.temperatura > 60 ? "red" : "inherit",
                        fontWeight:
                          sensor.temperatura > 60 ? "bold" : "normal",
                      }}
                    >
                      {sensor.temperatura}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      {/* Paginador */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First
              onClick={() => setPaginaActual(1)}
              disabled={paginaActual === 1}
            />
            <Pagination.Prev
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            />
             {(() => {
                const maxBotones = 10;
                const inicio = Math.floor((paginaActual - 1) / maxBotones) * maxBotones + 1;
                const fin = Math.min(inicio + maxBotones - 1, totalPaginas);

                const paginas = [];
                for (let i = inicio; i <= fin; i++) {
                  paginas.push(
                    <Pagination.Item
                      key={i}
                      active={i === paginaActual}
                      onClick={() => setPaginaActual(i)}
                    >
                      {i}
                    </Pagination.Item>
                  );
                }
                return paginas;
              })()}
            
            <Pagination.Next
              onClick={() =>
                setPaginaActual((prev) =>
                  Math.min(prev + 1, totalPaginas)
                )
              }
              disabled={paginaActual === totalPaginas}
            />
            <Pagination.Last
              onClick={() => setPaginaActual(totalPaginas)}
              disabled={paginaActual === totalPaginas}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
}
