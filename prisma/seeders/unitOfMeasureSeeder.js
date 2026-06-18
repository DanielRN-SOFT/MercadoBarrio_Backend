import prisma from "../../prismaClient.js";

export async function seedUnitsOfMeasure() {
  const units = [
    { name: "Unidad", status: "Active" },
    { name: "Kilogramo", status: "Active" },
    { name: "Litro", status: "Active" },
    { name: "Caja", status: "Active" },
    { name: "Paquete", status: "Active" },
    { name: "Gramo", status: "Active" },
    { name: "Mililitro", status: "Active" },
  ];

  for (const unit of units) {
    await prisma.unitOfMeasure.upsert({
      where: { name: unit.name },
      update: {},
      create: unit,
    });
  }

  console.log("✅ Units of measure seeded");
}
