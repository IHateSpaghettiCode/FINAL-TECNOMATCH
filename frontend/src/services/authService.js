import API from "./api";

// Registro
export const register = (data) => API.post("/auth/register", data);

// Login
export const login = async (data) => {
  const res = await API.post("/auth/login", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token); // guardar token
  }
  return res.data;
};

// Obtener usuarios (ruta protegida)
export const getUsuarios = () => API.get("/usuarios");
