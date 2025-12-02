import React, { useEffect, useState } from "react";
import styles from "../styles/App.module.css";
import Fondo from "/Fondo.png"
import { Link } from "react-router-dom";

const BACKEND_URL = "http://localhost:4000/api";

function CareerCards() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/careers`)
      .then(res => res.json())
      .then(data => {
        setCareers(data.careers || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching careers:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando carreras...</div>;

  return (
    <div className={styles.careerCards} style={{ backgroundImage: `url(${Fondo})` }}>
      {careers.map((career) => (
        <div className={styles.careerCard} key={career.id_carrera}>
          <Link to={`/career/${career.slug}`}>
            <img src={career.imagen || "/default-image.png"} alt={career.nombre_carrera} className={styles.careerImage} />
          </Link>
          <h3>{career.nombre_carrera}</h3>
          <p>{career.universidades?.nombre_universidad}</p>
        </div>
      ))}
    </div>
  );
}

export default CareerCards;
