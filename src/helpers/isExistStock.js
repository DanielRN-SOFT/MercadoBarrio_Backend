import prisma from "../../prismaClient";

export default async function isExistStock(products = []) {
  const stocks = await Promise.all(
    products.map((product) =>
      prisma.product.findUnique({
        where: { id: product.productId },
        select: { id: true, name: true, currentStock: true },
      }),
    ),
  );

  const existStock = await Promise.all(
    stocks.map((productBD) => {
      products.map((productAPI) => {
        if (productBD.id == productAPI.productId) {
          const restaStock = productBD.currentStock - productAPI.quantity;
          if (restaStock < 0) {
            const error = new Error(
              `El producto: ${productBD.name} no cuenta con el stock suficiente`,
            );
          }
        }
      });
    }),
  );

}
