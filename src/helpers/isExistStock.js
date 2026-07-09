import prisma from "../../prismaClient.js";

export default async function isExistStock(products = [], storeId, checkStock = true) {
  const productIds = products.map((p) => p.productId);

  const stocks = await prisma.product.findMany({
    where: { id: { in: productIds }, storeId },
    select: { id: true, name: true, currentStock: true },
  });

  const stockMap = new Map(stocks.map((s) => [s.id, s]));

  for (const product of products) {
    const productBD = stockMap.get(product.productId);

    if (!productBD) {
      const error = new Error(
        `El producto con id ${product.productId} no existe o no pertenece a tu tienda`,
      );
      error.statusCode = 404;
      throw error;
    }

    if (checkStock && productBD.currentStock - product.quantity < 0) {
      const error = new Error(
        `El producto: ${productBD.name} no cuenta con el stock suficiente`,
      );
      error.statusCode = 400;
      throw error;
    }
  }
}
