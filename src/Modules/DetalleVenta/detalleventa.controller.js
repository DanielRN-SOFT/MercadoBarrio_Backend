import prisma from "../../../prismaClient.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";

export const getSaleDetails = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const { saleId } = req.query;

    const where = {
      sale: { storeId: req.store.id },
      ...(saleId && !isNaN(saleId) ? { saleId: parseInt(saleId) } : {}),
    };

    const [total, saleDetails] = await Promise.all([
      prisma.saleDetail.count({ where }),
      prisma.saleDetail.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id: "desc" },
        select: {
          id: true,
          saleId: true,
          productId: true,
          quantity: true,
          unitPrice: true,
          subtotal: true,
        },
      }),
    ]);

    res.json({
      data: saleDetails,
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

export const getSaleDetailById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const saleDetail = await prisma.saleDetail.findFirst({
      where: { id, sale: { storeId: req.store.id } },
      select: {
        id: true,
        saleId: true,
        productId: true,
        quantity: true,
        unitPrice: true,
        subtotal: true,
      },
    });

    if (saleDetail) {
      res.json({ data: saleDetail });
    } else {
      res.status(404);
      throw new Error("Detalle de venta no encontrado");
    }
  } catch (error) {
    next(error);
  }
};
