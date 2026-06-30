import prisma from "../../../prismaClient.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getLast30Days = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(new Date(d));
  }
  return days;
};

const formatDate = (date) => date.toISOString().slice(0, 10);

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export const getAdminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const [
      totalUsers,
      activeUsers,
      totalStores,
      storesByStatus,
      totalProducts,
      totalSuppliers,
      totalMovements,
      movementsThisMonth,
      totalSales,
      salesToday,
      salesThisMonth,
      revenueThisMonth,
      revenueToday,
      recentSales,
      recentMovements,
      lowStockProducts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "Active" } }),
      prisma.store.count(),
      prisma.store.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.product.count({ where: { status: "Active" } }),
      prisma.supplier.count({ where: { status: "Active" } }),
      prisma.movement.count(),
      prisma.movement.count({ where: { date: { gte: startOfMonth } } }),
      prisma.sale.count({ where: { status: "Completed" } }),
      prisma.sale.count({
        where: { status: "Completed", date: { gte: startOfToday } },
      }),
      prisma.sale.count({
        where: { status: "Completed", date: { gte: startOfMonth } },
      }),
      prisma.sale.aggregate({
        _sum: { total: true },
        where: { status: "Completed", date: { gte: startOfMonth } },
      }),
      prisma.sale.aggregate({
        _sum: { total: true },
        where: { status: "Completed", date: { gte: startOfToday } },
      }),
      prisma.sale.findMany({
        take: 5,
        orderBy: { date: "desc" },
        where: { status: "Completed" },
        include: {
          store: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
        },
      }),
      prisma.movement.findMany({
        take: 5,
        orderBy: { date: "desc" },
        include: {
          store: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
        },
      }),
      prisma.product
        .findMany({
          where: { status: "Active" },
          select: { currentStock: true, lowStockThreshold: true },
        })
        .then(
          (products) =>
            products.filter((p) => p.currentStock <= p.lowStockThreshold)
              .length,
        ),
    ]);

    const storesStatusMap = storesByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
        },
        stores: {
          total: totalStores,
          active: storesStatusMap["Activo"] ?? 0,
          inactive: storesStatusMap["Inactivo"] ?? 0,
          pending: storesStatusMap["Pendiente"] ?? 0,
          incomplete: storesStatusMap["Incompleto"] ?? 0,
          rejected: storesStatusMap["Rechazado"] ?? 0,
        },
        products: { total: totalProducts, lowStock: lowStockProducts },
        suppliers: { active: totalSuppliers },
        movements: { total: totalMovements, thisMonth: movementsThisMonth },
        sales: {
          total: totalSales,
          today: salesToday,
          thisMonth: salesThisMonth,
          revenueToday: Number(revenueToday._sum.total ?? 0),
          revenueThisMonth: Number(revenueThisMonth._sum.total ?? 0),
        },
        recentActivity: { sales: recentSales, movements: recentMovements },
      },
    });
  } catch (error) {
    console.error("[getAdminDashboard]", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};

// ─── Admin Charts ─────────────────────────────────────────────────────────────
export const getAdminCharts = async (req, res) => {
  try {
    const now = new Date();
    const days = getLast30Days();
    const since = days[0];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      salesLast30Raw,
      storesByStatus,
      movementsByType,
      topStoresByRevenue,
      usersByRole,
    ] = await Promise.all([
      prisma.sale.findMany({
        where: { status: "Completed", date: { gte: since } },
        select: { date: true, total: true },
      }),

      prisma.store.groupBy({ by: ["status"], _count: { id: true } }),

      prisma.movement.groupBy({
        by: ["type"],
        _count: { id: true },
        where: { date: { gte: startOfMonth } },
      }),

      prisma.sale
        .groupBy({
          by: ["storeId"],
          _sum: { total: true },
          where: { status: "Completed", date: { gte: startOfMonth } },
          orderBy: { _sum: { total: "desc" } },
          take: 5,
        })
        .then(async (grouped) => {
          const ids = grouped.map((g) => g.storeId);
          const stores = await prisma.store.findMany({
            where: { id: { in: ids } },
            select: { id: true, name: true },
          });
          const storeMap = Object.fromEntries(
            stores.map((s) => [s.id, s.name]),
          );
          return grouped.map((g) => ({
            storeId: g.storeId,
            name: storeMap[g.storeId] ?? "Desconocida",
            revenue: Number(g._sum.total ?? 0),
          }));
        }),

      prisma.user
        .groupBy({
          by: ["roleId"],
          _count: { id: true },
          where: { status: "Active" },
        })
        .then(async (grouped) => {
          const ids = grouped.map((g) => g.roleId);
          const roles = await prisma.role.findMany({
            where: { id: { in: ids } },
            select: { id: true, name: true },
          });
          const roleMap = Object.fromEntries(roles.map((r) => [r.id, r.name]));
          return grouped.map((g) => ({
            name: roleMap[g.roleId] ?? "Sin rol",
            value: g._count.id,
          }));
        }),
    ]);

    const salesCountMap = {};
    const salesRevenueMap = {};
    for (const sale of salesLast30Raw) {
      const key = formatDate(new Date(sale.date));
      salesCountMap[key] = (salesCountMap[key] ?? 0) + 1;
      salesRevenueMap[key] = (salesRevenueMap[key] ?? 0) + Number(sale.total);
    }
    const dailySales = days.map((d) => ({
      date: formatDate(d),
      count: salesCountMap[formatDate(d)] ?? 0,
      revenue: salesRevenueMap[formatDate(d)] ?? 0,
    }));

    return res.status(200).json({
      success: true,
      data: {
        dailySales,
        storesByStatus: storesByStatus.map((s) => ({
          name: s.status,
          value: s._count.id,
        })),
        movementsByType: movementsByType.map((m) => ({
          name: m.type,
          count: m._count.id,
        })),
        topStoresByRevenue,
        usersByRole,
      },
    });
  } catch (error) {
    console.error("[getAdminCharts]", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};

// ─── Tendero Dashboard ────────────────────────────────────────────────────────
export const getStoreDashboard = async (req, res) => {
  try {
    const storeId = req.store.id;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, name: true, status: true },
    });
    if (!store)
      return res
        .status(404)
        .json({ success: false, message: "Tienda no encontrada." });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    );

    const [
      totalProducts,
      lowStockProductsList,
      salesToday,
      salesThisMonth,
      salesLastMonth,
      revenueToday,
      revenueThisMonth,
      revenueLastMonth,
      recentSales,
      entriesThisMonth,
      exitsThisMonth,
      recentMovements,
      topProducts,
    ] = await Promise.all([
      prisma.product.count({ where: { storeId, status: "Active" } }),

      prisma.product
        .findMany({
          where: { storeId, status: "Active" },
          select: {
            id: true,
            name: true,
            currentStock: true,
            lowStockThreshold: true,
          },
        })
        .then((products) =>
          products.filter((p) => p.currentStock <= p.lowStockThreshold),
        ),

      prisma.sale.count({
        where: { storeId, status: "Completed", date: { gte: startOfToday } },
      }),
      prisma.sale.count({
        where: { storeId, status: "Completed", date: { gte: startOfMonth } },
      }),
      prisma.sale.count({
        where: {
          storeId,
          status: "Completed",
          date: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),

      prisma.sale.aggregate({
        _sum: { total: true },
        where: { storeId, status: "Completed", date: { gte: startOfToday } },
      }),
      prisma.sale.aggregate({
        _sum: { total: true },
        where: { storeId, status: "Completed", date: { gte: startOfMonth } },
      }),
      prisma.sale.aggregate({
        _sum: { total: true },
        where: {
          storeId,
          status: "Completed",
          date: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),

      prisma.sale.findMany({
        take: 5,
        orderBy: { date: "desc" },
        where: { storeId, status: "Completed" },
        include: {
          user: { select: { id: true, name: true } },
          details: {
            include: { product: { select: { id: true, name: true } } },
          },
        },
      }),

      prisma.movement.count({
        where: {
          storeId,
          status: "Active",
          type: "Entry",
          date: { gte: startOfMonth },
        },
      }),
      prisma.movement.count({
        where: {
          storeId,
          status: "Active",
          type: "Exit",
          date: { gte: startOfMonth },
        },
      }),

      prisma.movement.findMany({
        take: 5,
        orderBy: { date: "desc" },
        where: { storeId },
        include: {
          user: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
          details: {
            include: { product: { select: { id: true, name: true } } },
          },
        },
      }),

      prisma.saleDetail
        .groupBy({
          by: ["productId"],
          _sum: { quantity: true, subtotal: true },
          where: {
            sale: { storeId, status: "Completed", date: { gte: startOfMonth } },
          },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        })
        .then(async (grouped) => {
          const ids = grouped.map((g) => g.productId);
          const products = await prisma.product.findMany({
            where: { id: { in: ids } },
            select: { id: true, name: true },
          });
          const productMap = Object.fromEntries(
            products.map((p) => [p.id, p.name]),
          );
          return grouped.map((g) => ({
            productId: g.productId,
            productName: productMap[g.productId] ?? "Desconocido",
            quantitySold: Number(g._sum.quantity ?? 0),
            revenue: Number(g._sum.subtotal ?? 0),
          }));
        }),
    ]);

    const revenueThisMonthVal = Number(revenueThisMonth._sum.total ?? 0);
    const revenueLastMonthVal = Number(revenueLastMonth._sum.total ?? 0);
    const revenueVariation =
      revenueLastMonthVal > 0
        ? (
            ((revenueThisMonthVal - revenueLastMonthVal) /
              revenueLastMonthVal) *
            100
          ).toFixed(2)
        : null;

    return res.status(200).json({
      success: true,
      data: {
        store: { id: store.id, name: store.name, status: store.status },
        products: {
          total: totalProducts,
          lowStock: lowStockProductsList.length,
          lowStockList: lowStockProductsList,
        },
        sales: {
          today: salesToday,
          thisMonth: salesThisMonth,
          lastMonth: salesLastMonth,
          revenueToday: Number(revenueToday._sum.total ?? 0),
          revenueThisMonth: revenueThisMonthVal,
          revenueLastMonth: revenueLastMonthVal,
          revenueVariationPercent: revenueVariation,
        },
        movements: { entriesThisMonth, exitsThisMonth },
        topProducts,
        recentActivity: { sales: recentSales, movements: recentMovements },
      },
    });
  } catch (error) {
    console.error("[getStoreDashboard]", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};

// ─── Tendero Charts ───────────────────────────────────────────────────────────
export const getStoreCharts = async (req, res) => {
  try {
    const storeId = req.store.id;

    const now = new Date();
    const days = getLast30Days();
    const since = days[0];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      salesLast30Raw,
      movementsByType,
      topProductsMonth,
      salesThisMonthRaw,
    ] = await Promise.all([
      prisma.sale.findMany({
        where: { storeId, status: "Completed", date: { gte: since } },
        select: { date: true, total: true },
      }),

      prisma.movement.groupBy({
        by: ["type"],
        _count: { id: true },
        where: { storeId, status: "Active", date: { gte: startOfMonth } },
      }),

      prisma.saleDetail
        .groupBy({
          by: ["productId"],
          _sum: { quantity: true, subtotal: true },
          where: {
            sale: { storeId, status: "Completed", date: { gte: startOfMonth } },
          },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        })
        .then(async (grouped) => {
          const ids = grouped.map((g) => g.productId);
          const products = await prisma.product.findMany({
            where: { id: { in: ids } },
            select: { id: true, name: true },
          });
          const productMap = Object.fromEntries(
            products.map((p) => [p.id, p.name]),
          );
          return grouped.map((g) => ({
            name: productMap[g.productId] ?? "Desconocido",
            quantitySold: Number(g._sum.quantity ?? 0),
            revenue: Number(g._sum.subtotal ?? 0),
          }));
        }),

      prisma.sale.findMany({
        where: { storeId, status: "Completed", date: { gte: startOfMonth } },
        select: { date: true, total: true },
      }),
    ]);

    const salesCountMap = {};
    const salesRevenueMap = {};
    for (const sale of salesLast30Raw) {
      const key = formatDate(new Date(sale.date));
      salesCountMap[key] = (salesCountMap[key] ?? 0) + 1;
      salesRevenueMap[key] = (salesRevenueMap[key] ?? 0) + Number(sale.total);
    }
    const dailySales = days.map((d) => ({
      date: formatDate(d),
      count: salesCountMap[formatDate(d)] ?? 0,
      revenue: salesRevenueMap[formatDate(d)] ?? 0,
    }));

    const weekDayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const weekDayMap = Array(7)
      .fill(null)
      .map((_, i) => ({ name: weekDayLabels[i], count: 0, revenue: 0 }));
    for (const sale of salesThisMonthRaw) {
      const day = new Date(sale.date).getDay();
      weekDayMap[day].count += 1;
      weekDayMap[day].revenue += Number(sale.total);
    }

    return res.status(200).json({
      success: true,
      data: {
        dailySales,
        movementsByType: movementsByType.map((m) => ({
          name: m.type,
          value: m._count.id,
        })),
        topProducts: topProductsMonth,
        salesByWeekDay: weekDayMap,
      },
    });
  } catch (error) {
    console.error("[getStoreCharts]", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};
