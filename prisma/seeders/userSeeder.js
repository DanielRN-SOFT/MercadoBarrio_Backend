import prisma from "../../prismaClient.js";
import bcrypt from "bcryptjs";


export async function seedUsers() {
  const hashedPassword = await bcrypt.hash("12345", 10);

  const roleAdmin = await prisma.role.findFirstOrThrow({
    where: { name: "Admin" },
  });
  const roleGrocer = await prisma.role.findFirstOrThrow({
    where: { name: "Grocer" },
  });

  const users = [
    {
      name: "Administrador",
      email: "admin@gmail.com",
      password: hashedPassword,
      phone: "3001111111",
      status: "Active",
      roleId: roleAdmin.id,
    },
    {
      name: "Tendero Principal",
      email: "grocer@gmail.com",
      password: hashedPassword,
      phone: "3002222222",
      status: "Active",
      roleId: roleGrocer.id,
    },
    {
      name: "Cliente Demo",
      email: "customer@gmail.com",
      password: hashedPassword,
      phone: "3003333333",
      status: "Active",
      roleId: roleGrocer.id,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log("✅ Users seeded");
}
