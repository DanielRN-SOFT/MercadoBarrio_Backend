import { ProductStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";

export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;
    const { name, productCategoryId, status } = req.query;

    const where = {
      storeId: req.store.id,
      ...(name && { name: { contains: name } }),
      ...(productCategoryId && {
        productCategoryId: parseInt(productCategoryId),
      }),
      ...(status && { status }),
    };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          price: true,
          currentStock: true,
          lowStockThreshold: true,
          status: true,
          productCategoryId: true,
          photo: true,
          unitOfMeasureId: true,
          productCategory: {
            select: { id: true, name: true },
          },
        },
        orderBy: { name: "asc" },
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
    const {
      name,
      price,
      description,
      referenceCode,
      lowStockThreshold,
      photo,
      currentStock,
      productCategoryId,
      unitOfMeasureId,
    } = req.body;
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

    const {
      name,
      price,
      description,
      referenceCode,
      lowStockThreshold,
      photo,
      productCategoryId,
      unitOfMeasureId,
    } = req.body;
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

    const previousValue = {
      name: product.name,
      price: product.price,
      description: product.description,
      referenceCode: product.referenceCode,
      lowStockThreshold: product.lowStockThreshold,
      photo: product.photo,
      productCategoryId: product.productCategoryId,
      unitOfMeasureId: product.unitOfMeasureId,
    };

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        referenceCode,
        lowStockThreshold,
        photo,
        productCategoryId,
        unitOfMeasureId,
      },
    });

    await prisma.auditLog.create({
      data: {
        eventActionType: "UPDATE",
        userId: req.user.id,
        clientIp: req.ip ?? "unknown",
        resourceType: "Product",
        resourceId: product.id,
        previousValue: JSON.stringify(previousValue),
        newValue: JSON.stringify({
          name: updatedProduct.name,
          price: updatedProduct.price,
          description: updatedProduct.description,
          referenceCode: updatedProduct.referenceCode,
          lowStockThreshold: updatedProduct.lowStockThreshold,
          photo: updatedProduct.photo,
          productCategoryId: updatedProduct.productCategoryId,
          unitOfMeasureId: updatedProduct.unitOfMeasureId,
        }),
        description: "Producto actualizado",
        status: "Active",
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

export const getInventoryStatus = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;
    const { name, productCategoryId, stockStatus } = req.query;

    const where = {
      storeId: req.store.id,
      status: ProductStatus.Active,
      ...(name && { name: { contains: name } }),
      ...(productCategoryId && {
        productCategoryId: parseInt(productCategoryId),
      }),
    };

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        currentStock: true,
        lowStockThreshold: true,
        photo: true,
        productCategoryId: true,
        productCategory: { select: { id: true, name: true } },
      },
      orderBy: { name: "asc" },
    });

    const withStockStatus = products.map((product) => {
      let stockStatus;
      if (product.currentStock <= 0) {
        stockStatus = "Agotado";
      } else if (product.currentStock <= product.lowStockThreshold) {
        stockStatus = "Critico";
      } else {
        stockStatus = "Normal";
      }
      return { ...product, stockStatus };
    });

    const summary = withStockStatus.reduce(
      (acc, product) => {
        if (product.stockStatus === "Agotado") acc.agotados += 1;
        if (product.stockStatus === "Critico") acc.criticos += 1;
        acc.total += 1;
        return acc;
      },
      { total: 0, criticos: 0, agotados: 0 },
    );

    const filtered = stockStatus
      ? withStockStatus.filter((p) => p.stockStatus === stockStatus)
      : withStockStatus;

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    res.json({
      data: paginated,
      summary,
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

export const updateThresholdByCategory = async (req, res, next) => {
  try {
    const { productCategoryId, lowStockThreshold } = req.body;

    if (!productCategoryId || isNaN(productCategoryId)) {
      const error = new Error("La categoría de producto es obligatoria");
      error.statusCode = 400;
      throw error;
    }

    if (
      lowStockThreshold === undefined ||
      isNaN(lowStockThreshold) ||
      lowStockThreshold < 0
    ) {
      const error = new Error("El umbral debe ser un número válido");
      error.statusCode = 400;
      throw error;
    }

    const productCategory = await prisma.productCategory.findUnique({
      where: { id: parseInt(productCategoryId) },
    });
    if (!productCategory) {
      const error = new Error("La categoría de producto no existe");
      error.statusCode = 404;
      throw error;
    }

    const result = await prisma.product.updateMany({
      where: {
        storeId: req.store.id,
        productCategoryId: parseInt(productCategoryId),
        status: ProductStatus.Active,
      },
      data: { lowStockThreshold: parseInt(lowStockThreshold) },
    });

    await prisma.auditLog.create({
      data: {
        eventActionType: "UPDATE",
        userId: req.user.id,
        clientIp: req.ip ?? "unknown",
        resourceType: "Product",
        resourceId: parseInt(productCategoryId),
        previousValue: null,
        newValue: JSON.stringify({
          productCategoryId: parseInt(productCategoryId),
          lowStockThreshold: parseInt(lowStockThreshold),
          affectedProducts: result.count,
        }),
        description: "Umbral actualizado por categoría",
        status: "Active",
      },
    });

    res.status(200).json({
      message: `Umbral actualizado para ${result.count} producto(s) de la categoría`,
      data: { affectedProducts: result.count },
    });
  } catch (error) {
    next(error);
  }
};

export const searchProductsPublic = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const { name, productCategoryId } = req.query;

    const where = {
      status: "Active",
      currentStock: { gt: 0 },
      ...(name && { name: { contains: name } }),
      ...(productCategoryId && {
        productCategoryId: parseInt(productCategoryId),
      }),
      store: { status: "Active" },
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          name: true,
          price: true,
          photo: true,
          currentStock: true,
          lowStockThreshold: true,
          unitOfMeasure: { select: { name: true } },
          productCategory: { select: { id: true, name: true } },
          store: {
            select: {
              id: true,
              name: true,
              address: true,
              neighborhood: true,
              phone: true,
              logo: true,
              latitude: true,
              longitude: true,
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.product.count({ where }),
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
