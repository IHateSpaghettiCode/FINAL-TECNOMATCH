// src/controllers/historyController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener historial completo de un usuario (carreras y tests)
async function getUserHistory(req, res) {
  try {
    const userId = req.user?.id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID requerido" });
    }

    // Carreras vistas - USANDO TU ESQUEMA REAL
    const careers = await prisma.carreras_vistas.findMany({
      where: { id_usuario: Number(userId) },
      include: {
        carreras: {
          include: {
            universidades: true
          }
        }
      },
      orderBy: { fecha: "desc" },
    });

    // Tests realizados - USANDO TU ESQUEMA REAL
    const tests = await prisma.resultados_test.findMany({
      where: { id_usuario: Number(userId) },
      include: {
        perfilespsicologicos: true
      },
      orderBy: { fecha: "desc" },
    });

    // Formatear carreras vistas
    const formattedCareers = careers.map((c) => ({
      id: c.id,
      type: "career",
      name: c.carreras?.nombre_carrera || "Carrera no disponible",
      university: c.carreras?.universidades?.nombre_universidad || "Universidad no disponible",
      slug: c.carreras?.slug || null,
      id_carrera: c.carreras?.id_carrera || null,
      createdAt: c.fecha,
    }));

    // Formatear tests realizados
    const formattedTests = tests.map((t) => ({
      id: t.id_resultado,
      type: "test",
      result: t.perfilespsicologicos?.nombre_perfil || "Sin resultado",
      mbtiType: t.perfilespsicologicos?.nombre_perfil,
      createdAt: t.fecha,
    }));

    const history = [...formattedCareers, ...formattedTests].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json(history);
  } catch (error) {
    console.error("Error en getUserHistory:", error);
    return res.status(500).json({ error: "Error obteniendo historial" });
  }
}

// Guardar una carrera vista en historial
async function addCareerToHistory(req, res) {
  try {
    const { careerId } = req.body; // Cambiado de careerName a careerId
    const userId = req.user?.id;

    if (!userId || !careerId) {
      return res
        .status(400)
        .json({ error: "User ID y careerId son requeridos" });
    }

    // Prevención de duplicados: si la última vista fue hace menos de 60 segundos, no creamos otra
    const lastView = await prisma.carreras_vistas.findFirst({
      where: { id_usuario: Number(userId), id_carrera: Number(careerId) },
      orderBy: { fecha: 'desc' }
    });

    if (lastView) {
      const elapsed = Date.now() - new Date(lastView.fecha).getTime();
      if (elapsed < 60000) {
        // Ya existe una vista reciente, devolver el registro existente
        return res.status(200).json({ message: 'Vista ya registrada recientemente', existing: lastView });
      }
    }

    const newCareer = await prisma.carreras_vistas.create({
      data: { 
        id_usuario: Number(userId), 
        id_carrera: Number(careerId) 
      },
    });

    return res.status(201).json(newCareer);
  } catch (error) {
    console.error("Error en addCareerToHistory:", error);
    return res.status(500).json({ error: "Error guardando carrera en historial" });
  }
}

// Guardar resultado de test en historial
async function addTestToHistory(req, res) {
  try {
    const { result, mbtiType } = req.body;
    const userId = req.user?.id;

    if (!userId || !mbtiType) {
      return res
        .status(400)
        .json({ error: "User ID y tipo MBTI son requeridos" });
    }

    // Buscar el perfil psicológico por el tipo MBTI
    const perfil = await prisma.perfilespsicologicos.findFirst({
      where: { nombre_perfil: mbtiType }
    });

    if (!perfil) {
      return res.status(400).json({ error: "Tipo MBTI no válido" });
    }

    // Prevent duplicates: if the last test result with same profile is inside 60 seconds, don't create new one
    const lastTest = await prisma.resultados_test.findFirst({
      where: { id_usuario: Number(userId), id_perfil: perfil.id_perfil },
      orderBy: { fecha: 'desc' }
    });
    if (lastTest) {
      const elapsed = Date.now() - new Date(lastTest.fecha).getTime();
      if (elapsed < 60000) {
        return res.status(200).json({ message: 'Resultado ya registrado recientemente', existing: lastTest });
      }
    }

    const newTest = await prisma.resultados_test.create({
      data: { 
        id_usuario: Number(userId), 
        id_perfil: perfil.id_perfil 
      },
    });

    return res.status(201).json(newTest);
  } catch (error) {
    console.error("Error en addTestToHistory:", error);
    return res.status(500).json({ error: "Error guardando test en historial" });
  }
}

module.exports = {
  getUserHistory,
  addCareerToHistory,
  addTestToHistory,
};