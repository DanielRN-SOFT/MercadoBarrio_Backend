import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";
import {
  MovementStatus,
  MovementType,
} from "../../../generated/prisma/index.js";
import getDateNow from "../../helpers/getDateNow.js";
import isExistStock from "../../helpers/isExistStock.js";
import isNumberStock from "../../helpers/isNumberStock.js";
import isMyStore from "../../helpers/isMyStore.js";

export const getMovements = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const [total, movements] = await Promise.all([
      prisma.movement.count({
        where: {
          storeId: req.store.id,
        },
      }),
      prisma.movement.findMany({
        skip,
        take: limit,
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
        where: {
          storeId: req.store.id,
        },
        orderBy: { id: "desc" },
      }),
    ]);

    res.json({
      data: movements,
      meta: {
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

    const isExitType = [MovementType.Exit, MovementType.AdjustExit].includes(
      type,
    );
    const isAdjustType = [
      MovementType.AdjustEntry,
      MovementType.AdjustExit,
    ].includes(type);

    if (isAdjustType && (!reason || !reason.trim())) {
      const error = new Error(
        "El motivo es obligatorio para los ajustes de inventario",
      );
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
          const hasCost =
            unitCost !== undefined && unitCost !== null && unitCost !== "";
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
            const error = new Error(
              `Stock insuficiente para el producto con id ${product.productId}`,
            );
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
      const isExit = [MovementType.Exit, MovementType.AdjustExit].includes(
        movement.type,
      );

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
