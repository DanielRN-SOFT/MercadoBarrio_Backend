import { UserStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";

export const getRoles = async (req, res) => {
  // Obtenemos la pagina desde el query param, por defecto pagina 1
  const page = req.query.page || 1;
  const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;

  // Si estamos en página 1: skip=0, página 2: skip=10, página 3: skip=20...
  const skip = (page - 1) * limit;

  // Total de registros (para saber cuántas páginas hay en total)
  const total = await prisma.role.count();

  const roles = await prisma.role.findMany({
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
    },
  });

  res.json({
    data: roles,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getRoleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rol = await prisma.role.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    if (rol) {
      res.json({ rol });
    } else {
      res.status(500);
      throw new Error("Rol no encontrado");
    }
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
};

export const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const createdRole = await prisma.role.create({
      data: {
        name,
      },
    });
    res.json(createdRole);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export const updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const id = parseInt(req.params.id);

    const role = await prisma.role.findUnique({ where: { id } });

    if (!role) {
      res.status(404);
      throw new Error("Rol no encontrado");
    }

    const updatedRole = await prisma.role.update({
      data: { name },
      where: { id },
    });

    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export const deleteRole = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const role = await prisma.role.findUnique({ where: { id } });

    if (role) {
      const userRole = await prisma.user.findFirst({ where: { roleId: id } });

      if (userRole) {
        res.status(400);
        throw new Error("Ya existe un usuario asociado a ese rol");
      }

      const deletedRole = await prisma.role.delete({
        where: { id },
      });

      res.json({ deletedRole });
    } else {
      res.status(404);
      throw new Error("Rol no encontrado");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};
