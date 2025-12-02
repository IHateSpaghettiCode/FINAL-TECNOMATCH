// src/routes/historyRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUserHistory,
  addCareerToHistory,
  addTestToHistory,
} = require("../controllers/historyController");

// Middleware de autenticación
const { verifyToken } = require("../middlewares/authMiddleware");

// Obtener historial completo del usuario (carreras + tests)
router.get("/", verifyToken, getUserHistory);

// Guardar carrera vista en historial
router.post("/career", verifyToken, addCareerToHistory);

// Guardar resultado de test en historial
router.post("/test", verifyToken, addTestToHistory);

module.exports = router;
