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

export const getStorePublicById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;
    const { productCategoryId } = req.query;

    const productsWhere = {
      storeId: id,
      status: "Active",
      ...(productCategoryId && {
        productCategoryId: parseInt(productCategoryId),
      }),
    };

    const [store, total, products, categories] = await Promise.all([
      prisma.store.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          address: true,
          neighborhood: true,
          description: true,
          logo: true,
          photo: true,
          phone: true,
          status: true,
          latitude: true,
          longitude: true,
          storeCategory: {
            select: { id: true, name: true },
          },
          schedules: {
            select: {
              id: true,
              weekDay: true,
              startTime: true,
              endTime: true,
              status: true,
            },
          },
        },
      }),
      prisma.product.count({ where: productsWhere }),
      prisma.product.findMany({
        where: productsWhere,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          photo: true,
          currentStock: true,
          lowStockThreshold: true,
          referenceCode: true,
          productCategory: {
            select: { id: true, name: true },
          },
          unitOfMeasure: {
            select: { id: true, name: true },
          },
        },
      }),
      // Categorías disponibles (sin filtrar por categoría, para los botones)
      prisma.product.findMany({
        where: { storeId: id, status: "Active" },
        select: {
          productCategory: { select: { id: true, name: true } },
        },
        distinct: ["productCategoryId"],
      }),
    ]);

    if (!store) {
      res.status(404);
      throw new Error("Tienda no encontrada");
    }

    res.json({
      data: {
        ...store,
        products,
        categories: categories.map((c) => c.productCategory),
      },
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

export const createMyStore = async (req, res, next) => {
  try {
    const {
      name,
      address,
      neighborhood,
      longitude,
      latitude,
      description,
      phone,
      photo,
      storeCategoryId,
    } = req.body;

    verifyFields({ name, address, neighborhood });

    if (!storeCategoryId || isNaN(storeCategoryId)) {
      const error = new Error("La categoría de tienda es obligatoria");
      error.statusCode = 400;
      throw error;
    }

    const storeCategory = await prisma.storeCategory.findUnique({
      where: { id: parseInt(storeCategoryId) },
    });
    if (!storeCategory) {
      const error = new Error("La categoría de tienda no existe");
      error.statusCode = 404;
      throw error;
    }

    const existingStore = await prisma.store.findFirst({
      where: { userId: req.user.id },
    });
    if (existingStore) {
      const error = new Error("Ya tienes una tienda registrada");
      error.statusCode = 400;
      throw error;
    }

    const createdStore = await prisma.store.create({
      data: {
        name,
        address,
        neighborhood,
        longitude: longitude ? parseFloat(longitude) : 0,
        latitude: latitude ? parseFloat(latitude) : 0,
        description,
        phone,
        photo,
        userId: req.user.id,
        storeCategoryId: parseInt(storeCategoryId),
        status: StoreStatus.Pending,
        onboardingStep: "completed",
      },
    });

    await prisma.auditLog.create({
      data: {
        eventActionType: "CREATE",
        userId: req.user.id,
        clientIp: req.ip ?? "unknown",
        resourceType: "Store",
        resourceId: createdStore.id,
        newValue: JSON.stringify({
          name: createdStore.name,
          address: createdStore.address,
          neighborhood: createdStore.neighborhood,
          phone: createdStore.phone,
          storeCategoryId: createdStore.storeCategoryId,
        }),
        description: "Tienda registrada por el propietario",
        status: "Active",
      },
    });

    res.status(201).json({
      data: createdStore,
      message: "Tienda registrada correctamente, está pendiente de aprobación",
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyStore = async (req, res, next) => {
  try {
    const store = await prisma.store.findFirst({
      where: { userId: req.user.id },
    });

    if (!store) {
      const error = new Error("No tienes una tienda registrada");
      error.statusCode = 404;
      throw error;
    }

    const {
      name,
      address,
      neighborhood,
      longitude,
      latitude,
      description,
      phone,
      photo,
      storeCategoryId,
    } = req.body;

    verifyFields({ name, address, neighborhood });

    if (storeCategoryId) {
      const storeCategory = await prisma.storeCategory.findUnique({
        where: { id: parseInt(storeCategoryId) },
      });
      if (!storeCategory) {
        const error = new Error("La categoría de tienda no existe");
        error.statusCode = 404;
        throw error;
      }
    }

    const previousValue = {
      name: store.name,
      address: store.address,
      neighborhood: store.neighborhood,
      longitude: store.longitude,
      latitude: store.latitude,
      description: store.description,
      phone: store.phone,
      photo: store.photo,
      storeCategoryId: store.storeCategoryId,
    };

    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        name,
        address,
        neighborhood,
        longitude: longitude ? parseFloat(longitude) : store.longitude,
        latitude: latitude ? parseFloat(latitude) : store.latitude,
        description,
        phone,
        photo,
        ...(storeCategoryId && { storeCategoryId: parseInt(storeCategoryId) }),
      },
    });

    await prisma.auditLog.create({
      data: {
        eventActionType: "UPDATE",
        userId: req.user.id,
        clientIp: req.ip ?? "unknown",
        resourceType: "Store",
        resourceId: store.id,
        previousValue: JSON.stringify(previousValue),
        newValue: JSON.stringify({
          name: updatedStore.name,
          address: updatedStore.address,
          neighborhood: updatedStore.neighborhood,
          longitude: updatedStore.longitude,
          latitude: updatedStore.latitude,
          description: updatedStore.description,
          phone: updatedStore.phone,
          photo: updatedStore.photo,
          storeCategoryId: updatedStore.storeCategoryId,
        }),
        description: "Perfil de tienda actualizado por el propietario",
        status: "Active",
      },
    });

    res.json({
      data: updatedStore,
      message: "Tienda actualizada correctamente",
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

export const getMyStore = async (req, res, next) => {
  try {
    const store = await prisma.store.findFirst({
      where: { userId: req.user.id },
      select: {
        id: true,
        name: true,
        address: true,
        neighborhood: true,
        longitude: true,
        latitude: true,
        description: true,
        logo: true,
        photo: true,
        phone: true,
        status: true,
        storeCategoryId: true,
        onboardingStep: true,
      },
    });

    if (!store) {
      const error = new Error("Aún no tienes una tienda registrada");
      error.statusCode = 404;
      throw error;
    }

    res.json({ data: store });
  } catch (error) {
    next(error);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const {
      name,
      address,
      neighborhood,
      longitude,
      latitude,
      description,
      phone,
      photo,
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

    const existingStore = await prisma.store.findFirst({ where: { userId } });
    if (existingStore) {
      const error = new Error("Ese usuario ya tiene una tienda asociada");
      error.statusCode = 400;
      throw error;
    }

    const createdStore = await prisma.store.create({
      data: {
        name,
        address,
        neighborhood,
        longitude,
        latitude,
        description,
        phone,
        photo,
        storeCategoryId,
        userId,
        status: StoreStatus.Active,
        onboardingStep: "completed",
      },
    });

    res
      .status(201)
      .json({ data: createdStore, message: "Tienda creada correctamente" });
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
      neighborhood,
      longitude,
      latitude,
      description,
      phone,
      photo,
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
        neighborhood,
        longitude,
        latitude,
        description,
        phone,
        photo,
        storeCategoryId,
      },
    });

    res.json({ data: updatedStore, message: "Tienda editada exitosamente" });
  } catch (error) {
    next(error);
  }
};
