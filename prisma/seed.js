require("dotenv").config();
const { PrismaClient } = require("../src/generated/prisma");
const argon2 = require("argon2");

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL;
  const passwordPlain = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FNAME;
  const lastName = process.env.ADMIN_LNAME;

  if (!username || !email || !passwordPlain || !firstName || !lastName) {
    throw new Error(
      "Missing ADMIN_USERNAME, ADMIN_EMAIL, or ADMIN_PASSWORD in .env"
    );
  }

  const password = await argon2.hash(passwordPlain, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MiB
    timeCost: 4,
    parallelism: 2,
  });

  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing) {
    console.log(`Admin user "${username}" already exists, skipping creation.`);
  } else {
    await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password,
        isAdmin: true,
        isActive: true,
      },
    });
    console.log(`Admin user "${username}" created.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
