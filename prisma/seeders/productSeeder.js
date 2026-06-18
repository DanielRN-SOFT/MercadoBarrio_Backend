import prisma from "../../prismaClient.js";

export async function seedProducts() {
  const store1 = await prisma.store.findFirstOrThrow({
    where: { name: "Tienda Don Carlos" },
  });
  const store2 = await prisma.store.findFirstOrThrow({
    where: { name: "Minimercado La Esquina" },
  });

  const catBebidas = await prisma.productCategory.findFirstOrThrow({
    where: { name: "Bebidas" },
  });
  const catLacteos = await prisma.productCategory.findFirstOrThrow({
    where: { name: "Lácteos" },
  });
  const catSnacks = await prisma.productCategory.findFirstOrThrow({
    where: { name: "Snacks" },
  });
  const catAseo = await prisma.productCategory.findFirstOrThrow({
    where: { name: "Aseo" },
  });
  const catGranos = await prisma.productCategory.findFirstOrThrow({
    where: { name: "Granos" },
  });

  const uomUnidad = await prisma.unitOfMeasure.findFirstOrThrow({
    where: { name: "Unidad" },
  });
  const uomLitro = await prisma.unitOfMeasure.findFirstOrThrow({
    where: { name: "Litro" },
  });
  const uomKg = await prisma.unitOfMeasure.findFirstOrThrow({
    where: { name: "Kilogramo" },
  });
  const uomPaquete = await prisma.unitOfMeasure.findFirstOrThrow({
    where: { name: "Paquete" },
  });

  const products = [
    // Tienda Don Carlos
    {
      name: "Agua Cristal 600ml",
      price: 1500,
      referenceCode: "BEB-001",
      lowStockThreshold: 10,
      currentStock: 50,
      status: "Active",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Gaseosa Postobón 1.5L",
      price: 4200,
      referenceCode: "BEB-002",
      lowStockThreshold: 10,
      currentStock: 30,
      status: "Active",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomLitro.id,
      storeId: store1.id,
    },
    {
      name: "Leche Alquería 1L",
      price: 3800,
      referenceCode: "LAC-001",
      lowStockThreshold: 5,
      currentStock: 20,
      status: "Active",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomLitro.id,
      storeId: store1.id,
    },
    {
      name: "Queso Campesino 500g",
      price: 8500,
      referenceCode: "LAC-002",
      lowStockThreshold: 5,
      currentStock: 15,
      status: "Active",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Papas Margarita 150g",
      price: 2500,
      referenceCode: "SNK-001",
      lowStockThreshold: 10,
      currentStock: 40,
      status: "Active",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Arroz Diana 1kg",
      price: 4500,
      referenceCode: "GRA-001",
      lowStockThreshold: 10,
      currentStock: 60,
      status: "Active",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store1.id,
    },
    {
      name: "Frijol Cargamanto 500g",
      price: 3200,
      referenceCode: "GRA-002",
      lowStockThreshold: 8,
      currentStock: 25,
      status: "Active",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    // Minimercado La Esquina
    {
      name: "Jabón Rey 300g",
      price: 2800,
      referenceCode: "ASE-001",
      lowStockThreshold: 5,
      currentStock: 35,
      status: "Active",
      productCategoryId: catAseo.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Detergente Ariel 500g",
      price: 7500,
      referenceCode: "ASE-002",
      lowStockThreshold: 5,
      currentStock: 18,
      status: "Active",
      productCategoryId: catAseo.id,
      unitOfMeasureId: uomPaquete.id,
      storeId: store2.id,
    },
    {
      name: "Avena Quaker 200g",
      price: 3100,
      referenceCode: "BEB-003",
      lowStockThreshold: 8,
      currentStock: 22,
      status: "Active",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ Products seeded");
}
