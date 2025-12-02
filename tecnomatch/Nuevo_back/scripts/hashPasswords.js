const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function hashExistingPasswords() {
  try {
    console.log("Connecting to DB...");
    const users = await prisma.usuarios.findMany();
    console.log(`Found ${users.length} users.`);

    for (const user of users) {
      console.log(`User ${user.correo}: password starts with ${user.password.substring(0, 10)}...`);
      // Check if password is already hashed (bcrypt hashes start with $2b$)
      if (!user.password.startsWith("$2b$")) {
        const hashed = await bcrypt.hash(user.password, 10);
        await prisma.usuarios.update({
          where: { id_usuario: user.id_usuario },
          data: { password: hashed }
        });
        console.log(`Hashed password for user: ${user.correo}`);
      } else {
        console.log(`Password already hashed for user: ${user.correo}`);
      }
    }

    console.log("All passwords hashed successfully.");
  } catch (err) {
    console.error("Error hashing passwords:", err);
  } finally {
    await prisma.$disconnect();
  }
}

hashExistingPasswords();
