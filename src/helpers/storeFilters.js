// helpers/storeFilters.js
export const buildStoreWhere = ({
  name,
  neighborhood,
  storeCategoryId,
  openNow,
}) => {
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
  currentTime.setFullYear(1970, 0, 1);

  return {
    status: "Active",
    ...(name && { name: { contains: name } }),
    ...(neighborhood && { neighborhood: { contains: neighborhood } }),
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
};

export const storeSelect = {
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
  storeCategory: { select: { id: true, name: true } },
  schedules: {
    select: {
      id: true,
      weekDay: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  },
};
