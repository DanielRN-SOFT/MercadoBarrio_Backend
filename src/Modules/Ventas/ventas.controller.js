import { SaleStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";

export const getSales = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const [total, sales] = await Promise.all([
      prisma.sale.count({
        where: { storeId: req.store.id },
      }),
      prisma.sale.findMany({
        skip,
        take: limit,
        where: { storeId: req.store.id },
        orderBy: { date: "desc" },
        select: {
          id: true,
          date: true,
          total: true,
          status: true,
          userId: true,
        },
      }),
    ]);

    res.json({
      data: sales,
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

export const getSaleById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const sale = await prisma.sale.findFirst({
      where: { id, storeId: req.store.id },
      select: {
        id: true,
        date: true,
        total: true,
        status: true,
        userId: true,
        cancellationReason: true,
        cancellationDate: true,
        details: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            unitPrice: true,
            subtotal: true,
          },
        },
      },
    });

    if (sale) {
      res.json({ data: sale });
    } else {
      res.status(404);
      throw new Error("Venta no encontrada");
    }
  } catch (error) {
    next(error);
  }
};

export const createSale = async (req, res, next) => {
  try {
    const { date, details } = req.body;

    if (!Array.isArray(details) || details.length === 0) {
      const error = new Error("La venta debe tener al menos un producto en el detalle");
      error.statusCode = 400;
      throw error;
    }

    for (const item of details) {
      if (!item.productId || isNaN(item.productId) || !item.quantity || isNaN(item.quantity) || item.quantity <= 0) {
        const error = new Error("Cada producto del detalle debe tener productId y quantity válidos");
        error.statusCode = 400;
        throw error;
      }
    }

    const createdSale = await prisma.$transaction(async (tx) => {
      let total = 0;
      const detailsData = [];

      for (const item of details) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, storeId: req.store.id },
        });

        if (!product) {
          const error = new Error(`El producto con id ${item.productId} no existe en esta tienda`);
          error.statusCode = 404;
          throw error;
        }

        if (product.currentStock < item.quantity) {
          const error = new Error(`Stock insuficiente para el producto "${product.name}"`);
          error.statusCode = 400;
          throw error;
        }

        const unitPrice = Number(product.price);
        const subtotal = unitPrice * Number(item.quantity);
        total += subtotal;

        detailsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        });

        await tx.product.update({
          where: { id: product.id },
          data: { currentStock: { decrement: item.quantity } },
        });
      }

      return tx.sale.create({
        data: {
          date: date ? new Date(date) : new Date(),
          total,
          status: SaleStatus.Completed,
          userId: req.user.id,
          storeId: req.store.id,
          details: { create: detailsData },
        },
        include: { details: true },
      });
    });

    res.status(201).json({
      data: createdSale,
      message: "Venta registrada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSale = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const { cancellationReason } = req.body;

    const sale = await prisma.sale.findFirst({
      where: { id, storeId: req.store.id },
      include: { details: true },
    });
    if (!sale) {
      const error = new Error("Venta no encontrada");
      error.statusCode = 404;
      throw error;
    }

    if (sale.status === SaleStatus.Cancelled) {
      const error = new Error("Esa venta ya está cancelada");
      error.statusCode = 400;
      throw error;
    }

    const cancelledSale = await prisma.$transaction(async (tx) => {
      for (const detail of sale.details) {
        await tx.product.update({
          where: { id: detail.productId },
          data: { currentStock: { increment: detail.quantity } },
        });
      }

      return tx.sale.update({
        where: { id },
        data: {
          status: SaleStatus.Cancelled,
          cancellationReason: cancellationReason || "Sin motivo especificado",
          cancellationDate: new Date(),
        },
      });
    });

    res.json({
      data: cancelledSale,
      message: "Venta cancelada correctamente",
    });
  } catch (error) {
    next(error);
  }
};
