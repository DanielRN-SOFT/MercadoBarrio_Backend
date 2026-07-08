import prisma from "../../prismaClient.js";

export async function seedSuppliers() {
  const suppliers = [
    {
      name: "Distribuidora El Sol",
      email: "distribuidora@gmail.com",
      address: "Carrera 4 #15-09",
      city: "Medellin",
      phone: "3001234567",
      status: "Active",
    },
    {
      name: "Proveedora Central",
      email: "proveedora@gmail.com",
      address: "Calle 2 #20-29",
      city: "Cartago",
      phone: "3109876543",
      status: "Active",
    },
    {
      name: "Importaciones Andes",
      email: "importaciones@gmail.com",
      address: "Carrera 10 #15-09",
      city: "Cali",
      phone: "3205551234",
      status: "Active",
    },
    {
      name: "Suministros del Valle",
      email: "suministros@gmail.com",
      address: "Carrera 12 #15-09",
      city: "Pereira",
      phone: "3157890123",
      status: "Active",
    },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.create({ data: supplier });
  }

  console.log("✅ Suppliers seeded");
}
