import { StoreCategoryStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";

export const getStoreCategories = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const [total, storeCategories] = await Promise.all([
      prisma.storeCategory.count(),
      prisma.storeCategory.findMany({
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
      data: storeCategories,
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

export const getStoreCategoryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const storeCategory = await prisma.storeCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (storeCategory) {
      res.json({ data: storeCategory });
    } else {
      res.status(404);
      throw new Error("Categoría de tienda no encontrada");
    }
  } catch (error) {
    next(error);
  }
};

export const createStoreCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    verifyFields({ name });

    const createdCategory = await prisma.storeCategory.create({
      data: {
        name,
        status: StoreCategoryStatus.Active,
      },
    });

    res.status(201).json({
      data: createdCategory,
      message: "Categoría de tienda creada correctamente",
    });
  } catch (error) {
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.message = "Ese nombre ya está registrado en el sistema";
    }
    next(error);
  }
};

export const updateStoreCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const id = parseInt(req.params.id);

    verifyNumberID(id);
    verifyFields({ name });

    const storeCategory = await prisma.storeCategory.findUnique({
      where: { id },
    });
    if (!storeCategory) {
      const error = new Error("Categoría de tienda no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const updatedCategory = await prisma.storeCategory.update({
      data: { name },
      where: { id },
    });

    res.status(200).json({
      data: updatedCategory,
      message: "Categoría de tienda editada exitosamente",
    });
  } catch (error) {
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.message = "Ese nombre ya está registrado en el sistema";
    }
    next(error);
  }
};

export const deleteStoreCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const storeCategory = await prisma.storeCategory.findUnique({
      where: { id },
    });
    if (!storeCategory) {
      const error = new Error("Categoría de tienda no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const isAssociated = await prisma.store.findFirst({
      where: { storeCategoryId: id },
    });
    if (isAssociated) {
      const error = new Error("Esa categoría está asociada a una tienda");
      error.statusCode = 400;
      throw error;
    }

    const deletedStoreCategory = await prisma.storeCategory.update({
      where: { id },
      data: { status: StoreCategoryStatus.Inactive },
    });

    res.json({
      data: deletedStoreCategory,
      message: "Categoría de tienda eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const restoreStoreCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const storeCategory = await prisma.storeCategory.findUnique({
      where: { id },
    });
    if (!storeCategory) {
      const error = new Error("Categoría de tienda no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const restoredStoreCategory = await prisma.storeCategory.update({
      where: { id },
      data: { status: StoreCategoryStatus.Active },
    });

    res.json({
      data: restoredStoreCategory,
      message: "Categoría de tienda restablecida correctamente",
    });
  } catch (error) {
    next(error);
  }
};
