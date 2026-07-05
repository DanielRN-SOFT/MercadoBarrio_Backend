import {
  ProductStatus,
  UnitOfMeasureStatus,
} from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";

export const getUnitsOfMeasure = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const [total, unitsOfMeasure] = await Promise.all([
      prisma.unitOfMeasure.count(),
      prisma.unitOfMeasure.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          status: true,
        },
      }),
    ]);

    res.json({
      data: unitsOfMeasure,
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

export const getUnitOfMeasureById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (unitOfMeasure) {
      res.json({ data: unitOfMeasure });
    } else {
      res.status(404);
      throw new Error("Unidad de medida no encontrada");
    }
  } catch (error) {
    next(error);
  }
};

export const createUnitOfMeasure = async (req, res, next) => {
  try {
    const { name } = req.body;
    verifyFields({ name });

    const unitOfMeasure = await prisma.unitOfMeasure.create({
      data: {
        name,
        status: UnitOfMeasureStatus.Active,
      },
    });

    res.status(201).json({
      data: unitOfMeasure,
      message: "Unidad de medida creada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUnitOfMeasure = async (req, res, next) => {
  try {
    const { name } = req.body;
    const id = parseInt(req.params.id);

    verifyNumberID(id);
    verifyFields({ name });

    const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
      where: { id },
    });
    if (!unitOfMeasure) {
      const error = new Error("Unidad de medida no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const updatedUnitOfMeasure = await prisma.unitOfMeasure.update({
      data: { name },
      where: { id },
    });

    res.status(200).json({
      data: updatedUnitOfMeasure,
      message: "Unidad de medida editada exitosamente",
    });
  } catch (error) {
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.message = "Ese nombre ya está registrado en el sistema";
    }
    next(error);
  }
};

export const deleteUnitOfMeasure = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
      where: { id },
    });
    if (!unitOfMeasure) {
      const error = new Error("Unidad de medida no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const isAssociated = await prisma.product.findFirst({
      where: { unitOfMeasureId: id, status: ProductStatus.Active },
    });
    if (isAssociated) {
      const error = new Error(
        "Esa unidad de medida está asociada a un producto",
      );
      error.statusCode = 400;
      throw error;
    }

    const deletedUnitOfMeasure = await prisma.unitOfMeasure.update({
      where: { id },
      data: { status: UnitOfMeasureStatus.Inactive },
    });

    res.json({
      data: deletedUnitOfMeasure,
      message: "Unidad de medida eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const restoreUnitOfMeasure = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
      where: { id },
    });
    if (!unitOfMeasure) {
      const error = new Error("Unidad de medida no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const restoredUnitOfMeasure = await prisma.unitOfMeasure.update({
      where: { id },
      data: { status: UnitOfMeasureStatus.Active },
    });

    res.json({
      data: restoredUnitOfMeasure,
      message: "Unidad de medida restablecida correctamente",
    });
  } catch (error) {
    next(error);
  }
};
