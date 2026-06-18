import prisma from "../../prismaClient.js";

export async function seedStoreCategories() {
  const categories = [
    { name: "Tienda de abarrotes", status: "Active" },
    { name: "Farmacia", status: "Active" },
    { name: "Panadería", status: "Active" },
    { name: "Papelería", status: "Active" },
    { name: "Miscelánea", status: "Active" },
  ];

  for (const cat of categories) {
    await prisma.storeCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Store categories seeded");
}
