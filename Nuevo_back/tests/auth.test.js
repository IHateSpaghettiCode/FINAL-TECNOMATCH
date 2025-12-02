const request = require("supertest");
const app = require("../src/app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up test data - delete related records first
  await prisma.auditoria_usuarios.deleteMany({ where: { usuarios: { correo: { startsWith: "test@" } } } });
  await prisma.resultados_test.deleteMany({ where: { usuarios: { correo: { startsWith: "test@" } } } });
  await prisma.universidades_vistas.deleteMany({ where: { usuarios: { correo: { startsWith: "test@" } } } });
  await prisma.carreras_vistas.deleteMany({ where: { usuarios: { correo: { startsWith: "test@" } } } });
  await prisma.favoritos.deleteMany({ where: { usuarios: { correo: { startsWith: "test@" } } } });
  await prisma.usuarios.deleteMany({ where: { correo: { startsWith: "test@" } } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Test",
        apellido: "User",
        correo: "test@example.com",
        password: "password123"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id_usuario");
  });

  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        correo: "test@example.com",
        password: "password123"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        correo: "test@example.com",
        password: "wrongpassword"
      });
    expect(res.statusCode).toEqual(401);
  });
});
