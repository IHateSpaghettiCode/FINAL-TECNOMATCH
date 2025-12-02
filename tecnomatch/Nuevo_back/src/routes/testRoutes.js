// src/routes/testRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUserTests,
  getLastUserTest,
  submitTest,
  getQuestions
} = require("../controllers/testController");

// Middleware de autenticación
const { verifyToken } = require("../middlewares/authMiddleware");

// Obtener preguntas del test (público o autenticado según necesites)
router.get("/questions", getQuestions);

// Obtener todos los tests del usuario autenticado
router.get("/", verifyToken, getUserTests);

// Obtener el último test del usuario autenticado
router.get("/last", verifyToken, getLastUserTest);

// Guardar un nuevo test
router.post("/", verifyToken, submitTest);

module.exports = router;