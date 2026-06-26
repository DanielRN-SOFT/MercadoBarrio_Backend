import prisma from "../../../prismaClient.js";
import bcrypt from "bcryptjs";
import generateToken from "../../helpers/generateToken.js";
import { UserStatus } from "../../../generated/prisma/index.js";
export const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        password: true,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user.id);

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      });
    } else {
      res.status(401);
      throw new Error("Email o Password invalido");
    }
  } catch (error) {
    next(error);
  }
};
export const registerUser = async (req, res, error) => {
  try {
    const { name, email, password, phone } = req.body;

    const userApi = await prisma.user.findUnique({ where: { email } });
    if (userApi) {
      res.status(400);
      throw new Error("El usuario ya existe");
    }

    const rol = await prisma.role.findFirst({ where: { name: "Grocer" } });
    if (!rol) {
      res.status(500);
      throw new Error("Rol 'Tendero' no encontrado");
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        phone,
        status: UserStatus.Active,
        roleId: rol.id,
      },
    });

    if (user) {
      generateToken(res, user.id);
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      });
    } else {
      res.status(400);
      throw new Error("Datos invalidos del usuario");
    }
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Fuerza que expire
  });
  res.status(200).json({ message: "Log out exitoso" });
};

export const getUserProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await prisma.user.findUnique({ where: { id } });
    console.log(user);

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      });
    } else {
      res.status(404);
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique(req.user.id);
    if (user) {
      const updatedUser = await prisma.usuarios.update({
        nombre: req.body.name || user.nombre,
        email: req.body.email || user.email,
        telefono: req.body.telefono || user.telefono,
      });

      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    next(error);
  }
};


