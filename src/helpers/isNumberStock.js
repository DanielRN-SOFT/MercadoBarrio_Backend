import prisma from "../../prismaClient";

export default function isNumberStock(products = []) {
  products.map((product) => {
    if (product.quantity <= 0) {
      const error = new Error(
        "Todos los productos tienen que tener un stock superior a 0",
      );
      error.statusCode = 400;
      throw error;
    }
  });
}
