import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "../styles/App.module.css";

function Breadcrumb() {
  const location = useLocation();

  // Diccionario de nombres "lindos"
  const routeNames = {
    "/": "Inicio",
    "/userzone": "Zona de Usuario",
    "/quiz": "Test Vocacional",
    "/results": "Resultados",
    "/careers": "Carreras",
    "/settings": "Configuración",
    "/admin": "Administración",
  };

  const [history, setHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("breadcrumbHistory")) || [];
      return saved.length > 0 ? saved : [{ path: "/", label: "Inicio" }];
    } catch {
      return [{ path: "/", label: "Inicio" }];
    }
  });

  // Función para obtener el nombre amigable
  function getLabel(path) {
    return routeNames[path] || decodeURIComponent(path.split("/").pop());
  }

  useEffect(() => {
    const currentPath = location.pathname;

    setHistory((prev) => {
      // caso Inicio → reset
      if (currentPath === "/") {
        const reset = [{ path: "/", label: "Inicio" }];
        localStorage.setItem("breadcrumbHistory", JSON.stringify(reset));
        return reset;
      }

      const label = getLabel(currentPath);

      // quitar duplicados (mantener el más reciente)
      const filtered = prev.filter((item) => item.path !== currentPath);

      // añadir la nueva página al final
      const updated = [...filtered, { path: currentPath, label }];

      // asegurar Inicio siempre esté en la primera posición
      const inicio = { path: "/", label: "Inicio" };
      const cleaned = [inicio, ...updated.filter((item) => item.path !== "/")];

      // limitar a Inicio + 5 pasos
      const trimmed = cleaned.slice(-6);

      localStorage.setItem("breadcrumbHistory", JSON.stringify(trimmed));
      return trimmed;
    });
  }, [location.pathname]);

  if (history.length <= 1) return null;

  return (
    <nav className={styles.breadcrumb}>
      {history.map((item, index) => {
        const isLast = index === history.length - 1;
        return (
          <span key={`${item.path}-${index}`}>
            {index > 0 && " > "}
            {isLast ? (
              <span>{item.label}</span>
            ) : (
              <Link to={item.path}>{item.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
