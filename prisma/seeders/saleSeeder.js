import prisma from "../../prismaClient.js";

// ─── Utilidades ───────────────────────────────────────────────────────────────

/** Entero aleatorio entre min y max (inclusivo) */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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
 * Genera una fecha aleatoria entre dos fechas con hora y minutos realistas.
 * Más probabilidad de caer en horas pico (8-12, 15-19) y fines de semana.
 */
const randDate = (from, to) => {
  const date = new Date(
    from.getTime() + Math.random() * (to.getTime() - from.getTime()),
  );

  // Horas pico: mañana (8-12) o tarde (15-19), con algo de ruido
  const peaks = [
    randInt(8, 12), // pico mañana
    randInt(15, 19), // pico tarde
  ];
  const hour = randItem(peaks);
  const minute = randInt(0, 59);
  const second = randInt(0, 59);
  date.setHours(hour, minute, second, 0);
  return date;
};

/**
 * Pesa los días: fines de semana tienen ~2x probabilidad de tener más ventas.
 * Retorna true si se debe generar una venta extra ese día.
 */
const isWeekend = (date) => [0, 6].includes(date.getDay());

/**
 * Genera entre `min` y `max` productos distintos de un catálogo,
 * con cantidades y precios realistas.
 */
const buildDetails = (products, minItems = 1, maxItems = 4) => {
  const count = randInt(minItems, Math.min(maxItems, products.length));
  const selected = shuffle(products).slice(0, count);

  return selected.map((p) => {
    const quantity = randInt(1, 5);
    const unitPrice = Number(p.price);
    return {
      productId: p.id,
      quantity,
      unitPrice,
      subtotal: parseFloat((unitPrice * quantity).toFixed(2)),
    };
  });
};

// ─── Seeder principal ─────────────────────────────────────────────────────────

export async function seedSales() {
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

  const [products1, products2] = await Promise.all([
    prisma.product.findMany({
      where: { storeId: store1.id, status: "Active" },
    }),
    prisma.product.findMany({
      where: { storeId: store2.id, status: "Active" },
    }),
  ]);

  if (!products1.length || !products2.length) {
    console.warn(
      "⚠️  Una o ambas tiendas no tienen productos activos. Abortando seedSales.",
    );
    return;
  }

  // ── Rango: últimos 6 meses hasta hoy ──
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  // ── Configuración por tienda ──
  const storeConfigs = [
    {
      store: store1,
      products: products1,
      // Tienda Don Carlos: volumen medio, usuario mixto
      users: [userAdmin, userGrocer],
      salesPerDay: { min: 2, max: 6 }, // entre 2 y 6 ventas por día
      weekendMultiplier: 1.6, // 60% más los fines de semana
      cancellationRate: 0.08, // 8% canceladas
    },
    {
      store: store2,
      products: products2,
      // Minimercado La Esquina: más movimiento, solo grocer
      users: [userGrocer],
      salesPerDay: { min: 3, max: 9 },
      weekendMultiplier: 2.0,
      cancellationRate: 0.06,
    },
  ];

  const allSales = [];

  for (const config of storeConfigs) {
    const cursor = new Date(sixMonthsAgo);

    while (cursor <= today) {
      const weekend = isWeekend(cursor);
      const baseCount = randInt(config.salesPerDay.min, config.salesPerDay.max);
      const dailyCount = weekend
        ? Math.round(baseCount * config.weekendMultiplier)
        : baseCount;

      for (let i = 0; i < dailyCount; i++) {
        const dayStart = new Date(cursor);
        const dayEnd = new Date(cursor);
        dayEnd.setHours(23, 59, 59);

        const date = randDate(dayStart, dayEnd);
        const isCancelled = Math.random() < config.cancellationRate;
        const details = buildDetails(config.products, 1, 4);
        const total = parseFloat(
          details.reduce((acc, d) => acc + d.subtotal, 0).toFixed(2),
        );
        const user = randItem(config.users);

        allSales.push({
          date,
          status: isCancelled ? "Cancelled" : "Completed",
          userId: user.id,
          storeId: config.store.id,
          total: isCancelled ? 0 : total,
          ...(isCancelled && {
            cancellationReason: randItem([
              "Error en cobro",
              "Producto no disponible",
              "Solicitud del cliente",
              "Fallo en caja",
              "Duplicado accidental",
            ]),
            cancellationDate: new Date(
              date.getTime() + randInt(5, 30) * 60 * 1000,
            ),
          }),
          details: { create: details },
        });
      }

      cursor.setDate(cursor.getDate() + 1);
    }
  }

  // Insertar en lotes de 50 para no saturar la conexión
  const BATCH_SIZE = 50;
  let created = 0;

  for (let i = 0; i < allSales.length; i += BATCH_SIZE) {
    const batch = allSales.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map((sale) => prisma.sale.create({ data: sale })));
    created += batch.length;
    console.log(`   ↳ ${created}/${allSales.length} ventas insertadas...`);
  }

  console.log(
    `✅ Sales seeded — ${allSales.length} ventas generadas (últimos 6 meses)`,
  );
}
