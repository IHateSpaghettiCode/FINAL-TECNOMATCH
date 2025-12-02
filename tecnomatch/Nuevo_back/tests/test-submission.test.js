const request = require("supertest");
const app = require("../src/app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Test Submission API", () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Create a test user and get token
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Test",
        apellido: "Submission",
        correo: "test-submission@example.com",
        password: "password123"
      });

    userId = userRes.body.id_usuario;

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        correo: "test-submission@example.com",
        password: "password123"
      });

    authToken = loginRes.body.token;
  });

afterAll(async () => {
  // Delete related records first to avoid FK constraint errors
  await prisma.recomendaciones.deleteMany({ where: { resultados_test: { id_usuario: userId } } });
  await prisma.resultados_test.deleteMany({ where: { id_usuario: userId } });
  await prisma.auditoria_usuarios.deleteMany({ where: { id_usuario: userId } });
  await prisma.universidades_vistas.deleteMany({ where: { id_usuario: userId } });
  await prisma.carreras_vistas.deleteMany({ where: { id_usuario: userId } });
  await prisma.favoritos.deleteMany({ where: { id_usuario: userId } });
  await prisma.usuarios.deleteMany({ where: { correo: { startsWith: "test-submission@" } } });
  await prisma.$disconnect();
});

  describe("POST /api/tests", () => {
    it("should submit personality test results", async () => {
      const testAnswers = [3, 2, 4, 1, 5, 3, 2, 4, 1, 5]; // Sample answers

      const res = await request(app)
        .post("/api/tests")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ answers: testAnswers });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("profile");
    });

    it("should reject test submission without authentication", async () => {
      const testAnswers = [3, 2, 4, 1, 5];

      const res = await request(app)
        .post("/api/tests")
        .send({ answers: testAnswers });

      expect(res.statusCode).toEqual(401);
    });

    it("should reject invalid test data", async () => {
      const res = await request(app)
        .post("/api/tests")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ answers: "invalid" });

      expect(res.statusCode).toEqual(400);
    });

    it("should reject empty answers array", async () => {
      const res = await request(app)
        .post("/api/tests")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ answers: [] });

      expect(res.statusCode).toEqual(400);
    });
  });
});
