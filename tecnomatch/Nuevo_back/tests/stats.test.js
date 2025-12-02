const request = require("supertest");
const app = require("../src/app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Stats API", () => {
  let authToken;

  beforeAll(async () => {
    // Create a test user and get token
    await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Test",
        apellido: "Stats",
        correo: "test-stats@example.com",
        password: "password123"
      });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        correo: "test-stats@example.com",
        password: "password123"
      });

    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    // Delete related records first to avoid FK constraint errors
    await prisma.auditoria_usuarios.deleteMany({ where: { usuarios: { correo: { startsWith: "test-stats@" } } } });
    await prisma.resultados_test.deleteMany({ where: { usuarios: { correo: { startsWith: "test-stats@" } } } });
    await prisma.universidades_vistas.deleteMany({ where: { usuarios: { correo: { startsWith: "test-stats@" } } } });
    await prisma.carreras_vistas.deleteMany({ where: { usuarios: { correo: { startsWith: "test-stats@" } } } });
    await prisma.favoritos.deleteMany({ where: { usuarios: { correo: { startsWith: "test-stats@" } } } });
    await prisma.usuarios.deleteMany({ where: { correo: { startsWith: "test-stats@" } } });
    await prisma.$disconnect();
  });

  describe("GET /api/stats/personality-counts", () => {
    it("should get personality profile counts", async () => {
      const res = await request(app)
        .get("/api/stats/personality-counts")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/stats/popular-careers", () => {
    it("should get popular careers", async () => {
      const res = await request(app)
        .get("/api/stats/popular-careers")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/stats/user-activity", () => {
    it("should get user activity stats", async () => {
      const res = await request(app)
        .get("/api/stats/user-activity")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("totalUsers");
    });
  });

  describe("GET /api/stats/career-stats", () => {
    it("should get career stats by university", async () => {
      const res = await request(app)
        .get("/api/stats/career-stats")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
