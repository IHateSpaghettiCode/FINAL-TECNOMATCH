// scripts/populateCareers.js
const { PrismaClient } = require("@prisma/client");
const { recommendations } = require("../../frontend/src/data/recommendations");

const prisma = new PrismaClient();

async function populate() {
  console.log("🏁 Iniciando población de carreras...");

  const allRecs = [];
  for (const type in recommendations) {
    allRecs.push(...recommendations[type]);
  }

  console.log(`📚 Encontradas ${allRecs.length} carreras para importar`);

  // Primero, procesar todas las universidades
  const uniqueUniversities = [...new Set(allRecs.map(rec => rec.university))];
  console.log(`🎓 Universidades únicas encontradas: ${uniqueUniversities.length}`);

  const universityMap = new Map();

  // Crear o encontrar universidades
  for (const [index, uniName] of uniqueUniversities.entries()) {
    try {
      console.log(`\n${index + 1}/${uniqueUniversities.length} Procesando universidad: ${uniName}`);
      
      // Buscar si ya existe la universidad
      let university = await prisma.universidades.findFirst({
        where: { nombre_universidad: uniName }
      });

      // Si no existe, crearla
      if (!university) {
        university = await prisma.universidades.create({
          data: {
            nombre_universidad: uniName,
            ciudad: "Bogotá",
            snies: null
          }
        });
        console.log(`   ✅ Universidad creada: ${university.nombre_universidad} (ID: ${university.id_universidad})`);
      } else {
        console.log(`   ✅ Universidad encontrada: ${university.nombre_universidad} (ID: ${university.id_universidad})`);
      }

      universityMap.set(uniName, university.id_universidad);

    } catch (error) {
      console.error(`   ❌ Error procesando universidad ${uniName}:`, error.message);
    }
  }

  // Luego, procesar todas las carreras
  console.log(`\n📝 Procesando carreras...`);
  
  for (const [index, rec] of allRecs.entries()) {
    try {
      console.log(`\n${index + 1}/${allRecs.length} Procesando carrera: ${rec.program}`);

      const universityId = universityMap.get(rec.university);
      
      if (!universityId) {
        console.log(`   ⚠️  Universidad no encontrada para: ${rec.program}`);
        continue;
      }

      // Buscar si ya existe la carrera por slug
      let existingCareer = await prisma.carreras.findFirst({
        where: { slug: rec.slug }
      });

      let career;
      
      if (existingCareer) {
        // Actualizar carrera existente
        career = await prisma.carreras.update({
          where: { id_carrera: existingCareer.id_carrera },
          data: {
            nombre_carrera: rec.program,
            id_universidad: universityId
          }
        });
        console.log(`   🔄 Carrera actualizada: ${career.nombre_carrera} (ID: ${career.id_carrera})`);
      } else {
        // Crear nueva carrera
        career = await prisma.carreras.create({
          data: {
            nombre_carrera: rec.program,
            slug: rec.slug,
            id_universidad: universityId
          }
        });
        console.log(`   ✅ Carrera creada: ${career.nombre_carrera} (ID: ${career.id_carrera})`);
      }

    } catch (error) {
      console.error(`   ❌ Error procesando carrera ${rec.program}:`, error.message);
    }
  }

  console.log("\n🎉 Población completada!");
  await prisma.$disconnect();
  process.exit(0);
}

// Manejo de errores
populate().catch(async (e) => {
  console.error("💥 Error crítico:", e);
  await prisma.$disconnect();
  process.exit(1);
});