import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const API_BASE = "http://localhost:4000/api";

  const register = async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, credentials);
      if (response.data.token) {
        setToken(response.data.token);

        setUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    axios.defaults.baseURL = API_BASE;
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        
        console.log("Token payload:", payload);
        
        // Obtener perfil del usuario con manejo de errores mejorado
        axios.get(`/users/profile`)
          .then(response => {
            console.log("User profile response:", response.data);
            if (response.data && typeof response.data === 'object') {
              // Mezclar el usuario actual con los datos del perfil para mantener rol_id
              setUser(prevUser => ({ ...prevUser, ...response.data }));
            } else {
              console.error("Respuesta inválida:", response.data);
              // Crear usuario básico como fallback, manteniendo rol_id si existe
              setUser(prevUser => ({
                ...prevUser,
                id_usuario: userId,
                nombre: "Usuario",
                correo: "user@example.com",
                nombre_usuario: "user" + userId
              }));
            }
          })
          .catch(err => {
            console.error("Error fetching user profile:", err.response?.data || err.message);
            // Fallback con datos básicos, manteniendo rol_id si existe
            setUser(prevUser => ({
              ...prevUser,
              id_usuario: userId,
              nombre: "Usuario",
              correo: "user@example.com",
              nombre_usuario: "user" + userId
            }));
          });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser && storedUser !== "null" && !storedUser.includes('<!doctype')) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Persistir usuario en localStorage
  useEffect(() => {
    if (user && typeof user === 'object' && user.id_usuario) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const fetchProfile = async (id) => {
    try {
      const response = await axios.get(`/users/profile`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateProfile = async (id, data) => {
    try {
      const response = await axios.put(`/users/profile`, data);
      setUser(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        token, 
        login, 
        register, 
        logout, 
        fetchProfile,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}