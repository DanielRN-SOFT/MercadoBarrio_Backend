import { UnitOfMeasureStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";

export const getUnitsOfMeasure = async (req, res) => {
  try {
    // Obtenemos la pagina desde el query param, por defecto pagina 1
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;

    // Si estamos en página 1: skip=0, página 2: skip=10, página 3: skip=20...
    const skip = (page - 1) * limit;

    // Total de registros (para saber cuántas páginas hay en total)
    const total = await prisma.unitOfMeasure.count();

    const unitOfMeasure = await prisma.unitOfMeasure.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    res.json({
      data: unitOfMeasure,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error("Ocurrio un error en el servidor");
  }
};

export const getUnitOfMeasureById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const unitMeasure = await prisma.unitOfMeasure.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (unitMeasure) {
      res.json({ unitMeasure });
    } else {
      res.status(500);
      throw new Error("Unidad de medida no encontrada");
    }
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
};

export const createUnitOfMeasure = async (req, res) => {
  try {
    const { name } = req.body;
    const unitOfMeasure = await prisma.unitOfMeasure.create({
      data: {
        name,
        status: UnitOfMeasureStatus.Active,
      },
    });
    res.json(unitOfMeasure);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export const updateUnitOfMeasure = async (req, res) => {
  try {
    const { name } = req.body;
    const id = parseInt(req.params.id);

    const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
      where: { id },
    });

    if (!unitOfMeasure) {
      res.status(404);
      throw new Error("Unidad de medida no encontrada");
    }

    const unitOfMeasure = await prisma.unitOfMeasure.update({
      data: { name },
      where: { id },
    });

    res.status(200).json(unitOfMeasure);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export const deleteUnitOfMeasure = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
      where: { id },
    });

    if (unitOfMeasure) {
      const isExistUnitOfMeasure = await prisma.product.findFirst({
        where: { unitOfMeasureId: id },
      });

      if (isExistUnitOfMeasure) {
        res.status(400);
        throw new Error("Esa unidad de medida esta asociada a una tienda");
      }

      const deletedUnitOfMeasure = await prisma.storeCategory.update({
        where: { id },
        data: {
          status: UnitOfMeasureStatus.Inactive,
        },
      });

      res.status(200).json({ deletedUnitOfMeasure });
    } else {
      res.status(404);
      throw new Error("Unidad de medida no encontrada");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export const restoreUnifOfMeasure = async (req, res) => {
  const id = parseInt(req.params.id);
  const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
    where: { id },
  });

  if (unitOfMeasure) {
    const restoredUnitOfMeasure = await prisma.unitOfMeasure.update({
      where: { id },
      data: {
        status: UnitOfMeasureStatus.Active,
      },
    });

    res.status(200).json({ restoredUnitOfMeasure });
  } else {
    res.status(404);
    throw new Error("Unidad de medida no encontrada");
  }
};
