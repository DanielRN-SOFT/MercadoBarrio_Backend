import { SupplierStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";

export const getSuppliers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const { search, status } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { city: { contains: search } },
        { phone: { contains: search } },
        { address: { contains: search } },
      ];
    }

    if (status && Object.values(SupplierStatus).includes(status)) {
      where.status = status;
    }

    const [total, suppliers] = await Promise.all([
      prisma.supplier.count({ where }),
      prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          city: true,
          phone: true,
          status: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    res.json({
      data: suppliers,
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

export const getSupplierById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        city: true,
        phone: true,
        status: true,
      },
    });

    if (supplier) {
      res.json({ data: supplier });
    } else {
      res.status(404);
      throw new Error("Proveedor no encontrado");
    }
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const { name, email, address, city, phone } = req.body;
    verifyFields({ name, email, address, city, phone });

    const createdSupplier = await prisma.supplier.create({
      data: {
        name,
        email,
        address,
        city,
        phone,
        status: SupplierStatus.Active,
      },
    });

    res.status(201).json({
      data: createdSupplier,
      message: "Proveedor creado correctamente",
    });
  } catch (error) {
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.message = "Ese correo ya está registrado en el sistema";
    }
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const { name, email, address, city, phone } = req.body;
    const id = parseInt(req.params.id);

    verifyNumberID(id);
    verifyFields({ name, email, address, city, phone });

    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      const error = new Error("Proveedor no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const updatedSupplier = await prisma.supplier.update({
      data: { name, email, address, city, phone },
      where: { id },
    });

    res.status(200).json({
      data: updatedSupplier,
      message: "Proveedor editado correctamente",
    });
  } catch (error) {
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.message = "Ese correo ya está registrado en el sistema";
    }
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      const error = new Error("Proveedor no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const isAssociated = await prisma.movement.findFirst({
      where: { supplierId: id },
    });
    if (isAssociated) {
      const error = new Error("Ese proveedor está asociado a un movimiento");
      error.statusCode = 400;
      throw error;
    }

    const deletedSupplier = await prisma.supplier.update({
      where: { id },
      data: { status: SupplierStatus.Inactive },
    });

    res.json({
      data: deletedSupplier,
      message: "Proveedor eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const restoreSupplier = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      const error = new Error("Proveedor no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const restoredSupplier = await prisma.supplier.update({
      where: { id },
      data: { status: SupplierStatus.Active },
    });

    res.json({
      data: restoredSupplier,
      message: "Proveedor restablecido correctamente",
    });
  } catch (error) {
    next(error);
  }
};
