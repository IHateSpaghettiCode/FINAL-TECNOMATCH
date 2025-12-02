import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/App.module.css";

function Welcome() {
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
    setClosing(false);
  };

  const handleCloseModal = () => {
    setClosing(true);
    setTimeout(() => setShowModal(false), 300); // espera animación
  };

  // 🔹 Nueva función para el flujo del test
  const getQuizLink = () => {
    const token = localStorage.getItem("token");
    return token ? "/Quiz" : "/login";
  };

  return (
    <section className={styles.welcome}>
      <div className={styles.welcomeContent}>
        <h1>Bienvenido a TecnoMatch</h1>
        <p>
          Descubre tu perfil MBTI y conecta con las mejores oportunidades en el
          mundo de la tecnología.
        </p>
        <div className={styles.welcomeCTA}>
          <Link to={getQuizLink()}>
            <button className={styles.btnPrimary}>
              Haz tu test vocacional →
            </button>
          </Link>
          <button onClick={handleOpenModal} className={styles.btnSecondary}>
            Saber más
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className={`${styles.modalOverlay} ${
            closing ? styles.modalClosing : styles.modalOpen
          }`}
        >
          <div className={styles.modalContent}>
            <h2>¿Qué es el test MBTI?</h2>
            <p>
              El test MBTI (Myers-Briggs Type Indicator) identifica tu tipo de
              personalidad según tus preferencias en cuatro dimensiones: Energía
              (Extravertido/Introvertido), Información (Sensorial/Intuitivo),
              Decisiones (Racional/Emocional) y Estilo de vida
              (Planificador/Perceptivo). Esto ayuda a encontrar carreras y
              entornos que mejor se adapten a ti, al realizar el test se van a
              proveer las preguntas y se responderán acorde a qué tan de acuerdo
              o desacuerdo estés.
            </p>
            <button onClick={handleCloseModal} className={styles.btnPrimary}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Welcome;