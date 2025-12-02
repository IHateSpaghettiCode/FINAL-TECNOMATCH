// scripts/populateAllCareers.js - VERSIÓN CORREGIDA
const { PrismaClient } = require("@prisma/client");
const { recommendations } = require("../../frontend/src/data/recommendations");
const prisma = new PrismaClient();

function generarSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, '-')
    .trim();
}

async function migrarDatosEstaticos() {
  console.log("🚀 Migrando datos estáticos a BD...");
  
  const allRecs = [];
  for (const type in recommendations) {
    allRecs.push(...recommendations[type]);
  }

  for (const rec of allRecs) {
    try {
      // PRIMERO: Buscar si la universidad ya existe
      let uni = await prisma.universidades.findFirst({
        where: { 
          nombre_universidad: rec.university 
        }
      });

      // SI NO EXISTE, crear la universidad
      if (!uni) {
        uni = await prisma.universidades.create({
          data: {
            nombre_universidad: rec.university,
            ciudad: "Bogotá",
            snies: null
          }
        });
        console.log(`🏫 Universidad creada: ${rec.university}`);
      }

      // Buscar si la carrera ya existe por slug
      const carreraExistente = await prisma.carreras.findFirst({
        where: { slug: rec.slug }
      });

      if (carreraExistente) {
        // ACTUALIZAR carrera existente
        await prisma.carreras.update({
          where: { id_carrera: carreraExistente.id_carrera },
          data: {
            nombre_carrera: rec.program,
            id_universidad: uni.id_universidad,
            descripcion: rec.description,
            objetivo: rec.objective,
            imagen: rec.image,
            duracion: rec.duration,
            modalidad: rec.cards?.[0]?.value || "Presencial",
            costo: rec.cards?.find(c => c.label === "Inversión")?.value || "N/A"
          }
        });
        console.log(`🔄 Actualizada: ${rec.program}`);
      } else {
        // CREAR nueva carrera
        await prisma.carreras.create({
          data: {
            nombre_carrera: rec.program,
            slug: rec.slug,
            id_universidad: uni.id_universidad,
            descripcion: rec.description,
            objetivo: rec.objective,
            imagen: rec.image,
            duracion: rec.duration,
            modalidad: rec.cards?.[0]?.value || "Presencial",
            costo: rec.cards?.find(c => c.label === "Inversión")?.value || "N/A"
          }
        });
        console.log(`✅ Creada: ${rec.program}`);
      }

    } catch (error) {
      console.error(`❌ Error en ${rec.program}:`, error.message);
    }
  }
}

async function main() {
  try {
    // 1. Migrar datos estáticos
    await migrarDatosEstaticos();
    
    console.log("🎉 Migración completada exitosamente");
    
    // 2. Verificar que se crearon las carreras
    const totalCarreras = await prisma.carreras.count();
    const totalUniversidades = await prisma.universidades.count();
    
    console.log(`📊 Total carreras en BD: ${totalCarreras}`);
    console.log(`🏫 Total universidades en BD: ${totalUniversidades}`);
    
    // 3. Mostrar algunas carreras creadas
    const algunasCarreras = await prisma.carreras.findMany({
      take: 5,
      include: { universidades: true }
    });
    
    console.log("📝 Primeras 5 carreras:");
    algunasCarreras.forEach(carrera => {
      console.log(`   - ${carrera.nombre_carrera} (${carrera.universidades.nombre_universidad})`);
    });
    
  } catch (error) {
    console.error("❌ Error en la migración:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();