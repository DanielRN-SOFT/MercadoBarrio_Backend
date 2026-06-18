import prisma from "../../prismaClient.js";

export async function seedStores() {
  const userAdmin = await prisma.user.findFirstOrThrow({
    where: { email: "admin@gmail.com" },
  });
  const userGrocer = await prisma.user.findFirstOrThrow({
    where: { email: "grocer@gmail.com" },
  });
  const userCustomer = await prisma.user.findFirstOrThrow({
    where: { email: "customer@gmail.com" },
  });

  const catAbarrotes = await prisma.storeCategory.findFirstOrThrow({
    where: { name: "Tienda de abarrotes" },
  });
  const catFarmacia = await prisma.storeCategory.findFirstOrThrow({
    where: { name: "Farmacia" },
  });
  const catPanaderia = await prisma.storeCategory.findFirstOrThrow({
    where: { name: "Panadería" },
  });

  const stores = [
    {
      name: "Tienda Don Carlos",
      address: "Calle 10 # 5-23, Cartago",
      longitude: -75.9124,
      latitude: 4.7459,
      description: "Tienda de abarrotes del barrio centro",
      phone: "3101234567",
      status: "Active",
      userId: userAdmin.id,
      storeCategoryId: catAbarrotes.id,
      onboardingStep: "completed",
    },
    {
      name: "Minimercado La Esquina",
      address: "Carrera 8 # 12-45, Cartago",
      longitude: -75.92,
      latitude: 4.748,
      description: "Minimercado surtido con productos del hogar",
      phone: "3209876543",
      status: "Active",
      userId: userGrocer.id,
      storeCategoryId: catAbarrotes.id,
      onboardingStep: "completed",
    },
    {
      name: "Farmacia Salud Total",
      address: "Avenida 3 # 8-10, Cartago",
      longitude: -75.915,
      latitude: 4.7465,
      description: "Farmacia con medicamentos y productos de salud",
      phone: "3155551234",
      status: "Active",
      userId: userCustomer.id,
      storeCategoryId: catFarmacia.id,
      onboardingStep: "completed",
    },
    {
      name: "Panadería El Trigal",
      address: "Calle 15 # 3-67, Cartago",
      longitude: -75.918,
      latitude: 4.749,
      description: "Panadería artesanal con productos frescos",
      phone: "3004445566",
      status: "Active",
      userId: userAdmin.id,
      storeCategoryId: catPanaderia.id,
      onboardingStep: "completed",
    },
  ];

  for (const store of stores) {
    await prisma.store.create({ data: store });
  }

  console.log("✅ Stores seeded");
}
