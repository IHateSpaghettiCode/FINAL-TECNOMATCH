const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing database connection...');
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    // Test a simple query
    const userCount = await prisma.usuarios.count();
    console.log(`Found ${userCount} users in database`);

    await prisma.$disconnect();
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
