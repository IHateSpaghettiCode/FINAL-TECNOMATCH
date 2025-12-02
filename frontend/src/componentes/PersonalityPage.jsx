import { useState, useRef, useEffect } from "react"; // Importa hooks de React para estado, referencias y efectos
import { useParams, useNavigate } from "react-router-dom"; // Importa hooks para parámetros de URL y navegación
import gsap from "gsap"; // Importa librería GSAP para animaciones
import { personalities } from "../data/personalities"; // Importa datos de personalidades
import { recommendations } from "../data/recommendations"; // Importa datos de recomendaciones de carreras
import styles from  "../styles/styles_enfj.module.css"; // Importa estilos CSS para el componente

import RecommendationsPopup from "./RecommendationsPopup"; // Importa componente para popup de recomendaciones
import CareerPage from "../pages/CareerPage"; // Importa componente CareerPage

export default function PersonalityPage() { // Define el componente funcional PersonalityPage
  const { type } = useParams(); // Obtiene el parámetro 'type' de la URL
  const navigate = useNavigate(); // Hook para navegación
  const data = personalities[type]; // Obtiene los datos de la personalidad basada en el tipo

  const [activeIndex, setActiveIndex] = useState(0); // Estado para el índice activo de las pestañas

  // popup y carrera seleccionada
  const [showPopup, setShowPopup] = useState(false); // Estado para mostrar/ocultar popup
  const [selectedCareer, setSelectedCareer] = useState(null); // Estado para la carrera seleccionada

  // refs para animaciones
  const contentRef = useRef(null); // Referencia para el contenido animado
  const imageRef = useRef(null); // Referencia para la imagen animada

  useEffect(() => { // Hook useEffect para animaciones
    if (!data) return; // Si no hay datos, no hace nada
    if (contentRef.current) { // Si hay referencia al contenido
      gsap.fromTo( // Anima el contenido
        contentRef.current,
        { opacity: 0, y: 30 }, // Desde opacidad 0 y y 30
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" } // A opacidad 1 y y 0
      );
    }
    if (imageRef.current) { // Si hay referencia a la imagen
      gsap.fromTo( // Anima la imagen
        imageRef.current,
        { opacity: 0, x: 50 }, // Desde opacidad 0 y x 50
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" } // A opacidad 1 y x 0
      );
    }
  }, [activeIndex, data]); // Dependencias: activeIndex y data

  if (!data) { // Condicional: si no hay datos
    return <h1>❌ Tipo de personalidad no encontrado</h1>; // Retorna mensaje de error
  }

  // ✅ Si ya seleccionó una carrera, mostramos CareerPage
  if (selectedCareer) { // Condicional: si hay carrera seleccionada
    return <CareerPage recommendation={selectedCareer} />; // Retorna CareerPage con la recomendación
  }

  return ( // Retorna el JSX del componente
    <> {/* Fragmento React */}
      {/* Botones de navegación */}
      

      <section className={styles["tab-layout"]} style={{ display: 'flex', flexDirection: 'row' }}> {/* Sección principal con layout de pestañas */}
        {/* Columna texto */}
        <div className={styles["tab-layout-col"]} style={{ flex: 1 }}> {/* Columna izquierda para texto */}
          <div className={styles["tab-layout-container"]}> {/* Contenedor del layout */}
            <div className={styles["tab-container"]}> {/* Contenedor de pestañas */}
              <div className={styles["tab-container-top"]}> {/* Parte superior del contenedor */}
                <h1 className={styles["tab-layout-heading"]}> {/* Título principal */}
                  {data.code} {/* Código de la personalidad */}
                  <span className={styles["subtitle-text"]}>{data.subtitle}</span> {/* Subtítulo */}
                </h1>

                {/* Tabs */}
                <div
                  className={styles["filter-bar"]}
                  style={{ backgroundColor: data.theme.accent }} // Barra de filtros con color de acento
                >
                  {["Descripcion", "Fortalezas", "Debilidades"].map((tab, i) => ( // Mapea las pestañas
                    <button
                      key={i} // Clave para React
                      className={`${styles["filter-button"]} ${i === activeIndex ? "active" : ""}`} // Clase con condición activa
                      onClick={() => setActiveIndex(i)} // Handler para cambiar pestaña
                    >
                      <div className={styles["filter-button__p"]}>{tab}</div> {/* Texto de la pestaña */}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenido dinámico */}
              <div className={styles["tab-container-bottom"]}> {/* Parte inferior del contenedor */}
                <div className={styles["tab-content-wrap"]}> {/* Wrapper del contenido */}
                  <div
                    ref={contentRef} // Referencia para animación
                    key={activeIndex} // Clave para forzar re-render
                    className={styles["tab-content-item active"]} // Clase del item activo
                  >
                    <h2 className={styles["tab-content__heading"]}> {/* Título del contenido */}
                      {data.sections[activeIndex].heading} {/* Heading de la sección activa */}
                    </h2>
                    <p className={styles["content-p"]}>{data.sections[activeIndex].text}</p> {/* Texto de la sección */}
                  </div>
                </div>

                {/* Botón que abre el popup */}
                <button
                  className={styles["reco-button"]}
                  onClick={() => setShowPopup(true)} // Handler para abrir popup
                >
                  Ver recomendaciones
                </button>

                {/* Popup */}
                <RecommendationsPopup
                  showPopup={showPopup}
                  onClose={() => setShowPopup(false)}
                  code={data.code}
                  onSelectCareer={(careerSlug) => {
                    // Buscar la carrera por slug en recommendations
                    for (const mbtiType in recommendations) {
                      const career = recommendations[mbtiType].find(c => c.slug === careerSlug);
                      if (career) {
                        setSelectedCareer(career);
                        break;
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna imagen */}
        <div className={styles["tab-layout-col"]} style={{ flex: 1 }}> {/* Columna derecha para imagen */}
          <div className={styles["tab-visual-wrap"]}> {/* Wrapper visual */}
            <div ref={imageRef} key={activeIndex} className={styles["tab-visual-item active"]}> {/* Item visual con referencia */}
              <img src={data.images[activeIndex]} alt="" className={styles["tab-image"]} /> {/* Imagen de la sección activa */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
