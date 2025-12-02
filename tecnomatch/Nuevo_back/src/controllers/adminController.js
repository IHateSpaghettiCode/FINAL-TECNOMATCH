// src/controllers/adminController.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// CRUD de Usuarios
async function getUsers(req, res) {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { nombre: { contains: search.toUpperCase() } },
        { apellido: { contains: search.toUpperCase() } },
        { correo: { contains: search.toUpperCase() } },
        { nombre_usuario: { contains: search.toUpperCase() } }
      ];
    }

    const users = await prisma.usuarios.findMany({
      where,
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        nombre_usuario: true,
        correo: true,
        telefono: true,
        estado: true,
        confirmed: true,
        created_at: true,
        roles: { select: { nombre: true } }
      },
      skip,
      take,
      orderBy: { created_at: 'desc' }
    });

    const total = await prisma.usuarios.count({ where });

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    console.error("Error en getUsers:", error);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
}

async function createUser(req, res) {
  try {
    const { nombre, apellido, correo, password, telefono, rol_id } = req.body;

    if (!nombre || !apellido || !correo || !password) {
      return res.status(400).json({ error: "Nombre, apellido, correo y contraseña son obligatorios", message: "Por favor rellena nombre, apellido, correo y contraseña." });
    }

    const existingUser = await prisma.usuarios.findUnique({
      where: { correo: correo.toUpperCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está registrado", message: "El correo ya se encuentra registrado. Intenta iniciar sesión o recupera la contraseña." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.usuarios.create({
      data: {
        nombre: nombre.toUpperCase(),
        apellido: apellido.toUpperCase(),
        correo: correo.toUpperCase(),
        password: hashedPassword,
        nombre_usuario: correo.split('@')[0].toUpperCase(),
        telefono: telefono ? telefono.toUpperCase() : null,
        rol_id: rol_id || 2,
        estado: 1,
        confirmed: true // Los usuarios creados por admin están confirmados
      },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        nombre_usuario: true,
        correo: true,
        telefono: true,
        estado: true,
        confirmed: true,
        roles: { select: { nombre: true } }
      }
    });

    res.status(201).json({ user: newUser, message: `Usuario ${newUser.nombre} ${newUser.apellido} creado exitosamente` });
  } catch (error) {
    console.error("Error en createUser:", error);
    res.status(500).json({ error: "Error creando usuario", message: "Ocurrió un error al crear el usuario. Intenta nuevamente más tarde." });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, telefono, estado, rol_id } = req.body;

    const existingUser = await prisma.usuarios.findUnique({
      where: { id_usuario: Number(id) }
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si el correo ya existe en otro usuario
    if (correo && correo.toUpperCase() !== existingUser.correo) {
      const emailExists = await prisma.usuarios.findUnique({
        where: { correo: correo.toUpperCase() }
      });
      if (emailExists) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }
    }

    const updatedUser = await prisma.usuarios.update({
      where: { id_usuario: Number(id) },
      data: {
        nombre: nombre ? nombre.toUpperCase() : existingUser.nombre,
        apellido: apellido ? apellido.toUpperCase() : existingUser.apellido,
        correo: correo ? correo.toUpperCase() : existingUser.correo,
        telefono: telefono !== undefined ? (telefono ? telefono.toUpperCase() : null) : existingUser.telefono,
        estado: estado !== undefined ? estado : existingUser.estado,
        rol_id: rol_id !== undefined ? rol_id : existingUser.rol_id
      },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        nombre_usuario: true,
        correo: true,
        telefono: true,
        estado: true,
        confirmed: true,
        roles: { select: { nombre: true } }
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({ error: "Error actualizando usuario" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const existingUser = await prisma.usuarios.findUnique({
      where: { id_usuario: Number(id) }
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // No permitir eliminar al admin principal
    if (existingUser.rol_id === 1 && existingUser.correo === 'ADMIN2@GMAIL.COM') {
      return res.status(400).json({ error: "No se puede eliminar al administrador principal" });
    }

    await prisma.usuarios.delete({
      where: { id_usuario: Number(id) }
    });

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error en deleteUser:", error);
    res.status(500).json({ error: "Error eliminando usuario" });
  }
}

module.exports = { getUsers, createUser, updateUser, deleteUser };
// Admin CRUD for careers (create/update/delete)

function generateSlug(text) {
  if (!text) return null;
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function createCareer(req, res) {
  try {
    console.log('adminController.createCareer called', req.body);
    const { nombre_carrera, slug, descripcion, objetivo, imagen, duracion, modalidad, id_universidad, costo, estado } = req.body;

    if (!nombre_carrera || !id_universidad) {
      return res.status(400).json({ error: 'nombre_carrera y id_universidad son obligatorios', message: 'Por favor especifica el nombre de la carrera y la universidad asociada.' });
    }

    // Verificar universidad
    const university = await prisma.universidades.findUnique({ where: { id_universidad: Number(id_universidad) } });
    if (!university) return res.status(400).json({ error: 'Universidad no encontrada', message: 'No se encontró la universidad solicitada. Verifica el ID.' });

    const finalSlug = slug ? slug : generateSlug(nombre_carrera);

    // Verificar slug único
    const existing = await prisma.carreras.findFirst({ where: { slug: finalSlug } });
    if (existing) return res.status(400).json({ error: 'Slug ya existe para otra carrera', message: 'El slug ya está en uso. Usa uno diferente o edita la existente.' });

    const newCareer = await prisma.carreras.create({
      data: {
        nombre_carrera: nombre_carrera,
        slug: finalSlug,
        descripcion: descripcion || null,
        objetivo: objetivo || null,
        imagen: imagen || null,
        duracion: duracion || null,
        modalidad: modalidad || null,
        id_universidad: Number(id_universidad),
        costo: costo || null,
        estado: estado || undefined
      }
    });

    res.status(201).json({ career: newCareer, message: `Carrera ${newCareer.nombre_carrera} creada exitosamente` });
  } catch (error) {
    console.error('Error en createCareer:', error);
    res.status(500).json({ error: 'Error creando carrera', message: 'Ocurrió un error al crear la carrera. Intenta nuevamente más tarde.' });
  }
}

async function updateCareer(req, res) {
  try {
    const { id } = req.params;
    const { nombre_carrera, slug, descripcion, objetivo, imagen, duracion, modalidad, id_universidad, costo, estado } = req.body;

    const existingCareer = await prisma.carreras.findUnique({ where: { id_carrera: Number(id) } });
    if (!existingCareer) return res.status(404).json({ error: 'Carrera no encontrada' });

    let finalSlug = slug || existingCareer.slug || generateSlug(nombre_carrera || existingCareer.nombre_carrera);

    // Si cambiamos slug verificar unicidad
    if (finalSlug && finalSlug !== existingCareer.slug) {
      const slugExists = await prisma.carreras.findFirst({ where: { slug: finalSlug } });
      if (slugExists) return res.status(400).json({ error: 'Slug ya existe para otra carrera', message: 'El slug ya está en uso por otra carrera. Elige uno distinto.' });
    }

    const updatedCareer = await prisma.carreras.update({
      where: { id_carrera: Number(id) },
      data: {
        nombre_carrera: nombre_carrera || existingCareer.nombre_carrera,
        slug: finalSlug,
        descripcion: descripcion !== undefined ? descripcion : existingCareer.descripcion,
        objetivo: objetivo !== undefined ? objetivo : existingCareer.objetivo,
        imagen: imagen !== undefined ? imagen : existingCareer.imagen,
        duracion: duracion !== undefined ? duracion : existingCareer.duracion,
        modalidad: modalidad !== undefined ? modalidad : existingCareer.modalidad,
        id_universidad: id_universidad ? Number(id_universidad) : existingCareer.id_universidad,
        costo: costo !== undefined ? costo : existingCareer.costo,
        estado: estado !== undefined ? estado : existingCareer.estado
      }
    });

    res.json({ career: updatedCareer, message: `Carrera ${updatedCareer.nombre_carrera} actualizada exitosamente` });
  } catch (error) {
    console.error('Error en updateCareer:', error);
    res.status(500).json({ error: 'Error actualizando carrera', message: 'Ocurrió un error al actualizar la carrera. Intenta nuevamente más tarde.' });
  }
}

async function deleteCareer(req, res) {
  try {
    const { id } = req.params;

    const existingCareer = await prisma.carreras.findUnique({ where: { id_carrera: Number(id) } });
    if (!existingCareer) return res.status(404).json({ error: 'Carrera no encontrada' });

    await prisma.carreras.delete({ where: { id_carrera: Number(id) } });

    res.json({ message: 'Carrera eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteCareer:', error);
    res.status(500).json({ error: 'Error eliminando carrera', message: 'Ocurrió un error al eliminar la carrera. Intenta nuevamente más tarde.' });
  }
}

module.exports = { getUsers, createUser, updateUser, deleteUser, createCareer, updateCareer, deleteCareer };
