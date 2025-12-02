import React from "react";
import styles from "../styles/App.module.css";
import { FaLaptopCode, FaUsers, FaChartLine } from "react-icons/fa";

function MainContent() {
  return (
    <section className={styles.mainContent}>
      <div className={styles.card}>
        <FaLaptopCode size={40} style={{ marginBottom: "10px" }} />
        <h2>Explora carreras</h2>
        <p>
          Conoce las opciones más demandadas en tecnología según tu perfil MBTI.
        </p>
      </div>

      <div className={styles.card}>
        <FaUsers size={40} style={{ marginBottom: "10px" }} />
        <h2>Conéctate</h2>
        <p>
          Accede a una comunidad donde estudiantes y profesionales comparten experiencias.
        </p>
      </div>

      <div className={styles.card}>
        <FaChartLine size={40} style={{ marginBottom: "10px" }} />
        <h2>Proyecta tu futuro</h2>
        <p>
          Visualiza estadísticas laborales en Bogotá y define tu camino profesional.
        </p>
      </div>
    </section>
  );
}

export default MainContent;
