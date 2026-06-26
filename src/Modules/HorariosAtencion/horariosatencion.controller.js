import {
  ScheduleStatus,
  StoreCategoryStatus,
} from "../../../generated/prisma/index.js";
import prisma from "../../../prismaClient.js";
import verifyFields from "../../helpers/verifyStringFields.js";
import verifyNumberID from "../../helpers/verifyNumberID.js";
import isMyStore from "../../helpers/isMyStore.js";

export const getAttendanceSchedule = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;

    const WEEK_ORDER = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };

    let [total, attendanceSchedules] = await Promise.all([
      prisma.attendanceSchedule.count({
        where: {
          storeId: req.store.id,
        },
      }),
      prisma.attendanceSchedule.findMany({
        skip,
        take: limit,
        where: {
          storeId: req.store.id,
        },
        select: {
          id: true,
          weekDay: true,
          startTime: true,
          endTime: true,
          status: true,
        },
      }),
    ]);

    ((attendanceSchedules = attendanceSchedules.sort(
      (a, b) => WEEK_ORDER[a.weekDay] - WEEK_ORDER[b.weekDay],
    )),
      res.json({
        data: attendanceSchedules,
        meta: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      }));
  } catch (error) {
    next(error);
  }
};

export const getAttendanceScheduleById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const attendanceSchedule = await prisma.attendanceSchedule.findFirst({
      where: { id, storeId: req.store.id },
      select: {
        weekDay: true,
        startTime: true,
        endTime: true,
        status: true,
      },
    });

    isMyStore(req, attendanceSchedule);

    if (attendanceSchedule) {
      res.json({ data: attendanceSchedule });
    } else {
      res.status(404);
      throw new Error("Horario de tienda no encontrada");
    }
  } catch (error) {
    next(error);
  }
};

export const createAttendanceSchedule = async (req, res, next) => {
  try {
    const { weekDay, startTime, endTime } = req.body;
    verifyFields({ weekDay });

    const verificarHorario = await prisma.attendanceSchedule.findFirst({
      where: {
        weekDay,
        storeId: req.store.id,
        AND: [
          { startTime: { lt: endTime } }, // el existente empieza antes de que el nuevo termine
          { endTime: { gt: startTime } }, // el existente termina después de que el nuevo empiece
        ],
        status: ScheduleStatus.Active,
      },
    });

    if (verificarHorario) {
      res.status(400);
      throw new Error(
        "Ya existe un horario que se cruza con el horario ingresado",
      );
    }

    if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
      const error = new Error(
        "El horario de salida debe ser mayor al horario de entrada",
      );
      error.statusCode = 400;
      throw error;
    }

    const createdAttendanceSchedule = await prisma.attendanceSchedule.create({
      data: {
        weekDay,
        startTime,
        endTime,
        storeId: req.store.id,
        status: ScheduleStatus.Active,
      },
    });

    res.status(201).json({
      data: createdAttendanceSchedule,
      message: "Horario de tienda creado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const updateAttendanceSchedule = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);
    const { weekDay, startTime, endTime } = req.body;
    verifyFields({ weekDay });

    const verificarHorario = await prisma.attendanceSchedule.findFirst({
      where: {
        weekDay,
        storeId: req.store.id,
        id: { not: id },
        AND: [
          { startTime: { lt: endTime } }, // el existente empieza antes de que el nuevo termine
          { endTime: { gt: startTime } }, // el existente termina después de que el nuevo empiece
        ],
        status: ScheduleStatus.Active,
      },
    });

    if (verificarHorario) {
      res.status(400);
      throw new Error(
        "Ya existe un horario que se cruza con el horario ingresado",
      );
    }

    if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
      const error = new Error(
        "El horario de salida debe ser mayor al horario de entrada",
      );
      error.statusCode = 400;
      throw error;
    }

    const updatedAttendanceSchedule = await prisma.attendanceSchedule.create({
      data: {
        weekDay,
        startTime,
        endTime,
        storeId: req.store.id,
        status: ScheduleStatus.Active,
      },
    });

    res.status(201).json({
      data: updatedAttendanceSchedule,
      message: "Horario de tienda actualizado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAttendanceSchedule = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const attendanceSchedule = await prisma.attendanceSchedule.findFirst({
      where: { id, storeId: req.store.id },
    });
    if (!attendanceSchedule) {
      const error = new Error("Horario de tienda no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const deletedAttendanceSchedule = await prisma.attendanceSchedule.update({
      where: { id },
      data: { status: ScheduleStatus.Inactive },
    });

    res.json({
      data: deletedStoreCategory,
      message: "Horairo de atencion eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const restoreAttendanceSchedule = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    verifyNumberID(id);

    const attendanceSchedule = await prisma.attendanceSchedule.findUnique({
      where: { id, storeId: req.store.id },
    });
    if (!attendanceSchedule) {
      const error = new Error("Horario de atencion no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const restoredAttendanceSchedule = await prisma.attendanceSchedule.update({
      where: { id },
      data: { status: ScheduleStatus.Active },
    });

    res.json({
      data: restoredAttendanceSchedule,
      message: "Horario de atencion restablecido correctamente",
    });
  } catch (error) {
    next(error);
  }
};
