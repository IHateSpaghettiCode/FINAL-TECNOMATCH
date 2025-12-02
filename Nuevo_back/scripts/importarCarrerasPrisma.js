const axios = require("axios");
const csv = require("csv-parser");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DATASET_URL = "https://www.datos.gov.co/api/views/upr9-nkiz/rows.csv?accessType=DOWNLOAD";
const TMP_FILE = "tmp_programas.csv";

// Palabras clave relacionadas con TIC
const KEYWORDS = [
  "sistem", "inform", "software", "telecom", "comput", "ciber",
  "redes", "tic", "ia", "datos", "telemat", "program", "digital"
];

async function downloadCSV() {
  const writer = fs.createWriteStream(TMP_FILE);
  const response = await axios({
    url: DATASET_URL,
    method: "GET",
    responseType: "stream"
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function procesarCSV() {
  const carreras = [];
  let firstRows = 0;

  return new Promise((res, rej) => {
    fs.createReadStream(TMP_FILE)
      .pipe(csv())
      .on("data", (row) => {
        // Log de las primeras 5 filas para ver cómo vienen las columnas
        if (firstRows < 5) {
          console.log("Fila ejemplo:", row);
          firstRows++;
        }

        const nombre = (row["NOMBRE DEL PROGRAMA"] || "").toLowerCase();
        const universidad = row["INSTITUCIÓN DE EDUCACIÓN SUPERIOR"] || "";
        const snies = row["CÓDIGO SNIES DEL PROGRAMA"] || null;
        const ciudadRaw = (row["CIUDAD DE OFERTA"] || "").toLowerCase();

        // Normaliza: quita acentos (Bogotá -> bogota)
        const ciudad = ciudadRaw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (
          ciudad.includes("bogota") &&
          KEYWORDS.some(k => nombre.includes(k)) &&
          snies // evita insertar carreras sin código SNIES
        ) {
          carreras.push({
            nombre: row["NOMBRE DEL PROGRAMA"],
            universidad,
            snies
          });
        }
      })
      .on("end", () => res(carreras))
      .on("error", rej);
  });
}

async function upsertAll(carreras) {
  for (const c of carreras) {
    const uni = await prisma.universidades.upsert({
      where: { snies: c.snies },
      update: { nombre_universidad: c.universidad, ciudad: "Bogotá" },
      create: {
        nombre_universidad: c.universidad,
        ciudad: "Bogotá",
        snies: c.snies
      }
    });

    await prisma.carreras.upsert({
      where: { nombre_carrera: c.nombre },
      update: { id_universidad: uni.id_universidad },
      create: { nombre_carrera: c.nombre, id_universidad: uni.id_universidad }
    });
  }
}

async function main() {
  console.log("Descargando CSV...");
  await downloadCSV();
  console.log("Procesando archivo...");
  const carreras = await procesarCSV();
  console.log(`Encontradas ${carreras.length} carreras TIC en Bogotá`);
  if (carreras.length > 0) {
    await upsertAll(carreras);
    console.log("Importación finalizada");
  } else {
    console.log("No se encontraron coincidencias. Revisa las keywords o columnas.");
  }
  process.exit(0);
}

main().catch(e => {
  console.error("Error en la importación:", e);
  process.exit(1);
});
