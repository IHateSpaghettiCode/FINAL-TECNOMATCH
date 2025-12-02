import React from "react";
import styles from "../styles/App.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Contáctanos */}
      <div className={styles.footerSection}>
        <i className="fas fa-paper-plane"></i>
        <p>
          <strong>Contáctanos</strong><br />
          ¿Necesitas ayuda o tienes alguna pregunta?<br />
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe_XIGEMUB6vFci89_uYfrbijByHm3PAJfuSuT1BoKfEK7vLw/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
          >
            Formulario de atención
          </a><br />
          <a href="tel:+1234567890">+1 (234) 567-890</a>
        </p>
      </div>

      {/* Redes sociales */}
      <div className={styles.footerSection}>
        <i className="fas fa-heart"></i>
        <p>
          <strong>Síguenos</strong><br />
          <i className="fab fa-instagram"></i> @Edumatch <br />
          <i className="fab fa-x-twitter"></i> @Edumatch
        </p>
      </div>

      {/* Atención al usuario */}
      <div className={styles.footerSection}>
        <i className="fas fa-question-circle"></i>
        <p>
          <strong>Atención al usuario</strong><br />
          ProblemasEdu@gmail.com<br />
          +57 0000000000
        </p>
      </div>

      {/* Año automático */}
      <div className={styles.footerBottom}>
        <p>© {currentYear} TecnoMatch. Todos los derechos reservados.</p>
       
      <p>
  <a href="/Manual/html/index.html" className={styles.manualBtn} title="Manual de usuario">
    Manual de Usuario
  </a>
</p>


      </div>
    </footer>
  );
}

export default Footer;
