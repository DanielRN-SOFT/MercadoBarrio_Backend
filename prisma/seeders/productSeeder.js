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
    // ─── Tienda Don Carlos ───────────────────────────────────────────────────

    // Bebidas
    {
      name: "Agua Cristal 600ml",
      price: 1800,
      referenceCode: "BEB-001",
      lowStockThreshold: 24,
      currentStock: 96,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1616118132534-381148898bb4?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Agua Cristal 1.5L",
      price: 3200,
      referenceCode: "BEB-002",
      lowStockThreshold: 12,
      currentStock: 48,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Gaseosa Postobón Manzana 400ml",
      price: 2500,
      referenceCode: "BEB-003",
      lowStockThreshold: 12,
      currentStock: 60,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Gaseosa Postobón Uva 2L",
      price: 6500,
      referenceCode: "BEB-004",
      lowStockThreshold: 6,
      currentStock: 24,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomLitro.id,
      storeId: store1.id,
    },
    {
      name: "Gaseosa Coca-Cola 400ml",
      price: 2800,
      referenceCode: "BEB-005",
      lowStockThreshold: 12,
      currentStock: 72,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Jugo Hit Naranja 300ml",
      price: 2200,
      referenceCode: "BEB-006",
      lowStockThreshold: 12,
      currentStock: 36,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Avena Quaker Líquida 250ml",
      price: 2500,
      referenceCode: "BEB-007",
      lowStockThreshold: 12,
      currentStock: 30,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Cerveza Águila 330ml",
      price: 3200,
      referenceCode: "BEB-008",
      lowStockThreshold: 24,
      currentStock: 48,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },

    // Lácteos
    {
      name: "Leche Alquería Entera 1L",
      price: 4200,
      referenceCode: "LAC-001",
      lowStockThreshold: 12,
      currentStock: 36,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomLitro.id,
      storeId: store1.id,
    },
    {
      name: "Leche Alquería Deslactosada 1L",
      price: 4800,
      referenceCode: "LAC-002",
      lowStockThreshold: 6,
      currentStock: 18,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomLitro.id,
      storeId: store1.id,
    },
    {
      name: "Queso Campesino 250g",
      price: 5500,
      referenceCode: "LAC-003",
      lowStockThreshold: 5,
      currentStock: 12,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Queso Campesino 500g",
      price: 9800,
      referenceCode: "LAC-004",
      lowStockThreshold: 5,
      currentStock: 10,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Yogur Alpina Fresa 150g",
      price: 2200,
      referenceCode: "LAC-005",
      lowStockThreshold: 12,
      currentStock: 24,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Kumis Alquería 200ml",
      price: 2800,
      referenceCode: "LAC-006",
      lowStockThreshold: 6,
      currentStock: 18,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Mantequilla Colanta 100g",
      price: 3500,
      referenceCode: "LAC-007",
      lowStockThreshold: 5,
      currentStock: 15,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },

    // Snacks
    {
      name: "Papas Margarita Sal 105g",
      price: 2800,
      referenceCode: "SNK-001",
      lowStockThreshold: 12,
      currentStock: 48,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Papas Margarita Limón 105g",
      price: 2800,
      referenceCode: "SNK-002",
      lowStockThreshold: 12,
      currentStock: 36,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Chitos Flaming 55g",
      price: 1800,
      referenceCode: "SNK-003",
      lowStockThreshold: 12,
      currentStock: 60,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Galletas Oreo 36g",
      price: 1500,
      referenceCode: "SNK-004",
      lowStockThreshold: 12,
      currentStock: 72,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Galletas Festival Vainilla 6u",
      price: 1200,
      referenceCode: "SNK-005",
      lowStockThreshold: 12,
      currentStock: 48,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1594985451284-2d3aae9a22d8?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomPaquete.id,
      storeId: store1.id,
    },
    {
      name: "Chocolatina Jet 16g",
      price: 900,
      referenceCode: "SNK-006",
      lowStockThreshold: 24,
      currentStock: 120,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },

    // Granos
    {
      name: "Arroz Diana 500g",
      price: 2800,
      referenceCode: "GRA-001",
      lowStockThreshold: 12,
      currentStock: 60,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1536304993881-ff86e0c4c574?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store1.id,
    },
    {
      name: "Arroz Diana 1kg",
      price: 5200,
      referenceCode: "GRA-002",
      lowStockThreshold: 10,
      currentStock: 80,
      status: "Active",
      photo:
        "https://plus.unsplash.com/premium_photo-1705338026411-00639520a438?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store1.id,
    },
    {
      name: "Frijol Cargamanto 500g",
      price: 4500,
      referenceCode: "GRA-003",
      lowStockThreshold: 8,
      currentStock: 30,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store1.id,
    },
    {
      name: "Lenteja 500g",
      price: 3800,
      referenceCode: "GRA-004",
      lowStockThreshold: 8,
      currentStock: 25,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store1.id,
    },
    {
      name: "Garbanzo 500g",
      price: 4200,
      referenceCode: "GRA-005",
      lowStockThreshold: 6,
      currentStock: 20,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store1.id,
    },
    {
      name: "Azúcar Manuelita 1kg",
      price: 4800,
      referenceCode: "GRA-006",
      lowStockThreshold: 10,
      currentStock: 40,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1579761626000-8e7f0d3d3e23?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store1.id,
    },
    {
      name: "Sal Refisal 500g",
      price: 1500,
      referenceCode: "GRA-007",
      lowStockThreshold: 8,
      currentStock: 35,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1628428738249-31dcb4a36284?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store1.id,
    },
    {
      name: "Harina de Trigo 1kg",
      price: 4200,
      referenceCode: "GRA-008",
      lowStockThreshold: 6,
      currentStock: 24,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store1.id,
    },

    // ─── Minimercado La Esquina ──────────────────────────────────────────────

    // Bebidas
    {
      name: "Gaseosa Sprite 400ml",
      price: 2800,
      referenceCode: "E-BEB-001",
      lowStockThreshold: 12,
      currentStock: 60,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Agua Brisa 600ml",
      price: 1800,
      referenceCode: "E-BEB-002",
      lowStockThreshold: 24,
      currentStock: 72,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Jugo Frutiño Uva 240ml",
      price: 1200,
      referenceCode: "E-BEB-003",
      lowStockThreshold: 12,
      currentStock: 48,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Pony Malta 330ml",
      price: 2500,
      referenceCode: "E-BEB-004",
      lowStockThreshold: 12,
      currentStock: 36,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1570598912132-0ba1dc952b7d?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Avena Quaker en Polvo 180g",
      price: 4500,
      referenceCode: "E-BEB-005",
      lowStockThreshold: 8,
      currentStock: 20,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=400&q=80",
      productCategoryId: catBebidas.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },

    // Lácteos
    {
      name: "Leche Colanta Entera 1L",
      price: 4000,
      referenceCode: "E-LAC-001",
      lowStockThreshold: 12,
      currentStock: 30,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomLitro.id,
      storeId: store2.id,
    },
    {
      name: "Queso Doblecrema 250g",
      price: 6200,
      referenceCode: "E-LAC-002",
      lowStockThreshold: 5,
      currentStock: 12,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1634487359989-3e90c9432133?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Crema de Leche Alpina 200ml",
      price: 3800,
      referenceCode: "E-LAC-003",
      lowStockThreshold: 6,
      currentStock: 15,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Arequipe Alpina 200g",
      price: 4200,
      referenceCode: "E-LAC-004",
      lowStockThreshold: 5,
      currentStock: 18,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80",
      productCategoryId: catLacteos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },

    // Snacks
    {
      name: "Cheetos Queso 65g",
      price: 2200,
      referenceCode: "E-SNK-001",
      lowStockThreshold: 12,
      currentStock: 50,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1626082929543-1c2f4b1a8a1a?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Papas Natuchips Natural 85g",
      price: 2500,
      referenceCode: "E-SNK-002",
      lowStockThreshold: 12,
      currentStock: 40,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1576642589592-7d9d2a4f8e60?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Galletas Saltín Noel 134g",
      price: 3200,
      referenceCode: "E-SNK-003",
      lowStockThreshold: 8,
      currentStock: 30,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Maní con Pasas 100g",
      price: 2800,
      referenceCode: "E-SNK-004",
      lowStockThreshold: 10,
      currentStock: 35,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1567217729596-96c58f3c8b47?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Bom Bom Bum Fresa",
      price: 500,
      referenceCode: "E-SNK-005",
      lowStockThreshold: 30,
      currentStock: 150,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&q=80",
      productCategoryId: catSnacks.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },

    // Aseo
    {
      name: "Jabón Rey Limón 300g",
      price: 3200,
      referenceCode: "E-ASE-001",
      lowStockThreshold: 6,
      currentStock: 30,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1600857544200-b2f468e15d0b?w=400&q=80",
      productCategoryId: catAseo.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Detergente Ariel 500g",
      price: 8200,
      referenceCode: "E-ASE-002",
      lowStockThreshold: 5,
      currentStock: 20,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=80",
      productCategoryId: catAseo.id,
      unitOfMeasureId: uomPaquete.id,
      storeId: store2.id,
    },
    {
      name: "Detergente Fab Floral 1kg",
      price: 12500,
      referenceCode: "E-ASE-003",
      lowStockThreshold: 5,
      currentStock: 15,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1585232350693-48c75b4e8c44?w=400&q=80",
      productCategoryId: catAseo.id,
      unitOfMeasureId: uomKg.id,
      storeId: store2.id,
    },
    {
      name: "Limpiapisos Fabuloso Lavanda 900ml",
      price: 7500,
      referenceCode: "E-ASE-004",
      lowStockThreshold: 4,
      currentStock: 18,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80",
      productCategoryId: catAseo.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Papel Higiénico Scott 4 rollos",
      price: 6800,
      referenceCode: "E-ASE-005",
      lowStockThreshold: 6,
      currentStock: 24,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=80",
      productCategoryId: catAseo.id,
      unitOfMeasureId: uomPaquete.id,
      storeId: store2.id,
    },
    {
      name: "Shampoo Head & Shoulders 200ml",
      price: 18500,
      referenceCode: "E-ASE-006",
      lowStockThreshold: 4,
      currentStock: 12,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80",
      productCategoryId: catAseo.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Pasta Dental Colgate Triple 75ml",
      price: 5500,
      referenceCode: "E-ASE-007",
      lowStockThreshold: 6,
      currentStock: 20,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80",
      productCategoryId: catAseo.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Desodorante Axe 97g",
      price: 14900,
      referenceCode: "E-ASE-008",
      lowStockThreshold: 4,
      currentStock: 10,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80",
      productCategoryId: catAseo.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },

    // Granos
    {
      name: "Arroz Roa 1kg",
      price: 5000,
      referenceCode: "E-GRA-001",
      lowStockThreshold: 10,
      currentStock: 55,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store2.id,
    },
    {
      name: "Frijol Bolo Rojo 500g",
      price: 4200,
      referenceCode: "E-GRA-002",
      lowStockThreshold: 8,
      currentStock: 28,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1623428187425-b3e4ea3e9754?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store2.id,
    },
    {
      name: "Azúcar Riopaila 2kg",
      price: 9200,
      referenceCode: "E-GRA-003",
      lowStockThreshold: 6,
      currentStock: 30,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1598449356475-b9f71db7d847?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomKg.id,
      storeId: store2.id,
    },
    {
      name: "Panela Redonda 500g",
      price: 3800,
      referenceCode: "E-GRA-004",
      lowStockThreshold: 8,
      currentStock: 40,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1558642891-54be180ea339?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
    {
      name: "Aceite Girasol Premier 900ml",
      price: 16500,
      referenceCode: "E-GRA-005",
      lowStockThreshold: 4,
      currentStock: 18,
      status: "Active",
      photo:
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
      productCategoryId: catGranos.id,
      unitOfMeasureId: uomUnidad.id,
      storeId: store2.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ Products seeded — ${products.length} productos creados`);
}
