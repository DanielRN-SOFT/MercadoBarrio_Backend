import { ProductCategoryStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";

export const getProductCategories = async (req, res) => {
  try {
    // Obtenemos la pagina desde el query param, por defecto pagina 1
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;

    // Si estamos en página 1: skip=0, página 2: skip=10, página 3: skip=20...
    const skip = (page - 1) * limit;

    // Total de registros (para saber cuántas páginas hay en total)
    const total = await prisma.productCategory.count();

    const productCategories = await prisma.productCategory.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    res.json({
      data: productCategories,
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

export const getProductCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productCategory = await prisma.productCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (productCategory) {
      res.json({ productCategory });
    } else {
      res.status(500);
      throw new Error("Categoria de producto no encontrada");
    }
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
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
    res.status(500);
    throw new Error(error.message);
  }
};

export const updateProductCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const id = parseInt(req.params.id);

    const productCategory = await prisma.productCategory.findUnique({
      where: { id },
    });

    if (!productCategory) {
      res.status(404);
      throw new Error("Categoria de producto no encontrada");
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
    res.status(500);
    throw new Error(error.message);
  }
};

export const deleteProductCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productCategory = await prisma.productCategory.findUnique({
      where: { id },
    });

    if (productCategory) {
      const isExistProductCategory = await prisma.product.findFirst({
        where: { productCategoryId: id },
      });

      if (isExistProductCategory) {
        res.status(400);
        throw new Error("Esa categoria esta asociada a un producto");
      }

      const deletedProductCategory = await prisma.productCategory.update({
        where: { id },
        data: {
          status: ProductCategoryStatus.Inactive,
        },
      });

      res.status(200).json({
        data: deletedProductCategory,
        message: "Categoria de producto eliminada correctamente",
      });
    } else {
      res.status(404);
      throw new Error("Categoria de producto no encontrada");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export const restoreProductCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  const productCategory = await prisma.productCategory.findUnique({
    where: { id },
  });

  if (productCategory) {
    const restoredProductCategory = await prisma.productCategory.update({
      where: { id },
      data: {
        status: ProductCategoryStatus.Active,
      },
    });

    res.status(200).json({
      data: restoredProductCategory,
      message: "Categoria de producto restablecida correctamente",
    });
  } else {
    res.status(404);
    throw new Error("Categoria de producto no encontrada");
  }
};
