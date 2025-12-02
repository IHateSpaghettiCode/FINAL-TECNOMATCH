const router = require("express").Router();
const { personalityCounts, popularCareers, userActivity, careerStats } = require("../controllers/statsController");

/**
 * @swagger
 * /api/stats/personality-counts:
 *   get:
 *     summary: Contar usuarios por perfil de personalidad
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Conteo de perfiles
 */
router.get("/personality-counts", personalityCounts);

/**
 * @swagger
 * /api/stats/popular-careers:
 *   get:
 *     summary: Carreras más populares
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Carreras populares
 */
router.get("/popular-careers", popularCareers);

/**
 * @swagger
 * /api/stats/user-activity:
 *   get:
 *     summary: Actividad de usuarios
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Estadísticas de actividad
 */
router.get("/user-activity", userActivity);

/**
 * @swagger
 * /api/stats/career-stats:
 *   get:
 *     summary: Estadísticas de carreras por universidad
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Estadísticas de carreras
 */
router.get("/career-stats", careerStats);

module.exports = router;
