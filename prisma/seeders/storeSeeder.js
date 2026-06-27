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
      neighborhood: "Centro",
      photo: null,
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
      neighborhood: "El Jardín",
      photo: null,
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
      neighborhood: "La Merced",
      photo: null,
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
      neighborhood: "Venecia",
      photo: null,
      longitude: -75.918,
      latitude: 4.749,
      description: "Panadería artesanal con productos frescos",
      phone: "3004445566",
      status: "Active",
      userId: userAdmin.id,
      storeCategoryId: catPanaderia.id,
      onboardingStep: "completed",
    },
    {
      name: "Tienda Doña Rosa",
      address: "Carrera 5 # 20-14, Cartago",
      neighborhood: "Chapinero",
      photo: null,
      longitude: -75.9105,
      latitude: 4.7502,
      description: "Tienda familiar con productos de primera necesidad",
      phone: "3117778899",
      status: "Active",
      userId: userGrocer.id,
      storeCategoryId: catAbarrotes.id,
      onboardingStep: "completed",
    },
    {
      name: "Minimercado El Palmar",
      address: "Calle 22 # 9-31, Cartago",
      neighborhood: "El Palmar",
      photo: null,
      longitude: -75.9088,
      latitude: 4.7521,
      description: "Minimercado con frutas, verduras y abarrotes",
      phone: "3226663344",
      status: "Active",
      userId: userCustomer.id,
      storeCategoryId: catAbarrotes.id,
      onboardingStep: "completed",
    },
  ];

  for (const store of stores) {
    await prisma.store.create({ data: store });
  }

  console.log("✅ Stores seeded");
}
