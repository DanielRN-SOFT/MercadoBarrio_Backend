import prisma from "../../prismaClient.js";

export async function seedSuppliers() {
  const suppliers = [
    { name: "Distribuidora El Sol", phone: "3001234567", status: "Active" },
    { name: "Proveedora Central", phone: "3109876543", status: "Active" },
    { name: "Importaciones Andes", phone: "3205551234", status: "Active" },
    { name: "Suministros del Valle", phone: "3157890123", status: "Active" },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.create({ data: supplier });
  }

  console.log("✅ Suppliers seeded");
}
