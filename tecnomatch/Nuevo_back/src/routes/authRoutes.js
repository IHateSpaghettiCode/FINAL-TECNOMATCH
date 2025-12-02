 const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require("../controllers/authController");

// Registro
router.post("/register", register);

// Login
router.post("/login", login);

// Recuperar contraseña
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

module.exports = router;
