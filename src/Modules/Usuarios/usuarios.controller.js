import { UserStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";

export const getUsers = async (req, res, next) => {
  try {
    // Obtenemos la pagina desde el query param, por defecto pagina 1
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;

    // Si estamos en página 1: skip=0, página 2: skip=10, página 3: skip=20...
    const skip = (page - 1) * limit;

    // Ejectuar dos peticiones a la vez, para optimizar la velocidad dez
    const [total, users] = await Promise.all([
      prisma.role.count(),
      prisma.user.findMany({
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
      }),
    ]);

    res.json({
      data: users,
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

export const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // verificar que el id sea un numero
    verifyNumberID(id);

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
      res.json({ data: user });
    } else {
      res.status(500);
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const id = parseInt(req.params.id);
    
    verifyNumberID(id);

    // Verificar que todos los campos si lleguen y sean string
    verifyFields({ name, email, phone });

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      const error = new Error("Rol no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const updatedUser = await prisma.user.update({
      data: { name, email, phone },
      where: { id },
    });

    res
      .status(200)
      .json({ data: updatedUser, message: "Usuario editado exitosamente" });
  } catch (error) {
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.message = "Ese email ya esta registrado en el sistema";
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    verifyNumberID(id);

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

      res.json({
        data: deletedUser,
        message: "Usuario eliminado correctamente",
      });
    } else {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const restoreUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    verifyNumberID(id);

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

      res.json({
        data: restoredUser,
        message: "Usuario restablecido correctamente",
      });
    } else {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
