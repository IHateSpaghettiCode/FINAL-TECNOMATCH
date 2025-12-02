// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUser,
  updateProfileImage  // ← AGREGA ESTA IMPORTACIÓN
} = require("../controllers/userController");

// Middleware de autenticación
const { verifyToken } = require("../middlewares/authMiddleware");

// Obtener perfil del usuario + último test MBTI
router.get("/profile", verifyToken, getUserProfile);

// Actualizar perfil del usuario
router.put("/profile", verifyToken, updateUser);

// Actualizar imagen de perfil
router.put("/profile/image", verifyToken, updateProfileImage);

module.exports = router;