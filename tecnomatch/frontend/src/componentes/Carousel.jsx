import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Carousel.module.css";

function Carousel() {
  const slides = [
    { id: 1, title: "Ingeniería de Software", desc: "Construye el futuro digital", bg: "/slide1.jpg", link: "/career/ingenieria-de-software" },
    { id: 2, title: "Ciberseguridad Ofensiva", desc: "Protege lo más importante por medio de tecnicas", bg: "/slide2.jpg", link: "/career/ciberseguridad-ofensiva" },
    { id: 3, title: "Investigacion en IA", desc: "Investiga y profundiza en la IA", bg: "/slide3.jpg", link: "/career/investigacion-en-ia" },
    { id: 4, title: "Arquitectura de Software", desc: "Diseña sistemas escalables", bg: "/slide4.jpg", link: "/career/arquitectura-de-software" },
  ];

  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((index + 1) % slides.length);
  const prevSlide = () => setIndex((index - 1 + slides.length) % slides.length);

  return (
    <div className={styles.content}>
      {/* Botón izquierda */}
      <div className={styles.buttonLeft} onClick={prevSlide}>
        <span>&lt;</span>
      </div>

      {/* Slides */}
      <div
        className={styles.contentImages}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        <div className={styles.contentAux}>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={styles.contentImagesItem}
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              <div className={`${styles.itemContentInfo} ${styles.animation}`}>
                <Link to={slide.link} className={styles.btnLeerMas}>
                <h2 className={styles.nombre}>{slide.title}</h2>
                <p className={styles.descripcion}>{slide.desc}</p>
                  Leer más
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón derecha */}
      <div className={styles.buttonRight} onClick={nextSlide}>
        <span>&gt;</span>
      </div>

      {/* Dots / Paginación */}
      <div className={styles.dots}>
        {slides.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === index ? styles.active : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
