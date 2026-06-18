-- CreateTable
CREATE TABLE `product_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `status` ENUM('Activo', 'Inactivo') NOT NULL,

    UNIQUE INDEX `product_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `status` ENUM('Activo', 'Inactivo') NOT NULL,

    UNIQUE INDEX `store_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movement_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `movementId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitCost` DECIMAL(10, 2) NOT NULL,

    INDEX `movement_details_movementId_idx`(`movementId`),
    INDEX `movement_details_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` DECIMAL(10, 4) NOT NULL,
    `unitPrice` DECIMAL(10, 4) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,

    INDEX `sale_details_productId_idx`(`productId`),
    INDEX `sale_details_saleId_idx`(`saleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weekDay` ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    `startTime` TIME(0) NOT NULL,
    `endTime` TIME(0) NOT NULL,
    `status` ENUM('Activo', 'Inactivo') NOT NULL,
    `storeId` INTEGER NOT NULL,

    INDEX `attendance_schedules_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestampUtc` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `eventActionType` VARCHAR(45) NOT NULL,
    `userId` INTEGER NOT NULL,
    `clientIp` VARCHAR(45) NOT NULL,
    `resourceType` VARCHAR(45) NOT NULL,
    `resourceId` INTEGER NOT NULL,
    `previousValue` LONGTEXT NULL,
    `newValue` LONGTEXT NULL,
    `description` VARCHAR(45) NOT NULL,
    `status` ENUM('Activo', 'Inactivo') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0) NOT NULL,
    `status` ENUM('Activo', 'Cancelada') NOT NULL,
    `type` ENUM('Entrada', 'Salida', 'Ajuste-Entrada', 'Ajuste-Salida') NOT NULL,
    `reason` TEXT NULL,
    `supplierId` INTEGER NULL,
    `userId` INTEGER NOT NULL,
    `storeId` INTEGER NOT NULL,
    `cancellationDate` DATETIME(0) NULL,

    INDEX `movements_supplierId_idx`(`supplierId`),
    INDEX `movements_storeId_idx`(`storeId`),
    INDEX `movements_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `description` TEXT NULL,
    `referenceCode` VARCHAR(45) NULL,
    `lowStockThreshold` INTEGER NOT NULL DEFAULT 5,
    `photo` VARCHAR(255) NULL,
    `currentStock` INTEGER NOT NULL,
    `status` ENUM('Activo', 'Inactivo') NOT NULL,
    `productCategoryId` INTEGER NOT NULL,
    `unitOfMeasureId` INTEGER NOT NULL,
    `storeId` INTEGER NOT NULL,
    `deactivationDate` DATETIME(0) NULL,

    INDEX `products_productCategoryId_idx`(`productCategoryId`),
    INDEX `products_storeId_idx`(`storeId`),
    INDEX `products_unitOfMeasureId_idx`(`unitOfMeasureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `phone` VARCHAR(45) NOT NULL,
    `status` ENUM('Activo', 'Inactivo') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `status` ENUM('Activo', 'Inactivo') NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `longitude` DECIMAL(10, 8) NOT NULL,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `description` TEXT NULL,
    `logo` VARCHAR(200) NULL,
    `phone` VARCHAR(45) NULL,
    `status` ENUM('Activo', 'Inactivo', 'Pendiente', 'Incompleto', 'Rechazado') NOT NULL,
    `userId` INTEGER NOT NULL,
    `storeCategoryId` INTEGER NOT NULL,
    `onboardingStep` VARCHAR(45) NOT NULL,

    INDEX `stores_storeCategoryId_idx`(`storeCategoryId`),
    INDEX `stores_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `units_of_measure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `status` ENUM('Activo', 'Inactivo') NOT NULL,

    UNIQUE INDEX `units_of_measure_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(250) NOT NULL,
    `phone` VARCHAR(45) NOT NULL,
    `status` ENUM('Activo', 'Inactivo') NOT NULL,
    `roleId` INTEGER NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_roleId_idx`(`roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('Completada', 'Cancelada') NOT NULL,
    `userId` INTEGER NOT NULL,
    `storeId` INTEGER NOT NULL,
    `cancellationReason` TEXT NULL,
    `cancellationDate` DATETIME(0) NULL,

    INDEX `sales_storeId_idx`(`storeId`),
    INDEX `sales_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `movement_details` ADD CONSTRAINT `movement_details_movementId_fkey` FOREIGN KEY (`movementId`) REFERENCES `movements`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `movement_details` ADD CONSTRAINT `movement_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sale_details` ADD CONSTRAINT `sale_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sale_details` ADD CONSTRAINT `sale_details_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `sales`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attendance_schedules` ADD CONSTRAINT `attendance_schedules_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `movements` ADD CONSTRAINT `movements_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `movements` ADD CONSTRAINT `movements_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `movements` ADD CONSTRAINT `movements_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_productCategoryId_fkey` FOREIGN KEY (`productCategoryId`) REFERENCES `product_categories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_unitOfMeasureId_fkey` FOREIGN KEY (`unitOfMeasureId`) REFERENCES `units_of_measure`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `stores` ADD CONSTRAINT `stores_storeCategoryId_fkey` FOREIGN KEY (`storeCategoryId`) REFERENCES `store_categories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `stores` ADD CONSTRAINT `stores_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
