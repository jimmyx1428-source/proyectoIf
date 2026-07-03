import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { DownloadOutlined } from "@ant-design/icons";

import "bootstrap/dist/css/bootstrap.min.css";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import "../styles/Home.css";

const API_URL = import.meta.env.VITE_API_URL;

export function Home() {

  const [lecturas, setLecturas] = useState([]);
  const [sensoresCount, setSensoresCount] = useState({});
  const [config, setConfig] = useState({
    prevTemp: 40,
    fireTemp: 60,
  });

  const [modulos, setModulos] = useState([]);
  const [moduloSeleccionado, setModuloSeleccionado] =
    useState("todos");

  useEffect(() => {

    const cargarDatos = async () => {

      try {

        // Sensores
        const responseSensores = await fetch(
          `${API_URL}/sensores`
        );

        const dataSensores =
          await responseSensores.json();

        if (dataSensores) {

          const lista = Object.values(dataSensores);

          lista.sort(
            (a, b) => b.timestamp - a.timestamp
          );

          const listaConFecha = lista.map((d) => {

            let ts = Number(d.timestamp);

            if (!ts || isNaN(ts)) {

              ts = Date.now();

            } else {

              if (ts < 1e12) {
                ts = ts * 1000;
              } else if (ts > 1e13) {
                ts = Math.floor(ts / 1000);
              }
            }

            const fechaObj = new Date(ts);

            return {
              ...d,
              FechaHora:
                fechaObj.toLocaleTimeString(
                  "es-CO",
                  { hour12: false }
                ),
              tsNormalizado: ts
            };
          });

          setLecturas(listaConFecha);

          const modulosUnicos = [
            ...new Set(
              listaConFecha.map(
                (d) => d.IdModulo
              )
            )
          ];

          setModulos(modulosUnicos);

          const sensores = {};

          lista.forEach((d) => {

            Object.keys(d).forEach((key) => {

              if (
                ["sensor_humo", "detector_llama"]
                  .includes(key)
              ) {

                sensores[key] =
                  (sensores[key] || 0) +
                  (d[key] ? 1 : 0);
              }
            });
          });

          setSensoresCount(sensores);
        }

        // Configuración
        const responseConfig = await fetch(
          `${API_URL}/configuracion`
        );

        const dataConfig =
          await responseConfig.json();

        if (dataConfig) {

          setConfig(dataConfig);
        }

      } catch (error) {

        console.error(error);
      }
    };

    cargarDatos();

  }, []);

  // Filtrar lecturas
  const lecturasFiltradas =
    moduloSeleccionado === "todos"
      ? lecturas
      : lecturas.filter(
        (d) =>
          Number(d.IdModulo) ===
          Number(moduloSeleccionado)
      );

  const ultimaLecturaFiltrada =
    lecturasFiltradas.length > 0
      ? lecturasFiltradas[0]
      : null;

  const lecturasVisibles =
    lecturasFiltradas.slice(0, 24).reverse();

  // Pie chart
  const colores = ["#ff4d4f", "#36A2EB"];

  const pieData = Object.keys(
    sensoresCount
  ).map((sensor) => ({
    name: sensor,
    value: sensoresCount[sensor],
  }));

  // PDF
  const transformarDatos = (datos) => {

    return datos.map((item) => {

      let ts = Number(item.timestamp);

      if (ts < 1e12) {
        ts = ts * 1000;
      }

      const fechaObj = new Date(ts);

      return {
        Fecha:
          fechaObj.toLocaleDateString(),
        Hora:
          fechaObj.toLocaleTimeString(),
        Temperatura: item.temperatura,
        Humedad: item.humedad,
        "Detector fuego":
          item.detector_llama === 1
            ? "Activo"
            : "Inactivo",
      };
    });
  };

  const generarInformePDF = async () => {

    try {

      const response = await fetch(
        `${API_URL}/sensores`
      );

      const data = await response.json();

      if (!data) return;

      let datos = Object.values(data);

      if (
        moduloSeleccionado !== "todos"
      ) {

        datos = datos.filter(
          (item) =>
            Number(item.IdModulo) ===
            Number(moduloSeleccionado)
        );
      }

      datos.sort(
        (a, b) => b.timestamp - a.timestamp
      );

      const datosTransformados =
        transformarDatos(datos);

      const doc = new jsPDF();

      doc.addImage(
        "/assets/appif.png",
        "PNG",
        10,
        10,
        30,
        30
      );

      doc.setFontSize(18);

      doc.text(
        "Informe de Sensores",
        50,
        20
      );

      doc.setFontSize(10);

      doc.text(
        "Sistema de monitoreo ambiental",
        50,
        28
      );

      autoTable(doc, {
        head: [[
          "Fecha",
          "Hora",
          "Temperatura",
          "Humedad",
          "Detector fuego"
        ]],

        body:
          datosTransformados.map(
            (fila) => Object.values(fila)
          ),

        startY: 45,
      });

      doc.save(
        "informe_sensores.pdf"
      );

    } catch (error) {

      console.error(error);
    }
  };

  return (

    <div className="dashboard-container">

      {/* HEADER */}

      <div className="dashboard-header">

        <div className="dashboard-title">

          <img
            src="../assets/home.png"
            alt="dashboard"
          />

          <div>
            <h2>
              Consulta y Gestión
              de Sensores
            </h2>

            <p>
              Monitorea las condiciones
              ambientales en tiempo real
            </p>
          </div>
        </div>

        <div className="dashboard-actions">

          <button
            className="btn btn-primary btn-dashboard"
            onClick={generarInformePDF}
          >
            <DownloadOutlined />
            {" "}Descargar informe
          </button>

          <select
            className="sensor-select"
            value={moduloSeleccionado}
            onChange={(e) =>
              setModuloSeleccionado(
                e.target.value
              )
            }
          >

            <option value="todos">
              Todos los sensores
            </option>

            {modulos.map((mod, index) => (

              <option
                key={index}
                value={mod}
              >
                {mod}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CARDS */}

      <div className="row g-4 my-4">

        {[
          {
            titulo: "Temperatura",

            valor:
              ultimaLecturaFiltrada
                ? `${ultimaLecturaFiltrada.temperatura} °C`
                : "--",

            clase: "temp-card",

            icono:
              "../assets/temperatura.png",
          },

          {
            titulo: "Humedad",

            valor:
              ultimaLecturaFiltrada
                ? `${ultimaLecturaFiltrada.humedad} %`
                : "--",

            clase: "humidity-card",

            icono:
              "../assets/gota-de-agua.png",
          },

          {
            titulo:
              "Detección de fuego",

            valor:
              ultimaLecturaFiltrada?.detector_llama === 1
                ? "Fuego Detectado"
                : "Sin fuego",

            clase: "fire-card",

            icono:
              "../assets/dom.png",
          },

          {
            titulo:
              "Total Lecturas",

            valor:
              lecturasFiltradas.length,

            clase: "total-card",

            icono:
              "../assets/sensor-de-movimiento.png",
          },

        ].map((card, index) => (

          <div
            className="col-md-3"
            key={index}
          >

            <div
              className={
                `sensor-card-modern ${card.clase}`
              }
            >

              <div className="sensor-card-header">

                <div className="sensor-icon">

                  <img
                    src={card.icono}
                    alt={card.titulo}
                  />
                </div>

                <div className="sensor-info">

                  <h6>
                    {card.titulo}
                  </h6>

                  <h2>
                    {card.valor}
                  </h2>
                </div>
              </div>

              <div className="alert-status">

                {card.titulo ===
                  "Detección de fuego" ? (

                  ultimaLecturaFiltrada?.detector_llama === 1
                    ? (
                      <span className="alert-danger">
                        ● Alerta activa
                      </span>
                    )
                    : (
                      <span className="alert-normal">
                        ● Sin riesgo
                      </span>
                    )

                ) : (

                  <span className="alert-normal">
                    ● Sistema operativo
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GRÁFICAS */}

      <div className="row g-4">

        {[
          {
            titulo:
              "Temperatura en tiempo real",

            dataKey:
              "temperatura",

            color:
              "#F19F1C",
          },

          {
            titulo:
              "Humedad en tiempo real",

            dataKey:
              "humedad",

            color:
              "#36A2EB",
          },

        ].map((chart, index) => (

          <div
            className="col-md-6"
            key={index}
          >

            <div className="chart-card">

              <div className="chart-title">
                {chart.titulo}
              </div>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <LineChart
                  data={lecturasVisibles}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="FechaHora"
                  />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey={chart.dataKey}
                    stroke={chart.color}
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}

        {/* PIE */}

        <div className="col-md-12">

          <div className="pie-card">

            <div className="chart-title">
              Distribución de sensores
            </div>

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >

                  {pieData.map(
                    (entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          colores[
                          index % colores.length
                          ]
                        }
                      />
                    ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;