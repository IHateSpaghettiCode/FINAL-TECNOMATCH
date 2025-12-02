// =======================================
// 📦 DEPENDENCIAS
// =======================================
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

// =======================================
// ⚙️ CONFIGURACIÓN INICIAL
// =======================================
dotenv.config();
const app = express();

// Habilitar CORS
app.use(cors());

// Permitir JSON grandes (para imágenes o archivos)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =======================================
// 🧩 RUTAS API
// =======================================
const authRoutes = require("./routes/authRoutes");
const careerRoutes = require("./routes/careerRoutes");
const testRoutes = require("./routes/testRoutes");
const statsRoutes = require("./routes/statsRoutes");
const historyRoutes = require("./routes/historyRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Registrar rutas con prefijo /api/
app.use("/api/auth", authRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// =======================================
// 📘 SWAGGER (Documentación de la API)
// =======================================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TecnoMatch API",
      version: "1.0.0",
      description: "API para la plataforma TecnoMatch",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// =======================================
// 🌐 SERVIR FRONTEND (Vite build en /dist)
// =======================================
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// =======================================
// 🚀 INICIO DEL SERVIDOR
// =======================================
const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}

// Exportar la app para pruebas o importaciones
module.exports = app;
