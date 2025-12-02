import React from "react";
import PersonalityPage from "../componentes/PersonalityPage";
import { personalities } from "../data/personalities";

function FormularioPage() {
  // de momento mostramos un ejemplo (ENFJ)
  return <PersonalityPage data={personalities.ENFJ} />;
}

export default FormularioPage;
