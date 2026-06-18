import prisma from "../../prismaClient.js";

export async function seedRoles() {
  const roles = [
    { name: "Admin", status: "Active" },
    { name: "Grocer", status: "Active" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles seeded");
}
