import { prisma } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'team@example.com';
  
  // Check if user already exists to avoid crashing if ran multiple times
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User ${email} already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash('team2026', 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: 'Team Admin',
      password: hashedPassword,
    },
  });

  console.log(`Created default user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
