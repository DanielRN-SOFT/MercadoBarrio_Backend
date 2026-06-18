import prisma from "../prismaClient.js";

import { seedRoles } from "./seeders/roleSeeder.js";
import { seedStoreCategories } from "./seeders/storeCategorySeeder.js";
import { seedProductCategories } from "./seeders/productCategorySeeder.js";
import { seedUnitsOfMeasure } from "./seeders/unitOfMeasureSeeder.js";
import { seedSuppliers } from "./seeders/supplierSeeder.js";
import { seedUsers } from "./seeders/userSeeder.js";
import { seedStores } from "./seeders/storeSeeder.js";
import { seedAttendanceSchedules } from "./seeders/attendanceScheduleSeeder.js";
import { seedProducts } from "./seeders/productSeeder.js";
import { seedMovements } from "./seeders/movementSeeder.js";
import { seedSales } from "./seeders/saleSeeder.js";
import { seedAuditLogs } from "./seeders/auditLogSeeder.js";


async function main() {
  console.log("🌱 Starting seed...\n");

  await seedRoles();
  await seedStoreCategories();
  await seedProductCategories();
  await seedUnitsOfMeasure();
  await seedSuppliers();
  await seedUsers();
  await seedStores();
  await seedAttendanceSchedules();
  await seedProducts();
  await seedMovements();
  await seedSales();
  await seedAuditLogs();

  console.log("\n🎉 Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
