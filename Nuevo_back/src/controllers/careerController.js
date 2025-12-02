const { PrismaClient } = require("@prisma/client");
const { spawn } = require("child_process");
const path = require("path");

const prisma = new PrismaClient();

async function getCareers(req, res) {
  const { page = 1, limit = 10, search, university } = req.query;
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};
  if (search) {
    where.nombre_carrera = { contains: search };
  }
  if (university) {
    where.universidades = { nombre_universidad: { contains: university } };
  }

  const careers = await prisma.carreras.findMany({
    where,
    include: { universidades: true },
    skip,
    take
  });

  const total = await prisma.carreras.count({ where });

  res.json({
    careers,
    pagination: {
      page: parseInt(page),
      limit: take,
      total,
      pages: Math.ceil(total / take)
    }
  });
}

async function refreshCareers(req, res) {
  const scriptPath = path.join(__dirname, "../../scripts/importarCarrerasPrisma.js");
  const child = spawn("node", [scriptPath]);

  child.stdout.on("data", data => console.log("import:", data.toString()));
  child.stderr.on("data", data => console.error("import err:", data.toString()));

  res.json({ message: "Importación en background iniciada" });
}

async function getCareerBySlug(req, res) {
  const { slug } = req.params;
  const career = await prisma.carreras.findUnique({
    where: { slug },
    include: { universidades: true }
  });
  if (!career) return res.status(404).json({ error: 'Career not found' });
  res.json(career);
}

module.exports = { getCareers, refreshCareers, getCareerBySlug };
