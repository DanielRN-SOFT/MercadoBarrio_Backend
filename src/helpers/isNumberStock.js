export default function isNumberStock(products = []) {
  if (!Array.isArray(products) || products.length === 0) {
    const error = new Error("Debes incluir al menos un producto");
    error.statusCode = 400;
    throw error;
  }

  for (const product of products) {
    if (!Number.isInteger(product.productId) || product.productId <= 0) {
      const error = new Error("Cada producto debe tener un id válido");
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isInteger(product.quantity) || product.quantity <= 0) {
      const error = new Error(
        "Todos los productos tienen que tener una cantidad entera superior a 0",
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      product.unitCost !== undefined &&
      product.unitCost !== null &&
      product.unitCost !== "" &&
      (isNaN(Number(product.unitCost)) || Number(product.unitCost) < 0)
    ) {
      const error = new Error("El costo unitario debe ser un número válido");
      error.statusCode = 400;
      throw error;
    }
  }
}
