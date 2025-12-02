const router = require("express").Router();
const { getCareers, getCareerBySlug } = require("../controllers/careerController"); // Remueve refreshCareers
// const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/careers:
 *   get:
 *     summary: Obtener carreras con paginación, búsqueda y filtros
 *     tags: [Careers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Elementos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre de carrera
 *       - in: query
 *         name: university
 *         schema:
 *           type: string
 *         description: Filtrar por universidad
 *     responses:
 *       200:
 *         description: Lista de carreras
 */
router.get("/", getCareers);

/**
 * @swagger
 * /api/careers/{slug}:
 *   get:
 *     summary: Obtener carrera por slug
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug de la carrera
 *     responses:
 *       200:
 *         description: Detalles de la carrera
 */
router.get("/:slug", getCareerBySlug);

/**
 * @swagger
 * /api/careers/refresh:
 *   post:
 *     summary: Refrescar datos de carreras (Admin only)
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Refresco iniciado
 *       403:
 *         description: Solo administradores
 */
// COMENTA TEMPORALMENTE ESTA LÍNEA:
// router.post("/refresh", authMiddleware, isAdmin, refreshCareers);

module.exports = router;