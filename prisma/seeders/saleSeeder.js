import prisma from "../../prismaClient.js";

export async function seedSales() {
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

  const products1 = await prisma.product.findMany({
    where: { storeId: store1.id },
  });
  const products2 = await prisma.product.findMany({
    where: { storeId: store2.id },
  });

  const buildDetails = (products, qty) =>
    products.slice(0, 2).map((p) => ({
      productId: p.id,
      quantity: qty,
      unitPrice: Number(p.price),
      subtotal: Number(p.price) * qty,
    }));

  const sales = [
    {
      date: new Date("2025-01-13T10:30:00"),
      status: "Completed",
      userId: userAdmin.id,
      storeId: store1.id,
      total: products1
        .slice(0, 2)
        .reduce((acc, p) => acc + Number(p.price) * 2, 0),
      details: { create: buildDetails(products1, 2) },
    },
    {
      date: new Date("2025-01-13T11:00:00"),
      status: "Completed",
      userId: userAdmin.id,
      storeId: store1.id,
      total: products1
        .slice(0, 2)
        .reduce((acc, p) => acc + Number(p.price) * 1, 0),
      details: { create: buildDetails(products1, 1) },
    },
    {
      date: new Date("2025-01-14T09:00:00"),
      status: "Cancelled",
      userId: userGrocer.id,
      storeId: store1.id,
      total: 0,
      cancellationReason: "Error en cobro",
      cancellationDate: new Date("2025-01-14T09:30:00"),
      details: { create: buildDetails(products1, 1) },
    },
    {
      date: new Date("2025-01-15T15:00:00"),
      status: "Completed",
      userId: userGrocer.id,
      storeId: store2.id,
      total: products2
        .slice(0, 2)
        .reduce((acc, p) => acc + Number(p.price) * 3, 0),
      details: { create: buildDetails(products2, 3) },
    },
  ];

  for (const sale of sales) {
    await prisma.sale.create({ data: sale });
  }

  console.log("✅ Sales seeded");
}
