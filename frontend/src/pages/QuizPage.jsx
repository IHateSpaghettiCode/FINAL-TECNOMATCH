import Quiz from "../componentes/Quiz"; // Importa el componente Quiz para el test
import PersonalityPage from "../componentes/PersonalityPage"; // Importa el componente PersonalityPage para resultados
import { Routes, Route, useNavigate } from "react-router-dom"; // Importa componentes de routing y hook de navegación

function QuizPage() { // Define el componente funcional QuizPage
  const navigate = useNavigate(); // Hook para navegación programática

  return ( // Retorna el JSX del componente
    <> {/* Fragmento React para envolver múltiples elementos */}
      {/* Botones de navegación */}
      

      <Routes> {/* Componente Routes para definir rutas anidadas */}
        {/* Ruta raíz de QuizPage → el test */}
        <Route path="/" element={<Quiz />} /> {/* Ruta raíz renderiza Quiz */}

        {/* Ruta dinámica para el resultado */}
        <Route path="/personality/:type" element={<PersonalityPage />} /> {/* Ruta dinámica para personalidad */}
      </Routes>
    </>
  );
}

export default QuizPage; // Exporta el componente por defecto
