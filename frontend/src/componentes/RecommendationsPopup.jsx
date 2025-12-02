import React, { useEffect, useRef } from "react";
import gsap from "gsap";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
 import { recommendations } from "../data/recommendations"; // objeto completo de carreras
import { useNavigate } from "react-router-dom"; // para redirección SPA
import styles from "../styles/Popup.module.css";

// Mapa de recomendaciones MBTI
const RECOMMENDATIONS = {
  INTJ: {
    title: "Recomendaciones para INTJ",
    summary:
      "Estratega y orientado a sistemas. Te irá bien donde puedas optimizar y planear a largo plazo.",
    careers: ["ingenieria-de-software", "ciencia-de-datos"],
  },
  INTP: {
    title: "Recomendaciones para INTP",
    summary:
      "Analítico y curioso. Te gustan los modelos, la teoría y prototipar soluciones.",
    careers: ["investigacion-en-ia", "arquitectura-de-software"],
  },
  ENTJ: {
    title: "Recomendaciones para ENTJ",
    summary:
      "Liderazgo natural y visión. Disfrutas coordinar equipos y empujar resultados.",
    careers: ["gestion-de-proyectos-ti", "direccion-de-producto-pm"],
  },
  ENTP: {
    title: "Recomendaciones para ENTP",
    summary:
      "Innovador y versátil. Te motivan los retos nuevos y romper el status quo.",
    careers: ["product-management", "innovacion-startups"],
  },
  INFJ: {
    title: "Recomendaciones para INFJ",
    summary:
      "Enfocado en el impacto humano. Disfrutas alinear la tecnología con el bien social.",
    careers: ["ux-research", "etica-de-datos"],
  },
  INFP: {
    title: "Recomendaciones para INFP",
    summary:
      "Creativo y con valores. Te va bien donde puedas expresar ideas y ayudar a otros.",
    careers: ["redaccion-tecnica", "diseno-multimedial"],
  },
  ENFJ: {
    title: "Recomendaciones para ENFJ",
    summary:
      "Facilitador y coach. Brillas guiando equipos y conectando personas.",
    careers: ["edtech-formacion-digital", "Gestión de Comunidad Tech"],
  },
  ENFP: {
    title: "Recomendaciones para ENFP",
    summary:
      "Energía creativa. Te inspiran proyectos con propósito y comunicación.",
    careers: ["marketing-digital", "ux-writing"],
  },
  ISTJ: {
    title: "Recomendaciones para ISTJ",
    summary:
      "Metódico y confiable. Te gusta el orden, los procesos y la precisión.",
    careers: ["qa-testing", "administracion-de-sistemas"],
  },
  ISFJ: {
    title: "Recomendaciones para ISFJ",
    summary:
      "Orientado al detalle y servicio. Te motiva apoyar y documentar correctamente.",
    careers: ["soporte-ti", "documentacion-tecnica"],
  },
  ESTJ: {
    title: "Recomendaciones para ESTJ",
    summary:
      "Organizado y práctico. Te gusta dirigir operaciones y mantener estándares.",
    careers: ["it-service-management", "operaciones-ti"],
  },
  ESFJ: {
    title: "Recomendaciones para ESFJ",
    summary:
      "Colaborador y empático. Disfrutas la atención al usuario y el onboarding.",
    careers: ["customer-success-saas", "implementacion-de-software"],
  },
  ISTP: {
    title: "Recomendaciones para ISTP",
    summary:
      "Práctico y resolutivo. Te gusta armar, medir y optimizar lo técnico.",
    careers: ["devops-sre", "redes-y-telecomunicaciones"],
  },
  ISFP: {
    title: "Recomendaciones para ISFP",
    summary:
      "Estético y sensible. Te va bien en experiencias visuales y de interacción.",
    careers: ["diseno-ui", "animacion-motion"],
  },
  ESTP: {
    title: "Recomendaciones para ESTP",
    summary:
      "Orientado a la acción. Te gustan los retos directos, ventas y seguridad.",
    careers: ["ventas-tecnicas", "ciberseguridad-ofensiva"],
  },
  ESFP: {
    title: "Recomendaciones para ESFP",
    summary:
      "Enérgico y social. Te va bien con experiencias en vivo y comunidades.",
    careers: ["community-manager", "event-tech"],
  },
};

export default function RecommendationsPopup({ showPopup, onClose, code }) {
  const popupRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  // Animación con GSAP y bloqueo de scroll
  useEffect(() => {
    if (showPopup) {
      if (overlayRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.28 }
        );
      }
      document.body.style.overflow = "hidden";
    } else {
      if (overlayRef.current) {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.28 });
      }
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPopup]);

  // Cerrar con ESC y clic fuera
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const handleClick = (e) => {
      if (overlayRef.current && overlayRef.current === e.target) onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  if (!showPopup) return null;

  const key = String(code || "").toUpperCase();
  const entry = RECOMMENDATIONS[key];

  const handleCareerClick = (careerName) => {
    const careerObj = recommendations[key]?.find(
      (c) => c.program === careerName
    );

    if (careerObj) {
      onClose();
      navigate(`/career/${careerObj.slug}`, {
        state: { recommendation: careerObj },
      });
    } else {
      onClose();
      navigate(`/career/${careerName}`);
    }
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <div
          ref={overlayRef}
          className={styles["popup-overlay"]}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mbti-reco-modal-title"
          id="mbti-reco-modal"
        >
          <motion.div
            ref={popupRef}
            className={styles["popup"]}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.36, ease: "easeOut" }}
          >
            <h2 id="mbti-reco-modal-title">
              {entry?.title || `Recomendaciones para ${key || "—"}`}
            </h2>

            {entry ? (
              <>
                <p>{entry.summary}</p>

                {Array.isArray(entry.careers) && entry.careers.length > 0 && (
                  <ul>
                    {entry.careers.map((careerName) => (
                      <motion.li
                        key={careerName}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button
                          className={styles["career-button"]}
                          onClick={() => handleCareerClick(careerName)}
                        >
                          {careerName}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p>No hay recomendaciones disponibles para este tipo aún.</p>
            )}

            <button onClick={onClose} className={styles["close-button"]}>
              Cerrar
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
