import { ProductStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";

export const getProducts = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
      prisma.product.count({
        where: { storeId: req.store.id },
      }),
      prisma.product.findMany({
        skip,
        take: limit,
        where: { storeId: req.store.id },
        select: {
          id: true,
          name: true,
          price: true,
          currentStock: true,
          lowStockThreshold: true,
          status: true,
          productCategoryId: true,
          unitOfMeasureId: true,
        },
      }),
    ]);

    res.json({
      data: products,
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

export const getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const product = await prisma.product.findFirst({
      where: { id, storeId: req.store.id },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        referenceCode: true,
        lowStockThreshold: true,
        photo: true,
        currentStock: true,
        status: true,
        productCategoryId: true,
        unitOfMeasureId: true,
      },
    });

    if (product) {
      res.json({ data: product });
    } else {
      res.status(404);
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, referenceCode, lowStockThreshold, photo, currentStock, productCategoryId, unitOfMeasureId } =
      req.body;
    verifyFields({ name });

    if (price === undefined || isNaN(price) || price < 0) {
      const error = new Error("El precio debe ser un número válido");
      error.statusCode = 400;
      throw error;
    }

    if (currentStock === undefined || isNaN(currentStock) || currentStock < 0) {
      const error = new Error("El stock actual debe ser un número válido");
      error.statusCode = 400;
      throw error;
    }

    if (!productCategoryId || isNaN(productCategoryId)) {
      const error = new Error("La categoría de producto es obligatoria");
      error.statusCode = 400;
      throw error;
    }

    if (!unitOfMeasureId || isNaN(unitOfMeasureId)) {
      const error = new Error("La unidad de medida es obligatoria");
      error.statusCode = 400;
      throw error;
    }

    const productCategory = await prisma.productCategory.findUnique({
      where: { id: productCategoryId },
    });
    if (!productCategory) {
      const error = new Error("La categoría de producto no existe");
      error.statusCode = 404;
      throw error;
    }

    const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
      where: { id: unitOfMeasureId },
    });
    if (!unitOfMeasure) {
      const error = new Error("La unidad de medida no existe");
      error.statusCode = 404;
      throw error;
    }

    const createdProduct = await prisma.product.create({
      data: {
        name,
        price,
        description,
        referenceCode,
        lowStockThreshold: lowStockThreshold ?? 5,
        photo,
        currentStock,
        productCategoryId,
        unitOfMeasureId,
        storeId: req.store.id,
        status: ProductStatus.Active,
      },
    });

    res.status(201).json({
      data: createdProduct,
      message: "Producto creado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const { name, price, description, referenceCode, lowStockThreshold, photo, currentStock, productCategoryId, unitOfMeasureId } =
      req.body;
    verifyFields({ name });

    if (price === undefined || isNaN(price) || price < 0) {
      const error = new Error("El precio debe ser un número válido");
      error.statusCode = 400;
      throw error;
    }

    const product = await prisma.product.findFirst({
      where: { id, storeId: req.store.id },
    });
    if (!product) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (productCategoryId) {
      const productCategory = await prisma.productCategory.findUnique({
        where: { id: productCategoryId },
      });
      if (!productCategory) {
        const error = new Error("La categoría de producto no existe");
        error.statusCode = 404;
        throw error;
      }
    }

    if (unitOfMeasureId) {
      const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
        where: { id: unitOfMeasureId },
      });
      if (!unitOfMeasure) {
        const error = new Error("La unidad de medida no existe");
        error.statusCode = 404;
        throw error;
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        referenceCode,
        lowStockThreshold,
        photo,
        currentStock,
        productCategoryId,
        unitOfMeasureId,
      },
    });

    res.status(200).json({
      data: updatedProduct,
      message: "Producto editado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const product = await prisma.product.findFirst({
      where: { id, storeId: req.store.id },
    });
    if (!product) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const deletedProduct = await prisma.product.update({
      where: { id },
      data: {
        status: ProductStatus.Inactive,
        deactivationDate: new Date(),
      },
    });

    res.json({
      data: deletedProduct,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const restoreProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const product = await prisma.product.findFirst({
      where: { id, storeId: req.store.id },
    });
    if (!product) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const restoredProduct = await prisma.product.update({
      where: { id },
      data: {
        status: ProductStatus.Active,
        deactivationDate: null,
      },
    });

    res.json({
      data: restoredProduct,
      message: "Producto restablecido correctamente",
    });
  } catch (error) {
    next(error);
  }
};
