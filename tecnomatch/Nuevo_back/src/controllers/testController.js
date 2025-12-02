// src/controllers/testController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Importar las preguntas del frontend
const questions = require("../../../frontend/src/data/questions").questions;

// Calcular perfil MBTI basado en respuestas
function calculateMBTI(answers) {
  const dimensions = {
    E: 0, I: 0, // Extraversion vs Introversion
    S: 0, N: 0, // Sensing vs Intuition
    T: 0, F: 0, // Thinking vs Feeling
    J: 0, P: 0  // Judging vs Perceiving
  };
  
  // Calcular puntajes para cada dimensión
  answers.forEach((answer, index) => {
    if (index < questions.length) {
      const question = questions[index];
      const dimension = question.dimension; // "E/I", "S/N", etc.
      const mapaPuntos = question.mapaPuntos;
      
      // Obtener la letra correspondiente a la respuesta (1-5)
      const punto = mapaPuntos[answer.toString()];
      
      if (punto) {
        dimensions[punto] += 1;
      }
    }
  });
  
  // Determinar el perfil MBTI
  let mbti = '';
  mbti += dimensions.E >= dimensions.I ? 'E' : 'I';
  mbti += dimensions.S >= dimensions.N ? 'S' : 'N';
  mbti += dimensions.T >= dimensions.F ? 'T' : 'F';
  mbti += dimensions.J >= dimensions.P ? 'J' : 'P';
  
  return mbti;
}

// Endpoint para obtener las preguntas
async function getQuestions(req, res) {
  try {
    return res.json(questions);
  } catch (error) {
    console.error("Error en getQuestions:", error);
    return res.status(500).json({ error: "Error obteniendo preguntas" });
  }
}

// Guardar resultados del test
// En la función submitTest - agregar logs
async function submitTest(req, res) {
  try {
    console.log("📥 Request recibido - submitTest");
    console.log("User ID:", req.user?.id);
    console.log("Answers recibidas:", req.body.answers);
    
    const { answers } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      console.log("❌ Error: User ID no encontrado");
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Respuestas del test requeridas" });
    }

    if (answers.length === 0) {
      return res.status(400).json({ error: "El test debe tener respuestas" });
    }

    if (answers.length !== questions.length) {
      console.log("❌ Error: Número de respuestas incorrecto", answers.length, "esperado:", questions.length);
      return res.status(400).json({ error: "Número de respuestas incorrecto" });
    }

    // Calcular perfil MBTI
    const mbtiType = calculateMBTI(answers);
    console.log("🔮 Perfil MBTI calculado:", mbtiType);
    
    // Buscar el perfil psicológico correspondiente
    const perfil = await prisma.perfilespsicologicos.findFirst({
      where: { nombre_perfil: mbtiType }
    });

    console.log("📊 Perfil encontrado en BD:", perfil);

    if (!perfil) {
      console.log("❌ Error: Perfil no encontrado en BD:", mbtiType);
      return res.status(404).json({ error: `Perfil ${mbtiType} no encontrado` });
    }

    // Guardar resultado del test
    console.log("💾 Guardando resultado en BD...");
    const resultado = await prisma.resultados_test.create({
      data: {
        id_usuario: parseInt(userId),
        id_perfil: perfil.id_perfil,
        fecha: new Date()
      },
      include: {
        perfilespsicologicos: {
          select: {
            nombre_perfil: true,
            descripcion: true
          }
        }
      }
    });

    console.log("✅ Resultado guardado exitosamente:", resultado);

    return res.json({
      message: "Test guardado exitosamente",
      profile: mbtiType,
      resultado: resultado
    });

  } catch (error) {
    console.error("❌ Error en submitTest:", error);
    return res.status(500).json({ error: "Error guardando el test: " + error.message });
  }
}
// Obtener todos los tests realizados por un usuario
async function getUserTests(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID requerido" });
    }

    const tests = await prisma.resultados_test.findMany({
      where: { id_usuario: Number(userId) },
      orderBy: { fecha: "desc" },
      include: {
        perfilespsicologicos: {
          select: {
            nombre_perfil: true,
            descripcion: true
          }
        }
      }
    });

    return res.json(tests);
  } catch (error) {
    console.error("Error en getUserTests:", error);
    return res.status(500).json({ error: "Error obteniendo tests" });
  }
}

// Obtener el último test de un usuario
async function getLastUserTest(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID requerido" });
    }

    const lastTest = await prisma.resultados_test.findFirst({
      where: { id_usuario: Number(userId) },
      orderBy: { fecha: "desc" },
      include: {
        perfilespsicologicos: {
          select: {
            nombre_perfil: true,
            descripcion: true
          }
        }
      }
    });

    if (!lastTest) {
      return res.status(404).json({ error: "No se encontró test previo" });
    }

    return res.json(lastTest);
  } catch (error) {
    console.error("Error en getLastUserTest:", error);
    return res.status(500).json({ error: "Error obteniendo último test" });
  }
}

module.exports = {
  getUserTests,
  getLastUserTest,
  submitTest,
  getQuestions
};