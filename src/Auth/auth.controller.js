import prisma from "../../prismaClient";
import bcrypt from "bcryptjs";
import generateToken from "../helpers/generateToken";
import { usuarios_estado } from "../../generated/prisma/enums";
import { use } from "react";
export const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.usuarios.findUnique({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user.id);

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      roles_id: user.roles_id,
    });
  } else {
    res.status(401);
    throw new Error("Email o Password invalido");
  }
};

export const registerUser = async (req, res) => {
  const { nombre, email, password, telefono } = req.body;
  const usuario = await prisma.usuarios.findUnique({ where: { email } });
  const rol = await prisma.roles.findFirst({ where: { nombre: "Tendero" } });

  if (usuario) {
    res.status(400);
    throw new Error("El usuario ya existe");
  }

  const user = await prisma.usuarios.create({
    nombre,
    email,
    password: bcrypt.hashSync(password, 10),
    estado: usuarios_estado.Activo,
    rol,
  });

  if (user) {
    generateToken(res, user.id);
    res.status(201).json({
      id: user.id,
      nombre: user.nombre,
      email: user.nombre,
      rol: user.roles_id,
    });
  } else {
    res.status(400);
    throw new Error("Datos invalidos del usuario");
  }
};

export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Fuerza que expire
  });
  res.status(200).json({ message: "Log out exitoso" });
};

export const getUserProfile = (req, res) => {
  const user = req.user.id;

  if (user) {
    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      roles_id: user.roles_id,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
};
