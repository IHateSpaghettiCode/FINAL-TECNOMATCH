const request = require("supertest");
const app = require("../src/app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Career API", () => {
  let authToken;

  beforeAll(async () => {
    // Create a test user and get token
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Test",
        apellido: "User",
        correo: "test-career@example.com",
        password: "password123"
      });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        correo: "test-career@example.com",
        password: "password123"
      });

    authToken = loginRes.body.token;
  });

afterAll(async () => {
  // Delete related records first to avoid FK constraint errors
  await prisma.recomendaciones.deleteMany({ where: { resultados_test: { usuarios: { correo: { startsWith: "test-career@" } } } } });
  await prisma.resultados_test.deleteMany({ where: { usuarios: { correo: { startsWith: "test-career@" } } } });
  await prisma.auditoria_usuarios.deleteMany({ where: { usuarios: { correo: { startsWith: "test-career@" } } } });
  await prisma.favoritos.deleteMany({ where: { usuarios: { correo: { startsWith: "test-career@" } } } });
  await prisma.carreras_vistas.deleteMany({ where: { usuarios: { correo: { startsWith: "test-career@" } } } });
  await prisma.universidades_vistas.deleteMany({ where: { usuarios: { correo: { startsWith: "test-career@" } } } });
  await prisma.usuarios.deleteMany({ where: { correo: { startsWith: "test-career@" } } });
  await prisma.$disconnect();
});

  describe("GET /api/careers", () => {
    it("should get careers with pagination", async () => {
      const res = await request(app)
        .get("/api/careers?page=1&limit=5")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("careers");
      expect(res.body).toHaveProperty("pagination");
      expect(Array.isArray(res.body.careers)).toBe(true);
    });

    it("should filter careers by search term", async () => {
      const res = await request(app)
        .get("/api/careers?search=ingenieria")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.careers)).toBe(true);
    });

    it("should filter careers by university", async () => {
      const res = await request(app)
        .get("/api/careers?university=nacional")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.careers)).toBe(true);
    });
  });

  describe("GET /api/careers/:slug", () => {
    it("should get career by slug", async () => {
      // Use a known slug from the populated data
      const res = await request(app)
        .get("/api/careers/ingenieria-de-software")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id_carrera");
    });

    it("should return 404 for non-existent career", async () => {
      const res = await request(app)
        .get("/api/careers/non-existent-slug")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(404);
    });
  });
});
