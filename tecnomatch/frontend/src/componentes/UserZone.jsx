import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import style from "../styles/User.module.css";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

const UserZone = () => {
  const { user, fetchProfile } = useAuth();
  const { addToast } = useToast();

  const [historialCarreras, setHistorialCarreras] = useState([]);
  const [historialTests, setHistorialTests] = useState([]);
  const [ultimoMBTI, setUltimoMBTI] = useState(null);
  const [profilePic, setProfilePic] = useState("/default-avatar.png");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const fileInputRef = useRef(null);

  const BACKEND_URL = "http://localhost:4000/api";

  // =======================
  // FOTO DE PERFIL - VERSIÓN SUPER SIMPLE
  // =======================
  useEffect(() => {
    if (!user || typeof user !== 'object') return;
    
    console.log("📸 User photo data:", user.foto_perfil);
    
    if (user.foto_perfil) {
      // VERIFICAR qué tipo de dato tenemos
      if (user.foto_perfil.startsWith('data:image/')) {
        // Ya es una URL de datos completa
        setProfilePic(user.foto_perfil);
      } else if (user.foto_perfil.startsWith('http')) {
        // Es una URL externa
        setProfilePic(user.foto_perfil);
      } else {
        // Es solo base64, construir la URL
        setProfilePic(`data:image/jpeg;base64,${user.foto_perfil}`);
      }
    } else {
      setProfilePic("/default-avatar.png");
    }
  }, [user]);

  // SUBIR FOTO - VERSIÓN SIMPLE
  const handleChangePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      addToast(`${user?.nombre ? user.nombre + ', ' : ''}por favor selecciona una imagen válida (PNG/JPG).`, "error");
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      addToast(`${user?.nombre ? user.nombre + ', ' : ''}la imagen excede el límite de 2MB. Elige una imagen más pequeña.`, "error");
      return;
    }

    // Mostrar preview inmediato
    const previewUrl = URL.createObjectURL(file);
    setProfilePic(previewUrl);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64data = reader.result;
        console.log("📤 Enviando imagen, tamaño:", base64data.length);

        const res = await fetch(`${BACKEND_URL}/users/profile/image`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ imageUrl: base64data }),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Error ${res.status} subiendo foto`);
        }
        
        const result = await res.json();
        console.log("✅ Foto subida correctamente:", result);
        addToast(`${user?.nombre ? user.nombre : 'Tu'} foto de perfil fue actualizada correctamente.`, "success");
        
        // Recargar perfil del usuario después de 1 segundo
        setTimeout(() => {
          if (user && user.id_usuario) {
            fetchProfile(user.id_usuario);
          }
        }, 1000);
        
      } catch (err) {
        console.error("❌ Error subiendo foto:", err);
        addToast(err.message || "Error subiendo foto de perfil", "error");
        
        // Restaurar foto anterior
        if (user?.foto_perfil) {
          if (user.foto_perfil.startsWith('data:image/')) {
            setProfilePic(user.foto_perfil);
          } else {
            setProfilePic(`data:image/jpeg;base64,${user.foto_perfil}`);
          }
        } else {
          setProfilePic("/default-avatar.png");
        }
      }
    };
    
    reader.readAsDataURL(file);
  };

  // =======================
  // HISTORIALES
  // =======================
  useEffect(() => {
    if (!user || typeof user !== 'object') return;

    const fetchHistoriales = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/history`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!res.ok) throw new Error('Error al obtener historial');
        
        const history = await res.json();
        
        const carrerasArray = history
          .filter(item => item.type === "career")
          .map(item => ({
            nombre_carrera: item.name,
            nombre_universidad: item.university,
            fecha: item.createdAt,
            slug: item.slug,
            id_carrera: item.id_carrera
          }))
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        setHistorialCarreras(carrerasArray);

        const testsArray = history
          .filter(item => item.type === "test")
          .map(item => ({
            fecha: item.createdAt,
            resultado_mbti: item.mbtiType || item.result
          }))
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        setHistorialTests(testsArray);
        
        if (testsArray.length > 0) {
          setUltimoMBTI(testsArray[0].resultado_mbti);
        }
      } catch (err) {
        console.error("Error cargando historiales:", err);
        setHistorialCarreras([]);
        setHistorialTests([]);
      }
    };

    fetchHistoriales();
  }, [user]);

  // =======================
  // RENDER
  // =======================
  if (!user || typeof user !== 'object') {
    return (
      <div className={style.userzoneContainer}>
        <main className={style.userzoneCard}>
          <p>Cargando perfil de usuario...</p>
        </main>
      </div>
    );
  }

  // ... (el resto del código de renderizado se mantiene igual)
  return (
    <div className={style.userzoneContainer}>
      <aside className={`${style.userzoneSidebar} ${style.left}`}>
        <h2>Historial de Carreras</h2>
        {historialCarreras.length > 0 ? (
          <ul>
            {historialCarreras.map((carrera, i) => (
              <li key={i}>
                <Link to={`/career/${carrera.slug || carrera.id_carrera}`}>
                  {carrera.nombre_carrera}
                </Link>
                {` - ${carrera.nombre_universidad}`} 
                ({new Date(carrera.fecha).toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : <p>No has visto carreras aún.</p>}
      </aside>

      <main className={style.userzoneCard}>
        <div className={style.profileBanner}></div>

        <div className={style.profilePicContainer}>
          <img src={profilePic} alt="Foto de perfil" className={style.profilePic} 
               onError={(e) => {
                 console.error("Error cargando imagen, usando fallback");
                 e.target.src = "/default-avatar.png";
               }} />
          <button className={style.changePicBtn} onClick={() => fileInputRef.current.click()}>
            Cambiar foto
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleChangePic}
          />
        </div>

        <div className={style.userInfo}>
          <p><strong>Nombre:</strong> {user.nombre || "Sin definir"}</p>
          <p><strong>Apellido:</strong> {user.apellido || "Sin definir"}</p>
          <p><strong>Usuario:</strong> {user.nombre_usuario || "Sin definir"}</p>
          <p><strong>Correo:</strong> {user.correo}</p>
          <p><strong>Teléfono:</strong> {user.telefono || "No registrado"}</p>
          <p><strong>Contraseña:</strong> ********</p>

          <p className={style.userMBTI}>
            <strong>Perfil MBTI:</strong>
            <span>{ultimoMBTI || "Sin definir"}</span>
          </p>

          <a href="/Quiz">
            <button className={style.testBtn}>
              {ultimoMBTI ? "Repetir Test" : "Realizar Test"}
            </button>
          </a>
        </div>
      </main>

      <aside className={`${style.userzoneSidebar} ${style.right}`}>
        <h2>Historial de Tests MBTI</h2>
            {historialTests.length > 0 ? (
          <ul>
            {historialTests.map((test, i) => (
              <li key={i}>
                    {new Date(test.fecha).toLocaleDateString()} → {test.resultado_mbti ? (
                      <Link to={`/personality/${test.resultado_mbti}`}>{test.resultado_mbti}</Link>
                    ) : (
                      "Sin resultado"
                    )}
              </li>
            ))}
          </ul>
        ) : <p>No has realizado tests aún.</p>}
      </aside>
    </div>
  );
};

export default UserZone;