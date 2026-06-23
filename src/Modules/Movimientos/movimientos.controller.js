import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";
import verifyDate from "../../helpers/verifyDate.js";
import {
  MovementStatus,
  MovementType,
} from "../../../generated/prisma/index.js";
import getDateNow from "../../helpers/getDateNow.js";
import isExistStock from "../../helpers/isExistStock.js";
import isNumberStock from "../../helpers/isNumberStock.js";

export const getMovements = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const [total, movements] = await Promise.all([
      prisma.movement.count(),
      prisma.movement.findMany({
        skip,
        take: limit,
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

    if (movement) {
      res.json({ data: movement });
    } else {
      res.status(404);
      throw new Error("Movimiento no encontrado");
    }
  } catch (error) {
    next(error);
  }
};

export const createMovements = async (req, res, next) => {
  try {
    const {
      type,
      details,
      supplierId,
      products = [],
      quantity,
      unitCost,
    } = req.body;

    const storeId = parseInt(req.body.storeId);
    const supplierId = parseInt(req.body.supplierId);

    const movementObj = {
      date: getDateNow(),
      type: MovementStatus.Active,
      userId: req.user.id,
      store: req.store.id,
      status: MovementStatus.Active,
    };

    // Campos opcionales
    if (details) {
      movementObj.details = details;
    }

    if (supplierId) {
      movementObj.supplierId = supplierId;
    }

    const movement = await prisma.movement.create({
      data: movementObj,
    });

    // Verificar que la cantidad en productos no sea negativa
    isNumberStock(products);

    // Si el movimiento es de salida, verificamos el stock
    if (type == MovementType.Exit) {
      isExistStock(products);
    }

    await Promise(
      products.map((product) => {
        const { productId, quantity, unitCost } = product;
        prisma.movementDetail.create({
          data: {
            movementId: movement.id,
            productId,
            quantity,
            unitCost,
          },
        });
      }),
    );

    res.status(201).json({
      data: movement,
      message: "Movimiento registrado correctamente",
    });
  } catch (error) {
    next(error);
  }
};
