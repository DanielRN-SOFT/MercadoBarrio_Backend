import prisma from "../../../prismaClient.js";
import bcrypt from "bcryptjs";
import generateToken from "../../helpers/generateToken.js";
import { usuarios_estado } from "../../../generated/prisma/index.js";
export const authUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await prisma.usuarios.findUnique({
    where: { email },
    select: {
      id: true,
      nombre: true,
      email: true,
      roles_id: true,
      password: true,
    },
  });
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
  if (usuario) {
    res.status(400);
    throw new Error("El usuario ya existe");
  }

  const rol = await prisma.roles.findFirst({ where: { nombre: "Tendero" } });
  if (!rol) {
    res.status(500);
    throw new Error("Rol 'Tendero' no encontrado");
  }

  const user = await prisma.usuarios.create({
    data: {
      nombre,
      email,
      password: bcrypt.hashSync(password, 10),
      telefono,
      estado: "Activo",
      roles_id: rol.id,
    },
  });

  if (user) {
    generateToken(res, user.id);
    res.status(201).json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
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

export const updateUserProfile = async (req, res) => {
  const user = await prisma.usuarios.findUnique(req.user.id);
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
};
