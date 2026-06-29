import prisma from "../../prismaClient.js";

// ─── Utilidades ───────────────────────────────────────────────────────────────

/** Entero aleatorio entre min y max (inclusivo) */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Float aleatorio entre min y max, con N decimales */
const randFloat = (min, max, decimals = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

/** Elemento aleatorio de un array */
const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Mezcla un array (Fisher-Yates) */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Genera una fecha aleatoria entre dos fechas con hora típica de
 * operación de bodega (7am - 5pm).
 */
const randDate = (from, to) => {
  const date = new Date(
    from.getTime() + Math.random() * (to.getTime() - from.getTime()),
  );
  date.setHours(randInt(7, 17), randInt(0, 59), randInt(0, 59), 0);
  return date;
};

/** Costo base aproximado de un producto (no ligado a una compra específica) */
const costBasisOf = (price, factor = 0.65) =>
  parseFloat((Number(price) * factor).toFixed(2));

// ─── Motivos por tipo de movimiento ────────────────────────────────────────────

const EXIT_REASONS = [
  "Transferencia a otra tienda",
  "Devolución a proveedor por producto defectuoso",
  "Consumo interno",
  "Muestra promocional / degustación",
  "Donación",
];

const ADJUST_ENTRY_REASONS = [
  "Sobrante encontrado en conteo de inventario",
  "Corrección de digitación (cantidad subregistrada)",
  "Devolución de cliente reintegrada a stock",
  "Producto encontrado en otra ubicación de bodega",
  "Ajuste por auditoría física",
];

const ADJUST_EXIT_REASONS = [
  "Producto vencido",
  "Producto dañado en bodega",
  "Merma por manipulación",
  "Próximo a vencer / retirado de venta",
  "Faltante detectado en auditoría",
  "Rotura durante transporte interno",
];

// ─── Generadores de detalle ────────────────────────────────────────────────────

/**
 * Detalle de una entrada de mercancía: lote de reabastecimiento,
 * con costo unitario como % variable del precio de venta.
 */
const buildEntryDetails = (products, minItems, maxItems, costFactorRange) => {
  const count = randInt(minItems, Math.min(maxItems, products.length));
  const selected = shuffle(products).slice(0, count);
  const [minFactor, maxFactor] = costFactorRange;

  return selected.map((p) => ({
    productId: p.id,
    quantity: randInt(10, 60), // lote de reabastecimiento
    unitCost: costBasisOf(p.price, randFloat(minFactor, maxFactor, 3)),
  }));
};

/**
 * Detalle genérico para Exit / AdjustEntry / AdjustExit: pocos productos,
 * cantidades pequeñas (no son lotes de compra, sino correcciones o salidas puntuales).
 */
const buildSmallDetails = (products, minItems, maxItems, qtyRange) => {
  const count = randInt(minItems, Math.min(maxItems, products.length));
  const selected = shuffle(products).slice(0, count);
  const [minQty, maxQty] = qtyRange;

  return selected.map((p) => ({
    productId: p.id,
    quantity: randInt(minQty, maxQty),
    unitCost: costBasisOf(p.price),
  }));
};

/**
 * Genera movimientos distribuidos mes a mes (para tipos que no siguen
 * un ciclo de reabastecimiento, sino eventos puntuales: Exit, AdjustEntry, AdjustExit).
 */
const generateMonthlyEvents = ({
  startDate,
  today,
  store,
  products,
  users,
  type,
  perMonthRange,
  reasons,
  itemsRange,
  qtyRange,
}) => {
  const events = [];
  const totalMonths = Math.ceil(
    (today - startDate) / (1000 * 60 * 60 * 24 * 30),
  );

  for (let m = 0; m < totalMonths; m++) {
    const monthStart = new Date(startDate);
    monthStart.setMonth(monthStart.getMonth() + m);
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    const cappedEnd = monthEnd > today ? today : monthEnd;
    if (monthStart >= cappedEnd) continue;

    const count = randInt(...perMonthRange);
    const [minItems, maxItems] = itemsRange;

    for (let i = 0; i < count; i++) {
      events.push({
        date: randDate(monthStart, cappedEnd),
        status: "Active",
        type,
        reason: randItem(reasons),
        userId: randItem(users).id,
        storeId: store.id,
        details: {
          create: buildSmallDetails(products, minItems, maxItems, qtyRange),
        },
      });
    }
  }

  return events;
};

// ─── Seeder principal ─────────────────────────────────────────────────────────

export async function seedMovements() {
  // ── Datos base ──
  const [userAdmin, userGrocer] = await Promise.all([
    prisma.user.findFirstOrThrow({ where: { email: "admin@gmail.com" } }),
    prisma.user.findFirstOrThrow({ where: { email: "grocer@gmail.com" } }),
  ]);

  const [store1, store2] = await Promise.all([
    prisma.store.findFirstOrThrow({ where: { name: "Tienda Don Carlos" } }),
    prisma.store.findFirstOrThrow({
      where: { name: "Minimercado La Esquina" },
    }),
  ]);

  const [supplier1, supplier2] = await Promise.all([
    prisma.supplier.findFirstOrThrow({
      where: { name: "Distribuidora El Sol" },
    }),
    prisma.supplier.findFirstOrThrow({
      where: { name: "Proveedora Central" },
    }),
  ]);

  const [products1, products2] = await Promise.all([
    prisma.product.findMany({ where: { storeId: store1.id } }),
    prisma.product.findMany({ where: { storeId: store2.id } }),
  ]);

  if (!products1.length || !products2.length) {
    console.warn(
      "⚠️  Una o ambas tiendas no tienen productos. Abortando seedMovements.",
    );
    return;
  }

  // ── Rango: últimos 7 meses (un mes antes que las ventas, para que haya
  //    stock antes de que empiecen a registrarse ventas) ──
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 7);
  startDate.setHours(0, 0, 0, 0);

  // ── Configuración por tienda ──
  const storeConfigs = [
    {
      store: store1,
      products: products1,
      suppliers: [supplier1, supplier2], // se abastece de ambos
      users: [userAdmin, userGrocer],
      restockEveryDays: [5, 9], // cada 5-9 días llega mercancía
      itemsPerEntry: [2, 5],
      costFactorRange: [0.6, 0.75],
      exitsPerMonth: [0, 2],
      adjustEntriesPerMonth: [0, 2],
      adjustExitsPerMonth: [2, 4],
    },
    {
      store: store2,
      products: products2,
      suppliers: [supplier2], // solo Proveedora Central
      users: [userGrocer],
      restockEveryDays: [4, 7], // más rotación, reabastece más seguido
      itemsPerEntry: [2, 4],
      costFactorRange: [0.55, 0.7],
      exitsPerMonth: [1, 3],
      adjustEntriesPerMonth: [0, 1],
      adjustExitsPerMonth: [1, 3],
    },
  ];

  const allMovements = [];

  for (const config of storeConfigs) {
    // ── Entradas: reabastecimiento periódico ──
    const cursor = new Date(startDate);
    while (cursor <= today) {
      const dayEnd = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
      const supplier = randItem(config.suppliers);
      const user = randItem(config.users);
      const [minItems, maxItems] = config.itemsPerEntry;

      allMovements.push({
        date: randDate(cursor, dayEnd),
        status: "Active",
        type: "Entry",
        supplierId: supplier.id,
        userId: user.id,
        storeId: config.store.id,
        details: {
          create: buildEntryDetails(
            config.products,
            minItems,
            maxItems,
            config.costFactorRange,
          ),
        },
      });

      cursor.setDate(cursor.getDate() + randInt(...config.restockEveryDays));
    }

    // ── Exit: salidas planeadas no ligadas a venta (transferencias, consumo interno, etc.) ──
    allMovements.push(
      ...generateMonthlyEvents({
        startDate,
        today,
        store: config.store,
        products: config.products,
        users: config.users,
        type: "Exit",
        perMonthRange: config.exitsPerMonth,
        reasons: EXIT_REASONS,
        itemsRange: [1, 3],
        qtyRange: [2, 10],
      }),
    );

    // ── AdjustEntry: correcciones que aumentan stock ──
    allMovements.push(
      ...generateMonthlyEvents({
        startDate,
        today,
        store: config.store,
        products: config.products,
        users: config.users,
        type: "AdjustEntry",
        perMonthRange: config.adjustEntriesPerMonth,
        reasons: ADJUST_ENTRY_REASONS,
        itemsRange: [1, 2],
        qtyRange: [1, 5],
      }),
    );

    // ── AdjustExit: correcciones que reducen stock (mermas, vencimientos, etc.) ──
    allMovements.push(
      ...generateMonthlyEvents({
        startDate,
        today,
        store: config.store,
        products: config.products,
        users: config.users,
        type: "AdjustExit",
        perMonthRange: config.adjustExitsPerMonth,
        reasons: ADJUST_EXIT_REASONS,
        itemsRange: [1, 2],
        qtyRange: [1, 6],
      }),
    );
  }

  // Orden cronológico (solo estético, no afecta la inserción)
  allMovements.sort((a, b) => a.date - b.date);

  // Insertar en lotes de 50 para no saturar la conexión
  const BATCH_SIZE = 50;
  let created = 0;

  for (let i = 0; i < allMovements.length; i += BATCH_SIZE) {
    const batch = allMovements.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map((mov) => prisma.movement.create({ data: mov })),
    );
    created += batch.length;
    console.log(
      `   ↳ ${created}/${allMovements.length} movimientos insertados...`,
    );
  }

  console.log(
    `✅ Movements seeded — ${allMovements.length} movimientos generados (últimos 7 meses)`,
  );
}
