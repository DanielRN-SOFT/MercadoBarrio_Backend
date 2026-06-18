import prisma from "../../prismaClient.js";

export async function seedMovements() {
  const userAdmin = await prisma.user.findFirstOrThrow({
    where: { email: "admin@gmail.com" },
  });
  const userGrocer = await prisma.user.findFirstOrThrow({
    where: { email: "grocer@gmail.com" },
  });

  const store1 = await prisma.store.findFirstOrThrow({
    where: { name: "Tienda Don Carlos" },
  });
  const store2 = await prisma.store.findFirstOrThrow({
    where: { name: "Minimercado La Esquina" },
  });

  const supplier1 = await prisma.supplier.findFirstOrThrow({
    where: { name: "Distribuidora El Sol" },
  });
  const supplier2 = await prisma.supplier.findFirstOrThrow({
    where: { name: "Proveedora Central" },
  });

  const products1 = await prisma.product.findMany({
    where: { storeId: store1.id },
  });
  const products2 = await prisma.product.findMany({
    where: { storeId: store2.id },
  });

  // Entrada tienda 1
  await prisma.movement.create({
    data: {
      date: new Date("2025-01-10T09:00:00"),
      status: "Active",
      type: "Entry",
      supplierId: supplier1.id,
      userId: userAdmin.id,
      storeId: store1.id,
      details: {
        create: products1.slice(0, 3).map((p) => ({
          productId: p.id,
          quantity: 20,
          unitCost: Number(p.price) * 0.7,
        })),
      },
    },
  });

  // Entrada tienda 2
  await prisma.movement.create({
    data: {
      date: new Date("2025-01-11T10:00:00"),
      status: "Active",
      type: "Entry",
      supplierId: supplier2.id,
      userId: userGrocer.id,
      storeId: store2.id,
      details: {
        create: products2.slice(0, 2).map((p) => ({
          productId: p.id,
          quantity: 15,
          unitCost: Number(p.price) * 0.65,
        })),
      },
    },
  });

  // Ajuste de salida tienda 1
  await prisma.movement.create({
    data: {
      date: new Date("2025-01-12T14:00:00"),
      status: "Active",
      type: "AdjustExit",
      reason: "Producto vencido",
      userId: userAdmin.id,
      storeId: store1.id,
      details: {
        create: [
          {
            productId: products1[0].id,
            quantity: 3,
            unitCost: Number(products1[0].price) * 0.7,
          },
        ],
      },
    },
  });

  console.log("✅ Movements seeded");
}
