import React, { useRef } from "react"; // Importa React y hook useRef para referencias
import styles from "../styles/Login.module.css"; // Importa estilos CSS modulares para login
import { useAuth } from "../hooks/useAuth"; // Importa hook de autenticación
import { useNavigate } from "react-router-dom"; // Importa hook para navegación
import { useToast } from "../context/ToastContext"; // Importa hook para toasts

function LoginRegister() { // Define el componente funcional LoginRegister
  const formularioLogin = useRef(null); // Referencia al formulario de login
  const formularioRegister = useRef(null); // Referencia al formulario de registro
  const contenedorLoginRegister = useRef(null); // Referencia al contenedor de formularios
  const cajaTraseraLogin = useRef(null); // Referencia a la caja trasera de login
  const cajaTraseraRegister = useRef(null); // Referencia a la caja trasera de registro

  const { login, register: registerUser } = useAuth(); // Obtiene las funciones login y register del contexto
  const navigate = useNavigate(); // Hook para navegación
  const { addToast } = useToast();

  // Animación y responsive
  const anchoPage = () => { // Función para ajustar el ancho de la página
    if (window.innerWidth > 850) { // Si el ancho es mayor a 850px
      cajaTraseraRegister.current.style.display = "block"; // Muestra caja trasera de registro
      cajaTraseraLogin.current.style.display = "block"; // Muestra caja trasera de login
    } else { // Si es menor
      cajaTraseraRegister.current.style.display = "block"; // Muestra registro
      cajaTraseraRegister.current.style.opacity = "1"; // Opacidad 1
      cajaTraseraLogin.current.style.display = "none"; // Oculta login
      formularioLogin.current.style.display = "block"; // Muestra formulario login
      contenedorLoginRegister.current.style.left = "0px"; // Posición izquierda 0
      formularioRegister.current.style.display = "none"; // Oculta formulario registro
    }
  };

  const iniciarSesion = () => { // Función para mostrar login
    if (window.innerWidth > 850) { // Si ancho > 850
      formularioLogin.current.style.display = "block"; // Muestra formulario login
      contenedorLoginRegister.current.style.left = "10px"; // Posición izquierda 10px
      formularioRegister.current.style.display = "none"; // Oculta registro
      cajaTraseraRegister.current.style.opacity = "1"; // Opacidad registro 1
      cajaTraseraLogin.current.style.opacity = "0"; // Opacidad login 0
    } else { // Si menor
      formularioLogin.current.style.display = "block"; // Muestra login
      contenedorLoginRegister.current.style.left = "0px"; // Posición 0
      formularioRegister.current.style.display = "none"; // Oculta registro
      cajaTraseraRegister.current.style.display = "block"; // Muestra caja registro
      cajaTraseraLogin.current.style.display = "none"; // Oculta caja login
    }
  };

  const register = () => { // Función para mostrar registro
    if (window.innerWidth > 850) { // Si ancho > 850
      formularioRegister.current.style.display = "block"; // Muestra formulario registro
      contenedorLoginRegister.current.style.left = "410px"; // Posición izquierda 410px
      formularioLogin.current.style.display = "none"; // Oculta login
      cajaTraseraRegister.current.style.opacity = "0"; // Opacidad registro 0
      cajaTraseraLogin.current.style.opacity = "1"; // Opacidad login 1
    } else { // Si menor
      formularioRegister.current.style.display = "block"; // Muestra registro
      contenedorLoginRegister.current.style.left = "0px"; // Posición 0
      formularioLogin.current.style.display = "none"; // Oculta login
      cajaTraseraRegister.current.style.display = "none"; // Oculta caja registro
      cajaTraseraLogin.current.style.display = "block"; // Muestra caja login
      cajaTraseraLogin.current.style.opacity = "1"; // Opacidad login 1
    }
  };

  React.useEffect(() => { // Efecto para manejar resize
    anchoPage(); // Llama a anchoPage
    window.addEventListener("resize", anchoPage); // Agrega listener para resize
    return () => window.removeEventListener("resize", anchoPage); // Cleanup
  }, []);

  // LOGIN con BD
const handleLogin = async (e) => {
  e.preventDefault();
  const email = e.target.correo.value; // Cambia correo por email
  const password = e.target.password.value;

  try {
    const resp = await login({ email, password }); // Cambia correo por email
    addToast(resp?.message || `¡Bienvenido de vuelta!`, 'success');
    navigate("/");
  } catch (err) {
    addToast(err.response?.data?.message || err.response?.data?.error || "Error al iniciar sesión", 'error');
  }
};

// handleRegister
const handleRegister = async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());
  
  // Combinar nombre y apellido en un solo campo "name"
  const registerData = {
    name: data.nombre + " " + data.apellido, // Nombre completo
    email: data.correo,
    password: data.password
  };

  try {
    const resp = await registerUser(registerData);
    const welcome = resp?.message || `¡Bienvenido, ${registerData.name.split(' ')[0]}! Tu cuenta fue creada.`;
    addToast(welcome, 'success');
    e.target.reset();
    iniciarSesion();
  } catch (err) {
    addToast(err.response?.data?.message || err.response?.data?.error || "Error al registrar usuario", 'error');
  }
};


return ( // Retorna el JSX
    <main // Elemento main
      className={styles.loginRegister} // Clase de estilos
    >
      {/* Formas flotantes */}
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
      <div className={styles.contenedorTodo}> {/* Contenedor principal */}
        <div className={styles.cajaTrasera}> {/* Caja trasera */}
          <div ref={cajaTraseraLogin} className={styles.cajaTraseraLogin}> {/* Caja login */}
            <h3>¿Ya tienes una cuenta?</h3> {/* Título */}
            <p>Inicia sesión para entrar en la página</p> {/* Descripción */}
            <button onClick={iniciarSesion}>Iniciar Sesión</button> {/* Botón */}
          </div>
          <div ref={cajaTraseraRegister} className={styles.cajaTraseraRegister}> {/* Caja registro */}
            <h3>¿Aún no tienes una cuenta?</h3> {/* Título */}
            <p>Regístrate para que puedas iniciar sesión</p> {/* Descripción */}
            <button onClick={register}>Regístrarse</button> {/* Botón */}
          </div>
        </div>

        <div ref={contenedorLoginRegister} className={styles.contenedorLoginRegister}> {/* Contenedor formularios */}
          {/* LOGIN */}
          <form ref={formularioLogin} onSubmit={handleLogin} className={styles.formularioLogin}> {/* Formulario login */}
            <h2>Iniciar Sesión</h2> {/* Título */}
            <input type="email" placeholder="Correo" name="correo" required /> {/* Input correo */}
            <input type="password" placeholder="Contraseña" name="password" required /> {/* Input password */}
            <a href="#" onClick={() => navigate("/forgot-password")} style={{ color: "#fff", textDecoration: "underline", fontSize: "14px" }}>¿Olvidaste tu contraseña?</a>
            <button type="submit">Entrar</button> {/* Botón submit */}
          </form>

          {/* REGISTER */}
          <form ref={formularioRegister} onSubmit={handleRegister} className={styles.formularioRegister}> {/* Formulario registro */}
            <h2>Regístrarse</h2> {/* Título */}
            <input type="text" name="nombre" placeholder="Nombre" required /> {/* Input nombre */}
            <input type="text" name="apellido" placeholder="Apellido" required /> {/* Input apellido */}
            <input type="email" name="correo" placeholder="Correo" required /> {/* Input correo */}
            <input type="password" name="password" placeholder="Contraseña" required /> {/* Input password */}
            <button type="submit">Regístrarse</button> {/* Botón submit */}
          </form>
        </div>
      </div>
    </main>
  );
}

export default LoginRegister; // Exporta el componente por defecto
// ...fin del archivo... // Fin del archivo
