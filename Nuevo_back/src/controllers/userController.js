// src/controllers/userController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener perfil de usuario + último test MBTI
async function getUserProfile(req, res) {
  try {
    const userId = req.user?.id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID requerido", message: "Necesitamos tu ID de usuario para mostrar el perfil." });
    }

    const user = await prisma.usuarios.findUnique({
      where: { id_usuario: Number(userId) },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        nombre_usuario: true,
        correo: true,
        telefono: true,
        profileImage: true,
        created_at: true,
        rol_id: true,
        roles: { select: { nombre: true } }
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado", message: "No encontramos tu usuario. Revisa que estés autenticado." });
    }

    // Buscar último test MBTI si existe
    const lastTest = await prisma.resultados_test.findFirst({
      where: { id_usuario: Number(userId) },
      orderBy: { fecha: "desc" },
      include: {
        perfilespsicologicos: {
          select: { nombre_perfil: true }
        }
      }
    });

    return res.json({
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      nombre_usuario: user.nombre_usuario,
      correo: user.correo,
      telefono: user.telefono,
      foto_perfil: user.profileImage, // Devolver tal cual está en la BD
      created_at: user.created_at,
      rol_id: user.rol_id,
      rol_nombre: user.roles?.nombre || "Usuario", // Agregar rol_nombre
      lastTest: lastTest ? {
        mbtiType: lastTest.perfilespsicologicos?.nombre_perfil,
        fecha: lastTest.fecha
      } : null
    });
  } catch (error) {
    console.error("Error en getUserProfile:", error);
    return res.status(500).json({ error: "Error obteniendo perfil de usuario", message: "Ocurrió un error recuperando el perfil. Intenta nuevamente más tarde." });
  }
}

// Actualizar foto de perfil del usuario - VERSIÓN SIMPLE
async function updateProfileImage(req, res) {
  try {
    const userId = req.user?.id;
    const { imageUrl } = req.body;

    if (!userId || !imageUrl) {
      return res.status(400).json({ error: "User ID e imagen requeridos", message: "Por favor selecciona una imagen válida y vuelve a intentarlo." });
    }

    // GUARDAR EXACTAMENTE lo que llega del frontend
    const updatedUser = await prisma.usuarios.update({
      where: { id_usuario: Number(userId) },
      data: { profileImage: imageUrl },
      select: { 
        id_usuario: true, 
        nombre: true, 
        correo: true, 
        profileImage: true
      },
    });

    return res.json({
      ...updatedUser,
      foto_perfil: updatedUser.profileImage
    });
  } catch (error) {
    console.error("Error en updateProfileImage:", error);
    return res.status(500).json({ error: "Error actualizando foto de perfil", message: "Ocurrió un error al subir tu foto. Intenta con otra imagen." });
  }
}

module.exports = {
  getUserProfile,
  updateUser: async (req, res) => {
    try {
      const userId = req.user?.id;
      const { nombre, email, telefono } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID requerido", message: "Usuario no autenticado. Por favor inicia sesión." });
      }

      const updatedUser = await prisma.usuarios.update({
        where: { id_usuario: Number(userId) },
        data: { 
          nombre: nombre,
          correo: email,
          telefono: telefono
        },
        select: { 
          id_usuario: true, 
          nombre: true, 
          apellido: true,
          nombre_usuario: true,
          correo: true, 
          telefono: true 
        },
      });

      return res.json(updatedUser);
    } catch (error) {
      console.error("Error en updateUser:", error);
      return res.status(500).json({ error: "Error actualizando usuario", message: "Ocurrió un error actualizando tu perfil. Intenta nuevamente más tarde." });
    }
  },
  updateProfileImage
};