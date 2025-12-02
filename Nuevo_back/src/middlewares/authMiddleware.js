// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1]; // Formato: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // ahora req.user.id estará disponible
    next();
  } catch (error) {
    console.error("Error en verifyToken:", error);
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
}

// Middleware para verificar si es admin
async function isAdmin(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const user = await prisma.usuarios.findUnique({
      where: { id_usuario: userId },
      select: { rol_id: true }
    });

    if (!user || user.rol_id !== 1) {
      return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador" });
    }

    next();
  } catch (error) {
    console.error("Error en isAdmin:", error);
    return res.status(500).json({ error: "Error verificando permisos" });
  }
}

module.exports = { verifyToken, isAdmin };
