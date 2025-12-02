// src/components/CareerCardSearch.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/CareerCardSearch.module.css";
import Banner from "./Banner"; // importamos el componente Banner

function CareerCardSearch({ career }) {
  // Evitar errores si career es undefined
  if (!career) return null;

  return (
    <div className={styles.card}>
      {/* Banner fijo para todas las cards */}
      <Banner />

      {/* Información de la carrera */}
      <div className={styles.info}>
        <h2 className={styles.program}>{career.program}</h2>
        <h4 className={styles.university}>{career.university}</h4>
        <p className={styles.description}>{career.description}</p>
        <Link to={`/career/${career.slug}`} className={styles.link}>
          Ver detalles
        </Link>
      </div>
    </div>
  );
}

export default CareerCardSearch;
