import jwt from "jsonwebtoken";
import prisma from "../../prismaClient.js";

export const protect = async (req, res, next) => {
  let token;

  // Lee el jwt token de la cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          name: true,
          email: true,
          roleId: true,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("No autorizado, token fallido !");
    }
  } else {
    res.status(401);
    throw new Error("No autorizado, no hay token!");
  }
};

export const IsTendero = async (req, res, next) => {
  const rol_tendero = await prisma.role.findFirst({
    where: {
      nombre: "Grocer",
    },
  });

  if (req.user && req.user.roles_id == rol_tendero.id) {
    res.status(401);
    throw new Error("No autorizado, debe ser Tendero");
  }
};

export const IsAdmin = async (req, res, next) => {
  const rol_tendero = await prisma.role.findFirst({
    where: {
      nombre: "Admin",
    },
  });

  if (req.user && req.user.roles_id == rol_tendero.id) {
    res.status(401);
    throw new Error("No autorizado, debe ser ADMIN");
  }
};
