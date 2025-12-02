import React, { useState } from "react";
import logo from "/edumatch.png";
import styles from "../styles/App.module.css";
import { useAuth } from "../hooks/useAuth";
import Breadcrumb from "./Breadcrumb";
import SearchBar from "./SearchBar"; // <-- IMPORTANTE

function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);



  return (
    <header className={styles.mainHeader}>
      {/* Botón menú */}
      <button className={styles.btnNav} onClick={toggleMenu}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Logo siempre visible */}
      <a href="/" className={styles.logoText}>
        <img src={logo} alt="TecnoMatch" className={styles.logoIcon} />
        TecnoMatch
      </a>

      <div className={styles.breadcrumbContainer}>
        <Breadcrumb />
      </div>

      {/* Barra de búsqueda */}
      <div className={styles.searchBar}>
        <SearchBar />
      </div>

      {/* Side menu */}
      <nav
        className={styles.sideNav}
        style={{ left: menuOpen ? "0" : "-250px" }}
      >
        <ul className={styles.navigation}>
          {!user && <li><a href="/login">Inicia sesión</a></li>}

          {user && user.rol_id === 1 && (
            <>
              <li><a href="/User">Panel de control</a></li>
              <li><a href="/users">Gestión de usuarios</a></li>
              <li><a href="/careers-admin">Gestión de carreras</a></li>
              <li><a href="/reports">Ver reportes</a></li>
              <li>
                <button onClick={logout}>Cerrar sesión</button>
              </li>
            </>
          )}

          {user && user.rol_id !== 1 && (
            <>
              <li><a href="/User">Ver perfil</a></li>
              <li><a href="/Quiz/">Realizar test</a></li>
              <li>
                <button onClick={logout}>Cerrar sesión</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
