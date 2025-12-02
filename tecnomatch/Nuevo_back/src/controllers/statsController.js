const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function personalityCounts(req, res) {
  try {
    const raw = await prisma.$queryRaw`
      SELECT p.nombre_perfil, COUNT(rt.id_resultado) as total
      FROM resultados_test rt
      JOIN perfilespsicologicos p ON rt.id_perfil = p.id_perfil
      GROUP BY p.nombre_perfil
    `;
    const safe = raw.map(r => ({
      nombre_perfil: r.nombre_perfil,
      total: Number(r.total)
    }));

    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar estadísticas" });
  }
}

async function popularCareers(req, res) {
  try {
    const careers = await prisma.carreras.findMany({
      include: {
        _count: {
          select: { carreras_vistas: true, favoritos: true, recomendaciones: true }
        }
      },
      orderBy: { carreras_vistas: { _count: 'desc' } },
      take: 10
    });
    res.json(careers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function userActivity(req, res) {
  try {
    const totalUsers = await prisma.usuarios.count();
    const totalTests = await prisma.resultados_test.count();
    const totalViews = await prisma.carreras_vistas.count();
    const totalFavorites = await prisma.favoritos.count();

    res.json({
      totalUsers,
      totalTests,
      totalViews,
      totalFavorites
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function careerStats(req, res) {
  try {
    const stats = await prisma.carreras.groupBy({
      by: ['id_universidad'],
      _count: { id_carrera: true },
      orderBy: { _count: { id_carrera: 'desc' } }
    });

    const withNames = await Promise.all(stats.map(async s => {
      const uni = await prisma.universidades.findUnique({ where: { id_universidad: s.id_universidad } });
      return { universidad: uni.nombre_universidad, count: s._count.id_carrera };
    }));

    res.json(withNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { personalityCounts, popularCareers, userActivity, careerStats };
