import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import styles from "../styles/Login.module.css";

const BACKEND_URL = "http://localhost:4000/api";

function ConfirmChangePasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      addToast("Token inválido o expirado. Por favor solicita un nuevo restablecimiento.", "error");
      navigate("/login");
    }
  }, [token, addToast, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast("Las contraseñas no coinciden", "error");
      return;
    }
    if (newPassword.length < 6) {
      addToast("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message || "Tu contraseña ha sido restablecida correctamente", "success");
        navigate("/login");
      } else {
        addToast(data.message || "Error al cambiar la contraseña. Por favor inténtalo de nuevo.", "error");
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
            <h2>Cambiar Contraseña</h2>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Cambiando..." : "Cambiar Contraseña"}
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

export default ConfirmChangePasswordPage;
