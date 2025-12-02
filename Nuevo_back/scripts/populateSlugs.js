// scripts/populateSlugs.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function generateSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[^a-z0-9 ]/g, "") // quitar caracteres especiales
    .replace(/\s+/g, '-') // reemplazar espacios con guiones
    .trim();
}

async function populateSlugs() {
  try {
    const carreras = await prisma.carreras.findMany({
      where: { slug: null }
    });

    console.log(`Encontradas ${carreras.length} carreras sin slug`);

    for (const carrera of carreras) {
      const slug = generateSlug(carrera.nombre_carrera);
      
      await prisma.carreras.update({
        where: { id_carrera: carrera.id_carrera },
        data: { slug }
      });
      
      console.log(`Actualizada: ${carrera.nombre_carrera} -> ${slug}`);
    }

    console.log("Slugs poblados exitosamente");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

populateSlugs();