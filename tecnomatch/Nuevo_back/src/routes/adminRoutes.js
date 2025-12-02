const express = require("express");
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, createCareer, updateCareer, deleteCareer } = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Obtener lista de usuarios (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *         description: Buscar por nombre, apellido, correo o usuario
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: Acceso denegado
 */
router.get("/users", verifyToken, isAdmin, getUsers);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Crear nuevo usuario (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - correo
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *               telefono:
 *                 type: string
 *               rol_id:
 *                 type: integer
 *                 default: 2
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Acceso denegado
 */
router.post("/users", verifyToken, isAdmin, createUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Actualizar usuario (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               estado:
 *                 type: integer
 *               rol_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: Acceso denegado
 */
router.put("/users/:id", verifyToken, isAdmin, updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Eliminar usuario (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: Acceso denegado
 */
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

/**
 * @swagger
 * /api/admin/careers:
 *   post:
 *     summary: Crear nueva carrera (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_carrera
 *               - id_universidad
 *             properties:
 *               nombre_carrera:
 *                 type: string
 *               slug:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               objetivo:
 *                 type: string
 *               id_universidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Carrera creada
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Acceso denegado
 */
router.post("/careers", verifyToken, isAdmin, createCareer);

/**
 * @swagger
 * /api/admin/careers/{id}:
 *   put:
 *     summary: Actualizar carrera (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_carrera:
 *                 type: string
 *               slug:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               objetivo:
 *                 type: string
 *               id_universidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Carrera actualizada
 *       404:
 *         description: Carrera no encontrada
 *       403:
 *         description: Acceso denegado
 */
router.put("/careers/:id", verifyToken, isAdmin, updateCareer);

/**
 * @swagger
 * /api/admin/careers/{id}:
 *   delete:
 *     summary: Eliminar carrera (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrera eliminada
 *       404:
 *         description: Carrera no encontrada
 *       403:
 *         description: Acceso denegado
 */
router.delete("/careers/:id", verifyToken, isAdmin, deleteCareer);

module.exports = router;
