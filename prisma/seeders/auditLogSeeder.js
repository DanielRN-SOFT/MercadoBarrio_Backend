import prisma from "../../prismaClient.js";

export async function seedAuditLogs() {
  const userAdmin = await prisma.user.findFirstOrThrow({
    where: { email: "admin@gmail.com" },
  });
  const userGrocer = await prisma.user.findFirstOrThrow({
    where: { email: "grocer@gmail.com" },
  });

  const logs = [
    {
      eventActionType: "CREATE",
      userId: userAdmin.id,
      clientIp: "192.168.1.1",
      resourceType: "Product",
      resourceId: 1,
      newValue: JSON.stringify({
        name: "Agua Cristal 600ml",
        status: "Activo",
      }),
      description: "Producto creado",
      status: "Active",
    },
    {
      eventActionType: "UPDATE",
      userId: userAdmin.id,
      clientIp: "192.168.1.1",
      resourceType: "Product",
      resourceId: 1,
      previousValue: JSON.stringify({ price: 1400 }),
      newValue: JSON.stringify({ price: 1500 }),
      description: "Precio actualizado",
      status: "Active",
    },
    {
      eventActionType: "CREATE",
      userId: userGrocer.id,
      clientIp: "192.168.1.2",
      resourceType: "Sale",
      resourceId: 1,
      newValue: JSON.stringify({ total: 9000, status: "Completada" }),
      description: "Venta registrada",
      status: "Active",
    },
    {
      eventActionType: "LOGIN",
      userId: userAdmin.id,
      clientIp: "192.168.1.1",
      resourceType: "User",
      resourceId: userAdmin.id,
      description: "Inicio de sesión",
      status: "Active",
    },
  ];

  for (const log of logs) {
    await prisma.auditLog.create({ data: log });
  }

  console.log("✅ Audit logs seeded");
}
