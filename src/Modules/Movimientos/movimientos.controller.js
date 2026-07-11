import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";
import { MovementStatus, MovementType } from "../../../generated/prisma/index.js";
import getDateNow from "../../helpers/getDateNow.js";
import isExistStock from "../../helpers/isExistStock.js";
import isNumberStock from "../../helpers/isNumberStock.js";
import isMyStore from "../../helpers/isMyStore.js";

export const getProductMovementReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const storeId = req.store.id; // Extraído de manera segura gracias al middleware attachStore

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Las fechas de inicio (startDate) y fin (endDate) son requeridas.",
      });
    }

    // Configurar rangos de fecha en UTC explícito, igual que en getMovements,
    // para evitar desfases por la zona horaria local del servidor.
    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Las fechas proporcionadas no son válidas.",
      });
    }

    if (start > end) {
      return res.status(400).json({
        message: "La fecha inicial no puede ser mayor que la fecha final.",
      });
    }

    // Consultar todos los movimientos de la tienda en el rango dado que NO estén cancelados
    const movements = await prisma.movement.findMany({
      where: {
        storeId: storeId,
        status: MovementStatus.Active, // Solo movimientos activos (ignora "Cancelled")
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        details: {
          include: {
            product: true,
          },
        },
      },
    });

    const productMetrics = {};

    // Procesar los movimientos acumulando entradas y salidas usando tu estructura de detalles
    movements.forEach((movement) => {
      const type = movement.type;

      movement.details.forEach((detail) => {
        const product = detail.product;
        if (!product) return;

        const productId = product.id;

        if (!productMetrics[productId]) {
          productMetrics[productId] = {
            id: productId,
            name: product.name,
            referenceCode: product.referenceCode || "",
            currentStock: product.currentStock,
            lowStockThreshold: product.lowStockThreshold,
            entradas: 0,
            salidas: 0,
            totalMovimientos: 0,
          };
        }

        const qty = detail.quantity;

        // Evaluar tipos basándonos en tu MovementType Enum (Entry, Exit, AdjustEntry, AdjustExit)
        if (type === "Entry" || type === "AdjustEntry") {
          productMetrics[productId].entradas += qty;
        } else if (type === "Exit" || type === "AdjustExit") {
          productMetrics[productId].salidas += qty;
        }

        productMetrics[productId].totalMovimientos += qty;
      });
    });

    const reportList = Object.values(productMetrics).map((product) => {
      const requiereReabastecimiento = product.currentStock <= product.lowStockThreshold;

      let nivelRotacion = "Baja";

      if (product.salidas >= 100) nivelRotacion = "Alta";
      else if (product.salidas >= 30) nivelRotacion = "Media";

      const sugerenciaCompra = requiereReabastecimiento ? Math.max(product.salidas - product.currentStock, 0) : 0;

      return {
        ...product,
        nivelRotacion,
        requiereReabastecimiento,
        sugerenciaCompra,
      };
    });

    const totalSalidas = reportList.reduce((acc, product) => acc + product.salidas, 0);

    const reporteCompleto = reportList.map((product) => ({
      ...product,
      porcentajeRotacion: totalSalidas === 0 ? 0 : Number(((product.salidas / totalSalidas) * 100).toFixed(2)),
    }));

    // Ordenar Top 5 para analizar la rotación del negocio basándonos en salidas
    const mayorRotacion = [...reportList]
      .filter((p) => p.salidas > 0)
      .sort((a, b) => b.salidas - a.salidas)
      .slice(0, 5);

    const menorRotacion = [...reportList].sort((a, b) => a.salidas - b.salidas).slice(0, 5);

    return res.status(200).json({
      periodo: {
        startDate: start,
        endDate: end,
      },
      resumenGeneral: {
        totalProductosConMovimiento: reportList.length,
        totalUnidadesEntrantes: reportList.reduce((acc, p) => acc + p.entradas, 0),
        totalUnidadesSalientes: reportList.reduce((acc, p) => acc + p.salidas, 0),
      },
      productosMayorRotacion: mayorRotacion,
      productosMenorRotacion: menorRotacion,
      reporteCompletoPorProducto: reporteCompleto,
    });
  } catch (error) {
    console.error("Error al generar el reporte de movimientos:", error);
    return res.status(500).json({ message: "Error interno en el servidor al compilar el reporte." });
  }
};

export const getMovements = async (req, res, next) => {
  try {
    const { startDate, endDate, type, productId } = req.query;
    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T23:59:59.999Z`);

      if (start > end) {
        const error = new Error("La fecha inicial no puede ser mayor que la fecha final.");
        error.statusCode = 400;
        throw error;
      }
    }
    const all = req.query.all === "true";

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const where = {
      storeId: req.store.id,
    };

    if (type && Object.values(MovementType).includes(type)) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(`${startDate}T00:00:00.000Z`);
      if (endDate) where.date.lte = new Date(`${endDate}T23:59:59.999Z`);
    }

    if (productId) {
      where.details = {
        some: { productId: parseInt(productId) },
      };
    }

    const findManyArgs = {
      select: {
        id: true,
        date: true,
        status: true,
        type: true,
        reason: true,
        userId: true,
        storeId: true,
        supplierId: true,
        details: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            unitCost: true,
            product: { select: { name: true } },
          },
        },
        cancellationDate: true,
        supplier: true,
      },
      where,
      orderBy: { id: "desc" },
    };

    // Cuando all=true se omite paginacion, pensado para exportar a Excel
    if (!all) {
      findManyArgs.skip = skip;
      findManyArgs.take = limit;
    }

    const [total, movements] = await Promise.all([prisma.movement.count({ where }), prisma.movement.findMany(findManyArgs)]);

    res.json({
      data: movements,
      meta: all
        ? { total, page: 1, totalPages: 1 }
        : {
            total,
            page,
            totalPages: Math.ceil(total / limit),
          },
    });
  } catch (error) {
    next(error);
  }
};

export const getMovementById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const movement = await prisma.movement.findUnique({
      where: { id },
      select: {
        id: true,
        date: true,
        status: true,
        type: true,
        userId: true,
        storeId: true,
        supplierId: true,
        details: true,
        cancellationDate: true,
      },
    });

    // Primero verificamos que exista, antes de leer sus propiedades
    if (!movement) {
      res.status(404);
      throw new Error("Movimiento no encontrado");
    }

    // Evitar que se pueda acceder a otra informacion de otra tienda
    isMyStore(req, movement);

    res.json({ data: movement });
  } catch (error) {
    next(error);
  }
};

export const createMovements = async (req, res, next) => {
  try {
    const { type, reason, products = [] } = req.body;
    const supplierId = parseInt(req.body.supplierId);

    // Validar que el type recibido sea uno de los permitidos
    if (!Object.values(MovementType).includes(type)) {
      const error = new Error("El tipo de movimiento no es válido");
      error.statusCode = 400;
      throw error;
    }

    const isExitType = [MovementType.Exit, MovementType.AdjustExit].includes(type);
    const isAdjustType = [MovementType.AdjustEntry, MovementType.AdjustExit].includes(type);

    if (isAdjustType && (!reason || !reason.trim())) {
      const error = new Error("El motivo es obligatorio para los ajustes de inventario");
      error.statusCode = 400;
      throw error;
    }

    // Validaciones ANTES de tocar la BD (fail fast)
    isNumberStock(products);
    // Siempre se valida que los productos existan y sean de la tienda del usuario.
    // Solo se valida stock suficiente cuando el movimiento resta stock.
    await isExistStock(products, req.store.id, isExitType);

    // Transaccion: si cualquier consulta falla, se revierte todo el bloque
    const movement = await prisma.$transaction(async (tx) => {
      const movementObj = {
        date: getDateNow(),
        type,
        userId: req.user.id,
        storeId: req.store.id,
        status: MovementStatus.Active,
      };
      if (reason) movementObj.reason = reason;
      if (supplierId) movementObj.supplierId = supplierId;

      const createdMovement = await tx.movement.create({ data: movementObj });

      await Promise.all(
        products.map((product) => {
          const { productId, quantity, unitCost } = product;
          const hasCost = unitCost !== undefined && unitCost !== null && unitCost !== "";
          return tx.movementDetail.create({
            data: {
              movementId: createdMovement.id,
              productId,
              quantity,
              unitCost: hasCost ? unitCost : null,
            },
          });
        }),
      );

      // Ajustar el stock: Entry/AdjustEntry suma, Exit/AdjustExit resta
      for (const product of products) {
        if (isExitType) {
          // Update atomico con verificacion de stock suficiente,
          // evita condiciones de carrera entre salidas concurrentes
          const result = await tx.product.updateMany({
            where: {
              id: product.productId,
              currentStock: { gte: product.quantity },
            },
            data: {
              currentStock: { decrement: product.quantity },
            },
          });

          if (result.count === 0) {
            const error = new Error(`Stock insuficiente para el producto con id ${product.productId}`);
            error.statusCode = 400;
            throw error;
          }
        } else {
          await tx.product.update({
            where: { id: product.productId },
            data: {
              currentStock: { increment: product.quantity },
            },
          });
        }
      }

      return createdMovement;
    });

    res.status(201).json({
      data: movement,
      message: "Movimiento registrado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const cancelMovement = async (req, res, next) => {
  try {
    const movementId = parseInt(req.params.id);
    verifyNumberID(movementId);

    await prisma.$transaction(async (tx) => {
      const movement = await tx.movement.findUnique({
        where: { id: movementId },
        include: { details: true },
      });

      if (!movement) {
        const error = new Error("Movimiento no encontrado");
        error.statusCode = 404;
        throw error;
      }
      if (movement.status === MovementStatus.Cancelled) {
        const error = new Error("El movimiento ya está cancelado");
        error.statusCode = 400;
        throw error;
      }

      // Revertir el efecto en stock (inverso al que se aplico al crear)
      const isExit = [MovementType.Exit, MovementType.AdjustExit].includes(movement.type);

      for (const detail of movement.details) {
        if (isExit) {
          // Se devuelve el stock que se habia restado
          await tx.product.update({
            where: { id: detail.productId },
            data: {
              currentStock: { increment: detail.quantity },
            },
          });
        } else {
          // Se quita el stock que se habia sumado, validando que no quede negativo
          const result = await tx.product.updateMany({
            where: {
              id: detail.productId,
              currentStock: { gte: detail.quantity },
            },
            data: {
              currentStock: { decrement: detail.quantity },
            },
          });

          if (result.count === 0) {
            const error = new Error(
              `No se puede cancelar: el producto con id ${detail.productId} ya no tiene suficiente stock para revertir el movimiento`,
            );
            error.statusCode = 400;
            throw error;
          }
        }
      }

      await tx.movement.update({
        where: { id: movementId },
        data: {
          status: MovementStatus.Cancelled,
          cancellationDate: getDateNow(),
        },
      });
    });

    res.status(200).json({ message: "Movimiento cancelado correctamente" });
  } catch (error) {
    next(error);
  }
};
