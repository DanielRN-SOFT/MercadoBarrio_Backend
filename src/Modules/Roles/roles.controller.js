import { RoleStatus, UserStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";

import verifyNumberID from "../../helpers/verifyNumberID.js";
import verifyStringFields from "../../helpers/verifyStringFields.js";

export const getRoles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const [total, roles] = await Promise.all([
      prisma.role.count(),
      prisma.role.findMany({
        skip,
        take: limit,
        select: { id: true, name: true },
      }),
    ]);

    res.json({
      data: roles,
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

export const getRoleById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Funcion para determinar si el id es un numero
    verifyNumberID(id);

    const rol = await prisma.role.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!rol) {
      const error = new Error("Rol no encontrado");
      error.statusCode = 404;
      throw error;
    }

    res.json({ data: rol });
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Verificar que el campo llege lleno y sea un string
    verifyStringFields({ name });

    const createdRole = await prisma.role.create({
      data: { name: name.trim(), status: RoleStatus.Active },
    });

    res.status(201).json({
      data: createdRole,
      message: "Rol creado correctamente",
    });
  } catch (error) {
    // Status code si prisma detecta un fallo en campo unique
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.message = "Ya existe un rol con ese nombre";
    }
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { name } = req.body;
    const id = parseInt(req.params.id);

    // Funcion para determinar si el id es un numero
    verifyNumberID(id);

    // Verificar que el campo llege lleno y sea un string
    verifyStringFields({ name });

    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      const error = new Error("Rol no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const updatedRole = await prisma.role.update({
      data: { name: name.trim() },
      where: { id },
    });

    res.status(200).json({
      data: updatedRole,
      message: "Rol actualizado correctamente",
    });
  } catch (error) {
    // Status code si prisma detecta un fallo en campo unique
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.message = "Ya existe un rol con ese nombre";
    }
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Funcion para determinar si el id es un numero
    verifyNumberID(id);

    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      const error = new Error("Rol no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const userRole = await prisma.user.findFirst({
      where: { roleId: id, status: UserStatus.Active },
    });
    if (userRole) {
      const error = new Error("Ya existe un usuario asociado a ese rol");
      error.statusCode = 400;
      throw error;
    }

    const deletedRole = await prisma.role.delete({ where: { id } });

    res.json({
      data: deletedRole,
      message: "Rol eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};
