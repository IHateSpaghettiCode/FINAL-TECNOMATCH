// CareerModule.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import RecommendationsPopup from "./RecommendationsPopup";
import CareerPage from "../pages/CareerPage";
import { recommendations } from "../data/recommendations";

function RecommendationsPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Módulo de Recomendaciones MBTI</h1>

      {/* Botones de ejemplo */}
      {Object.keys(recommendations).map((type) => (
        <button
          key={type}
          style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}
          onClick={() => {
            setSelectedType(type);
            setShowPopup(true);
          }}
        >
          Ver recomendaciones {type}
        </button>
      ))}

      <RecommendationsPopup
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
        code={selectedType}
      />
    </div>
  );
}

export default function CareerModule() {
  return (
    <Routes>
      <Route path="recomendaciones" element={<RecommendationsPage />} />
      {/* Cambiado :program a :slug para que coincida con CareerPage */}
      <Route path=":slug" element={<CareerPage />} />
    </Routes>
  );
}
