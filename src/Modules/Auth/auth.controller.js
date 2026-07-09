import prisma from "../../../prismaClient.js";
import bcrypt from "bcryptjs";
import generateToken from "../../helpers/generateToken.js";
import { UserStatus } from "../../../generated/prisma/index.js";
import generarId from "../../helpers/generateId.js";
import emailForgotPassword from "../../../emails/emailForgotPassword.js";
export const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email, status: UserStatus.Active },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: true,
        roleId: true,
        role: { select: { name: true } },
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user.id);
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        role: user.role.name,
      });
    } else {
      res.status(401);
      throw new Error("Email o Password invalido");
    }
  } catch (error) {
    next(error);
  }
};
export const registerUser = async (req, res, next) => {
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
      include: { role: { select: { name: true } } },
    });

    if (user) {
      generateToken(res, user.id);
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        role: user.role.name,
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
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Log out exitoso" });
};

export const getUserProfile = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: { select: { name: true } } },
    });

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        role: user.role.name, // "Admin" | "Grocer"
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
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      omit: { password: false },
    });
    if (!user) {
      res.status(404);
      throw new Error("Usuario no encontrado");
    }

    const data = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
    };

    console.log(data);

    if (req.body.password && req.body.new_password) {
      const passwordMatches = await bcrypt.compare(
        req.body.password,
        user.password,
      );
      if (!passwordMatches) {
        res.status(400);
        throw new Error("La contraseña actual no es correcta");
      }
      data.password = await bcrypt.hash(req.body.new_password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const error = new Error("El email ingresado no se encuentra registrado");
      error.statusCode = 401;
      throw error;
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        token: generarId(),
      },
    });
    emailForgotPassword({
      name: updatedUser.name,
      email: updatedUser.email,
      token: updatedUser.token,
    });

    res.json({
      message: "Hemos enviado un email con las instrucciones",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await prisma.user.findFirst({ where: { token } });

    if (!user) {
      const error = new Error("Hubo un error, intentalo más tarde");
      error.statusCode = 400;
      throw error;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        token: null,
        password: bcrypt.hashSync(password, 10),
      },
    });

    res.json({ message: "La contraseña ha sido restablecida exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const comprobarToken = async (req, res, next) => {
  try {
    // Token de acceso
    const { token } = req.params;

    // Verificar que el usuario tenga el token asignado
    const tokenValido = await prisma.user.findFirst({ where: { token } });

    // Si no existe, se genera un error
    if (!tokenValido) {
      const error = new Error("Token no valido");
      error.statusCode = 403;
      next(error);
    }

    // Si pasa la validacion, mensaje de confirmacion
    res.json({ message: "Token valido y el usuario existe" });
  } catch (error) {
    console.log(error);
  }
};
