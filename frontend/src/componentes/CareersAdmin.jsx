import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useToast } from "../context/ToastContext";
import { personalities } from "../data/personalities";

function CareersAdmin() {
  const [careers, setCareers] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingCareer, setEditingCareer] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre_carrera: "",
    slug: "",
    id_universidad: "",
    personalidad: ""
  });

  const fetchCareers = async (searchTerm = "", pageNum = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", pageNum);
      params.append("limit", 10);

      const res = await API.get(`/careers?${params}`);
      setCareers(res.data.careers || []);
      setTotalPages(res.data.pagination?.pages || 1);
      setError(null);
    } catch (err) {
      console.error("Error cargando carreras:", err);
      setError("No se pudieron cargar las carreras.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      // Asumiendo que hay un endpoint para obtener universidades
      // Obtener las universidades directamente de las carreras
      const res = await API.get("/careers"); // Esto debería ser un endpoint separado en el backend
      // Extraer universidades únicas (por id) de las carreras
      const uniqueMap = new Map();
      (res.data.careers || []).forEach(c => {
        if (c.universidades && c.universidades.id_universidad) {
          uniqueMap.set(c.universidades.id_universidad, { id_universidad: c.universidades.id_universidad, nombre_universidad: c.universidades.nombre_universidad });
        }
      });
      setUniversities(Array.from(uniqueMap.values()));
    } catch (err) {
      console.error("Error cargando universidades:", err);
    }
  };

  useEffect(() => {
    fetchCareers(search, page);
  }, [search, page]);

  useEffect(() => {
    if (careers.length > 0) {
      fetchUniversities();
    }
  }, [careers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCareers(search, 1);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Aquí necesitarías un endpoint POST /admin/careers
      const sendData = { ...formData, id_universidad: Number(formData.id_universidad) };
      console.debug('Creating career with payload:', sendData);
      const response = await API.post("/admin/careers", sendData);
      setShowCreateForm(false);
      setFormData({
        nombre_carrera: "",
        slug: "",
        id_universidad: ""
      });
      fetchCareers(search, page);
      addToast(response.data?.message || "Carrera creada exitosamente", "success");
    } catch (err) {
      console.error("Error creando carrera:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Error creando carrera: " + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const sendData = { ...formData, id_universidad: Number(formData.id_universidad) };
      const response = await API.put(`/admin/careers/${editingCareer.id_carrera}`, sendData);
      setEditingCareer(null);
      setFormData({
        nombre_carrera: "",
        slug: "",
        id_universidad: "",
        personalidad: ""
      });
      fetchCareers(search, page);
      addToast(response.data?.message || "Carrera actualizada exitosamente", "success");
    } catch (err) {
      console.error("Error actualizando carrera:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Error actualizando carrera: " + err.message);
    }
  };

  const handleDelete = async (careerId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta carrera?")) return;
    try {
      const response = await API.delete(`/admin/careers/${careerId}`);
      fetchCareers(search, page);
      addToast(response.data?.message || "Carrera eliminada exitosamente", "success");
    } catch (err) {
      console.error("Error eliminando carrera:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Error eliminando carrera: " + err.message);
    }
  };

  const startEdit = (career) => {
    setEditingCareer(career);
    setFormData({
      nombre_carrera: career.nombre_carrera || "",
      slug: career.slug || "",
      id_universidad: career.id_universidad || "",
      personalidad: career.personalidad || ""
    });
  };

  const cancelEdit = () => {
    setEditingCareer(null);
    setFormData({
      nombre_carrera: "",
      slug: "",
      id_universidad: ""
    });
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      nombre_carrera: name,
      slug: generateSlug(name)
    });
  };

  if (loading && careers.length === 0) return <p>Cargando carreras...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="careers-admin" style={{ padding: "20px" }}>
      <h2>Gestión de Carreras</h2>

      {/* Barra de búsqueda */}
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por nombre de carrera..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>Buscar</button>
      </form>

      {/* Botón crear carrera */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={{ padding: "10px 20px", marginBottom: "20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
      >
        {showCreateForm ? "Cancelar" : "Crear Carrera"}
      </button>

      {/* Formulario crear carrera */}
      {showCreateForm && (
        <form onSubmit={handleCreate} style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h3>Crear Nueva Carrera</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input
              type="text"
              placeholder="Nombre de la Carrera"
              value={formData.nombre_carrera}
              onChange={handleNameChange}
              required
              style={{ gridColumn: "1 / -1" }}
            />
            <input
              type="text"
              placeholder="Slug (URL amigable)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <select
              value={formData.id_universidad}
              onChange={(e) => setFormData({ ...formData, id_universidad: e.target.value })}
              required
            >
              <option value="">Seleccionar Universidad</option>
              {universities.map((uni, index) => (
                <option key={index} value={uni.id_universidad || uni.nombre_universidad}>
                  {uni.nombre_universidad}
                </option>
              ))}
            </select>
            <select
              value={formData.personalidad}
              onChange={(e) => setFormData({ ...formData, personalidad: e.target.value })}
              required
            >
              <option value="">Seleccionar Personalidad</option>
              {Object.keys(personalities).map((key) => (
                <option key={key} value={key}>
                  {key} - {personalities[key].subtitle}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" style={{ marginTop: "10px", padding: "8px 16px" }}>Crear</button>
        </form>
      )}

      {/* Formulario editar carrera */}
      {editingCareer && (
        <form onSubmit={handleUpdate} style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h3>Editar Carrera: {editingCareer.nombre_carrera}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input
              type="text"
              placeholder="Nombre de la Carrera"
              value={formData.nombre_carrera}
              onChange={handleNameChange}
              required
              style={{ gridColumn: "1 / -1" }}
            />
            <input
              type="text"
              placeholder="Slug (URL amigable)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <select
              value={formData.id_universidad}
              onChange={(e) => setFormData({ ...formData, id_universidad: e.target.value })}
              required
            >
              <option value="">Seleccionar Universidad</option>
              {universities.map((uni, index) => (
                <option key={index} value={uni.id_universidad || uni.nombre_universidad}>
                  {uni.nombre_universidad}
                </option>
              ))}
            </select>
            <select
              value={formData.personalidad}
              onChange={(e) => setFormData({ ...formData, personalidad: e.target.value })}
              required
            >
              <option value="">Seleccionar Personalidad</option>
              {Object.keys(personalities).map((key) => (
                <option key={key} value={key}>
                  {key} - {personalities[key].subtitle}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: "10px" }}>
            <button type="submit" style={{ padding: "8px 16px", marginRight: "10px" }}>Actualizar</button>
            <button type="button" onClick={cancelEdit} style={{ padding: "8px 16px" }}>Cancelar</button>
          </div>
        </form>
      )}

      {/* Lista de carreras */}
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Carrera</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Universidad</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Slug</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {careers.map((career) => (
              <tr key={career.id_carrera} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>
                  {career.nombre_carrera}
                </td>
                <td style={{ padding: "12px" }}>
                  {career.universidades?.nombre_universidad || "N/A"}
                </td>
                <td style={{ padding: "12px" }}>
                  <code style={{ backgroundColor: "#f8f9fa", padding: "2px 4px", borderRadius: "3px" }}>
                    {career.slug}
                  </code>
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => startEdit(career)}
                    style={{ padding: "4px 8px", marginRight: "5px", backgroundColor: "#ffc107", border: "none", borderRadius: "4px" }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(career.id_carrera)}
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

export default CareersAdmin;
