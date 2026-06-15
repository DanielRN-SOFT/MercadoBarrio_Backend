import { UserStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";

export const getUsers = async (req, res) => {
  // Obtenemos la pagina desde el query param, por defecto pagina 1
  const page = req.query.page || 1;
  const limit = process.env.PAGINATION_LIMIT ||  10;

  // Si estamos en página 1: skip=0, página 2: skip=10, página 3: skip=20...
  const skip = (page - 1) * limit;

  // Total de registros (para saber cuántas páginas hay en total)
  const total = await prisma.user.count();

  const users = await prisma.user.findMany({
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      roleId: true,
    },
  });

  res.json({
    data: users,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        roleId: true,
      },
    });

    if (user) {
      res.json({ user });
    } else {
      res.status(500);
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const id = parseInt(req.params.id);

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404);
      throw new Error("Usuario no encontrado");
    }

    const userEmail = await prisma.user.findFirst({
      where: {
        email: email,
        id: {
          not: id,
        },
      },
    });

    if (userEmail) {
      res.status(404);
      throw new Error("Ese email ya esta registrado en el sistema");
    }

    const updatedUser = await prisma.user.update({
      data: { name, email, phone },
      where: { id },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });

    if (user) {
      const deletedUser = await prisma.user.update({
        data: {
          status: UserStatus.Inactive,
        },
        where: {
          id,
        },
      });

      res.json(deletedUser);
    } else {
      res.status(404);
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export const restoreUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });

    if (user) {
      const restoredUser = await prisma.user.update({
        data: {
          status: UserStatus.Active,
        },
        where: {
          id,
        },
      });

      res.json(restoredUser);
    } else {
      res.status(404);
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};
