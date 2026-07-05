import {
  ProductCategoryStatus,
  ProductStatus,
  StoreStatus,
} from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";

export const getProductCategories = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const [total, productCategories] = await Promise.all([
      prisma.productCategory.count(),
      prisma.productCategory.findMany({
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
      data: productCategories,
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

// Para el buscador público — solo categorías con al menos un producto
// activo y con stock disponible, sin importar la tienda.
export const getProductCategoriesWithProducts = async (req, res, next) => {
  try {
    const productCategories = await prisma.productCategory.findMany({
      where: {
        status: ProductCategoryStatus.Active,
        products: {
          some: {
            status: ProductStatus.Active,
            currentStock: { gt: 0 },
            store: { status: StoreStatus.Active },
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    res.json({ data: productCategories });
  } catch (error) {
    next(error);
  }
};

// Para el panel del tendero — solo las categorías que ya usa en su
// propio catálogo (sin importar si el producto está activo o inactivo,
// porque el estado se filtra aparte).
export const getProductCategoriesByStore = async (req, res, next) => {
  try {
    const productCategories = await prisma.productCategory.findMany({
      where: {
        products: {
          some: { storeId: req.store.id },
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    res.json({ data: productCategories });
  } catch (error) {
    next(error);
  }
};

export const getProductCategoryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const productCategory = await prisma.productCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (productCategory) {
      res.json({ data: productCategory });
    } else {
      res.status(404);
      throw new Error("Categoria de producto no encontrada");
    }
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    verifyFields({ name });

    const createdCategory = await prisma.productCategory.create({
      data: {
        name,
        status: ProductCategoryStatus.Active,
      },
    });

    res.status(201).json({
      data: createdCategory,
      message: "Categoria de producto creada correctamente",
    });
  } catch (error) {
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.message = "Ese nombre ya está registrado en el sistema";
    }
    next(error);
  }
};

export const updateProductCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const id = parseInt(req.params.id);

    verifyNumberID(id);
    verifyFields({ name });

    const productCategory = await prisma.productCategory.findUnique({
      where: { id },
    });
    if (!productCategory) {
      const error = new Error("Categoria de producto no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const updatedCategory = await prisma.productCategory.update({
      data: { name },
      where: { id },
    });

    res.status(200).json({
      data: updatedCategory,
      message: "Categoria de producto editada correctamente",
    });
  } catch (error) {
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.message = "Ese nombre ya está registrado en el sistema";
    }
    next(error);
  }
};

export const deleteProductCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const productCategory = await prisma.productCategory.findUnique({
      where: { id, status: ProductStatus.Active },
    });
    if (!productCategory) {
      const error = new Error("Categoria de producto no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const isAssociated = await prisma.product.findFirst({
      where: { productCategoryId: id },
    });
    if (isAssociated) {
      const error = new Error("Esa categoria está asociada a un producto");
      error.statusCode = 400;
      throw error;
    }

    const deletedProductCategory = await prisma.productCategory.update({
      where: { id },
      data: { status: ProductCategoryStatus.Inactive },
    });

    res.json({
      data: deletedProductCategory,
      message: "Categoria de producto eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const restoreProductCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const productCategory = await prisma.productCategory.findUnique({
      where: { id },
    });
    if (!productCategory) {
      const error = new Error("Categoria de producto no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const restoredProductCategory = await prisma.productCategory.update({
      where: { id },
      data: { status: ProductCategoryStatus.Active },
    });

    res.json({
      data: restoredProductCategory,
      message: "Categoria de producto restablecida correctamente",
    });
  } catch (error) {
    next(error);
  }
};
