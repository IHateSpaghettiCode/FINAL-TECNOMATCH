import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "../styles/styles_test.module.css";
import API from "../services/api";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [fade, setFade] = useState("fadeIn");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar preguntas desde el backend
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await API.get("/tests/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error loading questions:", error);
        alert("Error al cargar las preguntas. Inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const recordAnswer = (value) => {
    const newAnswer = parseInt(value);
    const updatedAnswers = [...answers, newAnswer];
    
    setSelectedOption(value);
    setAnswers(updatedAnswers);

    setFade("fadeOut");
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
        setFade("fadeIn");
      } else {
        submitTest(updatedAnswers);
      }
    }, 400);
  };

const submitTest = async (testAnswers) => {
  setIsSubmitting(true);
  try {
    console.log("Enviando test al backend...", testAnswers);
    
    const response = await API.post("/tests", { answers: testAnswers });
    console.log("Respuesta del backend:", response.data);
    
    const profile = response.data.profile;
    navigate(`/personality/${profile}`, { 
      state: { testResult: response.data } 
    });
  } catch (error) {
    console.error("Error submitting test:", error.response?.data || error.message);
    alert("Error al enviar el test: " + (error.response?.data?.error || "Inténtalo de nuevo."));
  } finally {
    setIsSubmitting(false);
  }
};
  if (isLoading) {
    return (
      <main className={style.quizContainer}>
        <div className={style.loadingOverlay}>
          <div className={style.loadingSpinner}>
            Cargando preguntas...
          </div>
        </div>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className={style.quizContainer}>
        <div className={style.errorMessage}>
          No se pudieron cargar las preguntas. Por favor, recarga la página.
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <main className={style.quizContainer}>
      <h1 className={style.quizTitle}>Cuestionario MBTI</h1>

      {/* Barra de progreso */}
      <div className={style.progress}>
        <span className={style.progressText}>
          Pregunta {currentIndex + 1} de {questions.length}
        </span>
        <div className={style.progressBar}>
          <div
            className={style.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Loading indicator cuando está enviando */}
      {isSubmitting && (
        <div className={style.loadingOverlay}>
          <div className={style.loadingSpinner}>
            Procesando resultados...
          </div>
        </div>
      )}

      {/* Pregunta */}
      <section className={`${style.questionCard} ${style[fade]}`}>
        <p className={style.questionText}>{currentQuestion.texto}</p>

        {/* Escala Likert */}
        <div className={style.likertScale}>
          <span className={style.labelAgree}>De acuerdo</span>

          {[1, 2, 3, 4, 5].map((val) => (
            <React.Fragment key={val}>
              <input
                type="radio"
                name={`q-${currentIndex}`}
                id={`opt-${val}`}
                value={val}
                checked={selectedOption === String(val)}
                onChange={(e) => recordAnswer(e.target.value)}
                disabled={isSubmitting}
              />
              <label
                htmlFor={`opt-${val}`}
                className={`${style.circle} ${
                  val === 1
                    ? style.strongAgree
                    : val === 2
                    ? style.agree
                    : val === 3
                    ? style.neutral
                    : val === 4
                    ? style.disagree
                    : style.strongDisagree
                }`}
              />
            </React.Fragment>
          ))}

          <span className={style.labelDisagree}>En desacuerdo</span>
        </div>
      </section>
    </main>
  );
};

export default Quiz;