// src/pages/CarrerasCards.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { recommendations } from "../data/recommendations.js";
import CareerCardSearch from "../componentes/CareerCardSearch.jsx";
import styles from "../styles/CarrerasCards.module.css";

function CarrerasCards() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get("search")?.trim().toLowerCase() || "";

  // Función para normalizar texto y eliminar tildes
  const normalize = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

  // Convertimos recommendations a un array plano de carreras y eliminamos posibles undefined
  const allCareers = Object.values(recommendations)
    .flat()
    .filter(Boolean);

  // Filtramos por búsqueda normalizada
  const filteredCareers = allCareers.filter(
    (career) =>
      normalize(career.program).includes(normalize(searchTerm)) ||
      normalize(career.university).includes(normalize(searchTerm)) ||
      normalize(career.description).includes(normalize(searchTerm))
  );

  return (
    <div className={styles.container}>
      {filteredCareers.length > 0 ? (
        filteredCareers.map((career) =>
          career ? <CareerCardSearch key={career.id} career={career} /> : null
        )
      ) : (
        <p className={styles.noResults}>
          No se encontraron resultados para: <strong>{searchTerm}</strong>
        </p>
      )}
    </div>
  );
}

export default CarrerasCards;
