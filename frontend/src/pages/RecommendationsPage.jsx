import React, { useState } from "react";
import RecommendationsPopup from "../components/RecommendationsPopup";
import styles from "../styles/Popup.module.css";

export default function RecommendationsPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#111827" }}>
        Módulo de Recomendaciones
      </h1>

      <button
        className={styles["page-button"]}
        onClick={() => {
          setSelectedType("INTJ");
          setShowPopup(true);
        }}
      >
        Ver recomendaciones INTJ
      </button>

      <RecommendationsPopup
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
        code={selectedType}
      />
    </div>
  );
}
