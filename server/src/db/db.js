const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// async function initDB() {
//   try {
//     // This connects to the database specified in DATABASE_URL
//     await prisma.$connect();
//     console.log('Successfully connected to the database via Prisma.');
//   } catch (error) {
//     console.error('Failed to connect to the database via Prisma:', error);
//     process.exit(1);
//   }
// }

async function initDB() {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.error("DB connection failed, continuing without DB", error);
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
  }
}

module.exports = { prisma, initDB };
