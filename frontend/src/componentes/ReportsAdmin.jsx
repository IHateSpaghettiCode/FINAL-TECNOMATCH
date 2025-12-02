import React, { useEffect, useState } from "react";
import API from "../services/api";

const ReportsAdmin = () => {
  const [stats, setStats] = useState({
    personalityCounts: [],
    popularCareers: [],
    userActivity: {},
    careerStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [personalityRes, popularRes, activityRes, careerRes] = await Promise.all([
          API.get("/stats/personality-counts"),
          API.get("/stats/popular-careers"),
          API.get("/stats/user-activity"),
          API.get("/stats/career-stats")
        ]);

        setStats({
          personalityCounts: personalityRes.data || [],
          popularCareers: popularRes.data || [],
          userActivity: activityRes.data || {},
          careerStats: careerRes.data || []
        });
        setError(null);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Cargando estadísticas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reportes y Estadísticas</h2>

      {/* Estadísticas generales */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#007bff" }}>Total Usuarios</h3>
          <p style={{ fontSize: "2em", fontWeight: "bold", margin: "0" }}>{stats.userActivity.totalUsers || 0}</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#28a745" }}>Total Tests</h3>
          <p style={{ fontSize: "2em", fontWeight: "bold", margin: "0" }}>{stats.userActivity.totalTests || 0}</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#ffc107" }}>Vistas de Carreras</h3>
          <p style={{ fontSize: "2em", fontWeight: "bold", margin: "0" }}>{stats.userActivity.totalViews || 0}</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#dc3545" }}>Carreras Favoritas</h3>
          <p style={{ fontSize: "2em", fontWeight: "bold", margin: "0" }}>{stats.userActivity.totalFavorites || 0}</p>
        </div>
      </div>

      {/* Distribución de Personalidades MBTI */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Distribución de Personalidades MBTI</h3>
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Personalidad</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Cantidad</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {stats.personalityCounts.map((item, index) => {
                const total = stats.personalityCounts.reduce((sum, p) => sum + p.total, 0);
                const percentage = total > 0 ? ((item.total / total) * 100).toFixed(1) : 0;
                return (
                  <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>{item.nombre_perfil}</td>
                    <td style={{ padding: "12px" }}>{item.total}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: "20px",
                          backgroundColor: "#007bff",
                          borderRadius: "3px",
                          marginRight: "10px"
                        }}></div>
                        {percentage}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Carreras más populares */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Carreras Más Populares</h3>
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Carrera</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Universidad</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Vistas</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Favoritos</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Recomendaciones</th>
              </tr>
            </thead>
            <tbody>
              {stats.popularCareers.map((career, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{career.nombre_carrera}</td>
                  <td style={{ padding: "12px" }}>{career.universidades?.nombre_universidad}</td>
                  <td style={{ padding: "12px" }}>{career._count?.carreras_vistas || 0}</td>
                  <td style={{ padding: "12px" }}>{career._count?.favoritos || 0}</td>
                  <td style={{ padding: "12px" }}>{career._count?.recomendaciones || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas por Universidad */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Carreras por Universidad</h3>
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Universidad</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Número de Carreras</th>
              </tr>
            </thead>
            <tbody>
              {stats.careerStats.map((stat, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{stat.universidad}</td>
                  <td style={{ padding: "12px" }}>{stat.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Espacio para gráficos futuros */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{
          width: "100%",
          height: "300px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa"
        }}>
          <p>📊 Gráfico de Personalidades MBTI</p>
        </div>
        <div style={{
          width: "100%",
          height: "300px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa"
        }}>
          <p>📈 Actividad de Usuarios</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsAdmin;
