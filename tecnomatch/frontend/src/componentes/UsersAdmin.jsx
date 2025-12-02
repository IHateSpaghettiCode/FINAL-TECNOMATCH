import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    telefono: "",
    rol_id: 2
  });

  const fetchUsers = async (searchTerm = "", pageNum = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", pageNum);
      params.append("limit", 10);

      const res = await API.get(`/admin/users?${params}`);
      setUsers(res.data.users || []);
      setTotalPages(res.data.pagination?.pages || 1);
      setError(null);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError("No se pudieron cargar los usuarios. Verifica que tengas permisos de administrador.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(search, page);
  }, [search, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(search, 1);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/admin/users", formData);
      setShowCreateForm(false);
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        password: "",
        telefono: "",
        rol_id: 2
      });
      fetchUsers(search, page);
      addToast(response.data?.message || `Usuario ${formData.nombre} creado con éxito`, 'success');
    } catch (err) {
      console.error("Error creando usuario:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Error creando usuario: " + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(`/admin/users/${editingUser.id_usuario}`, formData);
      setEditingUser(null);
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        password: "",
        telefono: "",
        rol_id: 2
      });
      fetchUsers(search, page);
      addToast(response.data?.message || `Usuario ${formData.nombre} actualizado con éxito`, 'success');
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Error actualizando usuario: " + err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) return;
    try {
      const response = await API.delete(`/admin/users/${userId}`);
      fetchUsers(search, page);
      addToast(response.data?.message || `Usuario eliminado con éxito`, 'success');
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Error eliminando usuario: " + err.message);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      correo: user.correo || "",
      password: "",
      telefono: user.telefono || "",
      rol_id: user.rol_id || 2
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      password: "",
      telefono: "",
      rol_id: 2
    });
  };

  if (loading && users.length === 0) return <p>Cargando usuarios...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="users-admin" style={{ padding: "20px" }}>
      <h2>Gestión de Usuarios</h2>

      {/* Barra de búsqueda */}
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, correo o usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>Buscar</button>
      </form>

      {/* Botón crear usuario */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={{ padding: "10px 20px", marginBottom: "20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
      >
        {showCreateForm ? "Cancelar" : "Crear Usuario"}
      </button>

      {/* Formulario crear usuario */}
      {showCreateForm && (
        <form onSubmit={handleCreate} style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h3>Crear Nuevo Usuario</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({...formData, apellido: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Correo"
              value={formData.correo}
              onChange={(e) => setFormData({...formData, correo: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            />
            <select
              value={formData.rol_id}
              onChange={(e) => setFormData({...formData, rol_id: parseInt(e.target.value)})}
            >
              <option value={2}>Usuario</option>
              <option value={1}>Administrador</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: "10px", padding: "8px 16px" }}>Crear</button>
        </form>
      )}

      {/* Formulario editar usuario */}
      {editingUser && (
        <form onSubmit={handleUpdate} style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h3>Editar Usuario: {editingUser.nombre} {editingUser.apellido}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({...formData, apellido: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Correo"
              value={formData.correo}
              onChange={(e) => setFormData({...formData, correo: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Nueva Contraseña (dejar vacío para mantener)"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            />
            <select
              value={formData.rol_id}
              onChange={(e) => setFormData({...formData, rol_id: parseInt(e.target.value)})}
            >
              <option value={2}>Usuario</option>
              <option value={1}>Administrador</option>
            </select>
          </div>
          <div style={{ marginTop: "10px" }}>
            <button type="submit" style={{ padding: "8px 16px", marginRight: "10px" }}>Actualizar</button>
            <button type="button" onClick={cancelEdit} style={{ padding: "8px 16px" }}>Cancelar</button>
          </div>
        </form>
      )}

      {/* Lista de usuarios */}
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Nombre</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Correo</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Rol</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Estado</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id_usuario} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>
                  {user.nombre} {user.apellido}
                  <br />
                  <small style={{ color: "#666" }}>{user.nombre_usuario}</small>
                </td>
                <td style={{ padding: "12px" }}>{user.correo}</td>
                <td style={{ padding: "12px" }}>
                  {user.roles?.nombre || (user.rol_id === 1 ? "Administrador" : "Usuario")}
                </td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    color: user.estado === 1 ? "green" : "red",
                    fontWeight: "bold"
                  }}>
                    {user.estado === 1 ? "Activo" : "Inactivo"}
                  </span>
                  {user.confirmed ? (
                    <span style={{ color: "green", marginLeft: "8px" }}>✓</span>
                  ) : (
                    <span style={{ color: "orange", marginLeft: "8px" }}>⚠</span>
                  )}
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => startEdit(user)}
                    style={{ padding: "4px 8px", marginRight: "5px", backgroundColor: "#ffc107", border: "none", borderRadius: "4px" }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id_usuario)}
                    style={{ padding: "4px 8px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{ padding: "8px 16px", marginRight: "10px" }}
          >
            Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            style={{ padding: "8px 16px", marginLeft: "10px" }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default UsersAdmin;
