import prisma from "../../prismaClient.js";

export async function seedAttendanceSchedules() {
  const stores = await prisma.store.findMany();

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  for (const store of stores) {
    for (const day of weekDays) {
      await prisma.attendanceSchedule.create({
        data: {
          weekDay: day,
          startTime: new Date("1970-01-01T08:00:00"),
          endTime: new Date("1970-01-01T18:00:00"),
          status: "Active",
          storeId: store.id,
        },
      });
    }

    await prisma.attendanceSchedule.create({
      data: {
        weekDay: "Saturday",
        startTime: new Date("1970-01-01T08:00:00"),
        endTime: new Date("1970-01-01T13:00:00"),
        status: "Active",
        storeId: store.id,
      },
    });
  }

  console.log("✅ Attendance schedules seeded");
}
