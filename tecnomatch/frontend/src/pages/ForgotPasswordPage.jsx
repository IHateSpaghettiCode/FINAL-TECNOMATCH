import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import styles from "../styles/Login.module.css"; // Reuse login styles

const BACKEND_URL = "http://localhost:4000/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message || "Revisa tu correo para restablecer la contraseña.", "success");
        navigate("/login");
      } else {
        addToast(data.message || "Error al enviar email", "error");
      }
    } catch (err) {
      addToast("Error de conexión", "error");
    }
    setLoading(false);
  };

  return (
    <main className={styles.loginRegister}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <div className={styles.contenedorTodo}>
        <div className={styles.contenedorLoginRegister}>
          <form onSubmit={handleSubmit} className={styles.formularioLogin}>
            <h2>Recuperar Contraseña</h2>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
            <a href="#" onClick={() => navigate("/login")} style={{ color: "#fff", textDecoration: "underline", fontSize: "14px" }}>
              Volver al inicio de sesión
            </a>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
