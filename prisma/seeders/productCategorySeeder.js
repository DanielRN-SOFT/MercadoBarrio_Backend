import prisma from "../../prismaClient.js";

export async function seedProductCategories() {
  const categories = [
    { name: "Bebidas", status: "Active" },
    { name: "Lácteos", status: "Active" },
    { name: "Snacks", status: "Active" },
    { name: "Aseo", status: "Active" },
    { name: "Panadería", status: "Active" },
    { name: "Carnes", status: "Active" },
    { name: "Granos", status: "Active" },
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Product categories seeded");
}
