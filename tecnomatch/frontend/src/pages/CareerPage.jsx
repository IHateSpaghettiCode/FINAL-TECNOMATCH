// CareerPage.jsx - VERSIÓN COMPLETA CON HISTORIAL
import React, { useEffect, useRef } from "react";
import styles from "../styles/styles_CareerPage.module.css";
import { useParams } from "react-router-dom";
import { recommendations } from "../data/recommendations.js";
import { useAuth } from "../hooks/useAuth";

export default function CareerPage() {
  const params = useParams();
  const slug = params.slug;
  const { user } = useAuth();

  const BACKEND_URL = "http://localhost:4000/api";

  // Buscar carrera en todas las recomendaciones
  const findCareerBySlug = () => {
    for (const mbtiType in recommendations) {
      const career = recommendations[mbtiType].find(c => c.slug === slug);
      if (career) return career;
    }
    return null;
  };

  const career = findCareerBySlug();

  // 🔥 NUEVO: Guardar en historial cuando se visita la carrera (solo una vez)
  const savedRef = useRef(false);
  useEffect(() => {
    if (career && user && !savedRef.current) {
      savedRef.current = true;
      saveToHistory();
    }
  }, [career, user]);

  const saveToHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("🔐 Usuario no autenticado, omitiendo guardado en historial");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/history/career`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          careerId: career.id // Usamos el ID de la carrera
        })
      });

      if (response.ok) {
        console.log("✅ Carrera guardada en historial:", career.program);
      } else {
        const errorData = await response.json();
        console.warn("⚠️ Advertencia guardando en historial:", errorData.error);
      }
    } catch (error) {
      console.error("❌ Error guardando en historial:", error);
    }
  };

  if (!career) {
    return (
      <div className={styles.error}>
        <h2>Carrera no encontrada</h2>
        <p>La carrera que buscas no está disponible en nuestro sistema.</p>
        <a href="/" className={styles["btn-primary"]}>
          Volver al inicio
        </a>
      </div>
    );
  }

  // Preparar datos para la UI
  const careerData = {
    university: career.university,
    program: career.program,
    description: career.description,
    objective: career.objective,
    image: career.image,
    cards: career.cards || [
      { label: "Duración", value: career.duration || "N/A" },
      { label: "Modalidad", value: career.cards?.find(c => c.label === "Modalidad")?.value || "Virtual/Presencial" },
      { label: "Inversión", value: career.cards?.find(c => c.label === "Inversión")?.value || "Consultar" },
      { label: "Universidad", value: career.university }
    ]
  };

  return (
    <div className={styles["career-page"]}>
      {/* SVG Blobs de fondo */}
      <svg className={styles["blob-left"]} viewBox="0 0 600 600" fill="none">
        <circle cx="300" cy="300" r="300" fill="#FFF7C7" />
      </svg>
      <svg className={styles["blob-right"]} viewBox="0 0 800 400" fill="none">
        <path
          d="M0 200 C150 50 350 350 800 200 L800 400 L0 400 Z"
          fill="#cfecef"
        />
      </svg>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles["header-left"]}>
          <h1>{careerData.university}</h1>
          <p>Página de programa: {careerData.program}</p>
        </div>
        <div className={styles["header-right"]}>
          <span className={styles.visited}>
            {user ? "✓ Guardado en tu historial" : "Inicia sesión para guardar en historial"}
          </span>
        </div>
      </header>

      {/* Contenido principal */}
      <main className={styles.main}>
        <section className={styles["left-column"]}>
          <h2>
            {careerData.program?.split(" ")[0]}{" "}
            <span>{careerData.program?.split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className={styles.description}>{careerData.description}</p>

          <div className={styles.cards}>
            {careerData.cards?.map((card, index) => (
              <Card key={index} label={card.label} value={card.value} />
            ))}
          </div>

          <div className={styles.buttons}>
            <a href="/recommendations" className={styles["btn-tertiary"]}>
              Volver a recomendaciones
            </a>
          </div>
        </section>

        <aside className={styles["right-column"]}>
          <div className={styles["objective-card"]}>
            <h3>🎯 Objetivo del Programa</h3>
            <p>{careerData.objective}</p>
          </div>
          <div className={styles["image-wrapper"]}>
            <img 
              src={careerData.image} 
              alt={careerData.program}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=60";
              }}
            />
          </div>
          <div className={styles["info-box"]}>
            <h4>💡 ¿Te interesa esta carrera?</h4>
            <p>Esta recomendación está basada en tu perfil MBTI y ha sido guardada automáticamente en tu historial.</p>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Tecnomatch </span>
        <div className={styles.contact}>
          <span>📞 Teléfono: +57 1 234 5678</span>
        </div>
      </footer>
    </div>
  );
}

// Componente Card para mostrar información
function Card({ label, value }) {
  return (
    <div className={styles.card}>
      <div className={styles["card-label"]}>{label}</div>
      <div className={styles["card-value"]}>{value}</div>
    </div>
  );
}