import { StoreStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";

export const getStores = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const [total, stores] = await Promise.all([
      prisma.store.count(),
      prisma.store.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          status: true,
          storeCategoryId: true,
          userId: true,
        },
      }),
    ]);

    res.json({
      data: stores,
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

export const getStoresPublic = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;
    const { name, neighborhood, storeCategoryId, openNow } = req.query;

    // Hora colombiana
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }),
    );
    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = weekDays[now.getDay()];
    const currentTime = new Date();
    currentTime.setFullYear(1970, 0, 1); // Prisma guarda Time con fecha base 1970

    const where = {
      status: "Active",
      ...(name && { name: { contains: name } }),
      ...(neighborhood && {
        neighborhood: { contains: neighborhood },
      }),
      ...(storeCategoryId && { storeCategoryId: parseInt(storeCategoryId) }),
      ...(openNow === "true" && {
        schedules: {
          some: {
            weekDay: currentDay,
            startTime: { lte: currentTime },
            endTime: { gte: currentTime },
            status: "Active",
          },
        },
      }),
    };

    const [total, stores] = await Promise.all([
      prisma.store.count({ where }),
      prisma.store.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          status: true,
          neighborhood: true,
          latitude: true,
          longitude: true,
          logo: true,
          photo: true,
          storeCategory: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);

    res.json({
      data: stores,
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

export const getStoreById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const store = await prisma.store.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        longitude: true,
        latitude: true,
        description: true,
        logo: true,
        phone: true,
        status: true,
        storeCategoryId: true,
        userId: true,
        onboardingStep: true,
      },
    });

    if (store) {
      res.json({ data: store });
    } else {
      res.status(404);
      throw new Error("Tienda no encontrada");
    }
  } catch (error) {
    next(error);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const {
      name,
      address,
      longitude,
      latitude,
      description,
      phone,
      storeCategoryId,
      userId,
    } = req.body;
    verifyFields({ name, address });

    if (!storeCategoryId || isNaN(storeCategoryId)) {
      const error = new Error("La categoría de tienda es obligatoria");
      error.statusCode = 400;
      throw error;
    }

    if (!userId || isNaN(userId)) {
      const error = new Error("El usuario propietario es obligatorio");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error("El usuario propietario no existe");
      error.statusCode = 404;
      throw error;
    }

    const storeCategory = await prisma.storeCategory.findUnique({
      where: { id: storeCategoryId },
    });
    if (!storeCategory) {
      const error = new Error("La categoría de tienda no existe");
      error.statusCode = 404;
      throw error;
    }

    const existingStore = await prisma.store.findFirst({
      where: { userId },
    });
    if (existingStore) {
      const error = new Error("Ese usuario ya tiene una tienda asociada");
      error.statusCode = 400;
      throw error;
    }

    const createdStore = await prisma.store.create({
      data: {
        name,
        address,
        longitude,
        latitude,
        description,
        phone,
        storeCategoryId,
        userId,
        status: StoreStatus.Active,
        onboardingStep: "completed",
      },
    });

    res.status(201).json({
      data: createdStore,
      message: "Tienda creada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const {
      name,
      address,
      longitude,
      latitude,
      description,
      phone,
      storeCategoryId,
    } = req.body;
    verifyFields({ name, address });

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      const error = new Error("Tienda no encontrada");
      error.statusCode = 404;
      throw error;
    }

    if (storeCategoryId) {
      const storeCategory = await prisma.storeCategory.findUnique({
        where: { id: storeCategoryId },
      });
      if (!storeCategory) {
        const error = new Error("La categoría de tienda no existe");
        error.statusCode = 404;
        throw error;
      }
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data: {
        name,
        address,
        longitude,
        latitude,
        description,
        phone,
        storeCategoryId,
      },
    });

    res.status(200).json({
      data: updatedStore,
      message: "Tienda editada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      const error = new Error("Tienda no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const deletedStore = await prisma.store.update({
      where: { id },
      data: { status: StoreStatus.Inactive },
    });

    res.json({
      data: deletedStore,
      message: "Tienda eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const restoreStore = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      const error = new Error("Tienda no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const restoredStore = await prisma.store.update({
      where: { id },
      data: { status: StoreStatus.Active },
    });

    res.json({
      data: restoredStore,
      message: "Tienda restablecida correctamente",
    });
  } catch (error) {
    next(error);
  }
};
