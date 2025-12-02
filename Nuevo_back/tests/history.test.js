const request = require("supertest");
const app = require("../src/app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("History API", () => {
  let authToken;
  let userId;
  let careerId;

  beforeAll(async () => {
    // Create a test user and get token
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Test",
        apellido: "History",
        correo: "test-history@example.com",
        password: "password123"
      });

    userId = userRes.body.id_usuario;

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        correo: "test-history@example.com",
        password: "password123"
      });

    authToken = loginRes.body.token;

    // Get a career ID for testing
    const careersRes = await request(app)
      .get("/api/careers?page=1&limit=1")
      .set("Authorization", `Bearer ${authToken}`);

    if (careersRes.body.careers.length > 0) {
      careerId = careersRes.body.careers[0].id_carrera;
    }
  });

  afterAll(async () => {
    // Delete related records first to avoid FK constraint errors
    await prisma.recomendaciones.deleteMany({ where: { resultados_test: { id_usuario: userId } } });
    await prisma.resultados_test.deleteMany({ where: { id_usuario: userId } });
    await prisma.auditoria_usuarios.deleteMany({ where: { id_usuario: userId } });
    await prisma.favoritos.deleteMany({ where: { id_usuario: userId } });
    await prisma.carreras_vistas.deleteMany({ where: { id_usuario: userId } });
    await prisma.universidades_vistas.deleteMany({ where: { id_usuario: userId } });
    await prisma.usuarios.deleteMany({ where: { correo: { startsWith: "test-history@" } } });
    await prisma.$disconnect();
  });

  describe("GET /api/history", () => {
    it("should get user history", async () => {
      const res = await request(app)
        .get("/api/history")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("history");
      expect(res.body.history).toHaveProperty("tests");
      expect(res.body.history).toHaveProperty("viewed");
      expect(res.body.history).toHaveProperty("favorites");
      expect(Array.isArray(res.body.history.tests)).toBe(true);
      expect(Array.isArray(res.body.history.viewed)).toBe(true);
      expect(Array.isArray(res.body.history.favorites)).toBe(true);
    });
  });

  describe("POST /api/history/favorites", () => {
    it("should add career to favorites", async () => {
      if (careerId) {
        const res = await request(app)
          .post("/api/history/favorites")
          .set("Authorization", `Bearer ${authToken}`)
          .send({ id_carrera: careerId });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message");
      }
    });

    it("should not add duplicate favorite", async () => {
      if (careerId) {
        const res = await request(app)
          .post("/api/history/favorites")
          .set("Authorization", `Bearer ${authToken}`)
          .send({ id_carrera: careerId });

        expect(res.statusCode).toEqual(400);
      }
    });
  });

  describe("DELETE /api/history/favorites/:id", () => {
    it("should remove career from favorites", async () => {
      if (careerId) {
        const res = await request(app)
          .delete(`/api/history/favorites/${careerId}`)
          .set("Authorization", `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message");
      }
    });
  });

  describe("POST /api/history/views", () => {
    it("should record career view", async () => {
      if (careerId) {
        const res = await request(app)
          .post("/api/history/views")
          .set("Authorization", `Bearer ${authToken}`)
          .send({ id_carrera: careerId });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message");
      }
    });
  });
});
