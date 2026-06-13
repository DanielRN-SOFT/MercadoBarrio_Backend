-- CreateTable
CREATE TABLE `categoria_producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `estado` ENUM('Activo', 'Inactivo') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria_tienda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `estado` ENUM('Activo', 'Inactivo') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalle_movimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productos_id` INTEGER NOT NULL,
    `movimientos_id` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `costo_unitario` DECIMAL(10, 2) NOT NULL,

    INDEX `fk_detalle_entrada_entradas1_idx`(`movimientos_id`),
    INDEX `fk_detalle_entrada_productos1_idx`(`productos_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalle_venta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ventas_id` INTEGER NOT NULL,
    `productos_id` INTEGER NOT NULL,
    `cantidad` DECIMAL(10, 4) NOT NULL,
    `precio_unit` DECIMAL(10, 4) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,

    INDEX `fk_detalle_venta_productos1_idx`(`productos_id`),
    INDEX `fk_detalle_venta_ventas1_idx`(`ventas_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `horarios_atencion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dia_semana` ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    `hora_inicio` TIME(0) NOT NULL,
    `hora_fin` TIME(0) NOT NULL,
    `estado` ENUM('Activo', 'Inactivo') NOT NULL,
    `tiendas_id` INTEGER NOT NULL,

    INDEX `fk_horarios_atencion_tiendas1_idx`(`tiendas_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_auditoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp_utc` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `tipo_evento_accion` VARCHAR(45) NOT NULL,
    `usuarios_id` INTEGER NOT NULL,
    `ip_cliente` VARCHAR(45) NOT NULL,
    `recurso_tipo` VARCHAR(45) NOT NULL,
    `recurso_id` INTEGER NOT NULL,
    `valor_anterior` LONGTEXT NULL,
    `valor_nuevo` LONGTEXT NULL,
    `descripcion` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movimientos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(0) NOT NULL,
    `estado` ENUM('Activo', 'Cancelada') NOT NULL,
    `tipo` ENUM('Entrada', 'Salida', 'Ajuste-Entrada', 'Ajuste-Salida') NOT NULL,
    `motivo` TEXT NULL,
    `proveedores_id` INTEGER NULL,
    `usuarios_id` INTEGER NOT NULL,
    `tiendas_id` INTEGER NOT NULL,
    `fecha_cancelacion` DATETIME(0) NULL,

    INDEX `fk_entradas_proveedores1_idx`(`proveedores_id`),
    INDEX `fk_movimientos_tiendas1_idx`(`tiendas_id`),
    INDEX `fk_movimientos_usuarios1_idx`(`usuarios_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `descripcion` TEXT NULL,
    `codigo_referencia` VARCHAR(45) NULL,
    `stock_bajo_apartir_de` INTEGER NOT NULL DEFAULT 5,
    `foto` VARCHAR(255) NULL,
    `stock_actual` INTEGER NOT NULL,
    `estado` ENUM('Activo', 'Inactivo') NOT NULL,
    `categoria_producto_id` INTEGER NOT NULL,
    `unidad_medida_id` INTEGER NOT NULL,
    `tiendas_id` INTEGER NOT NULL,
    `fecha_desactivacion` DATETIME(0) NULL,

    INDEX `fk_productos_categoria_producto1_idx`(`categoria_producto_id`),
    INDEX `fk_productos_tiendas1_idx`(`tiendas_id`),
    INDEX `fk_productos_unidad_medida1_idx`(`unidad_medida_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proveedores` (
    `id` INTEGER NOT NULL,
    `nombre` VARCHAR(45) NOT NULL,
    `telefono` VARCHAR(45) NOT NULL,
    `estado` ENUM('Activo', 'Inactivo') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tiendas` (
    `id` INTEGER NOT NULL,
    `nombre` VARCHAR(45) NOT NULL,
    `direccion` VARCHAR(100) NOT NULL,
    `longitud` DECIMAL(10, 8) NOT NULL,
    `latitud` DECIMAL(10, 8) NOT NULL,
    `descripcion` TEXT NULL,
    `logo` VARCHAR(200) NULL,
    `telefono` VARCHAR(45) NULL,
    `estado` ENUM('Activo', 'Inactivo', 'Pendiente', 'Incompleto', 'Rechazado') NOT NULL,
    `usuarios_id` INTEGER NOT NULL,
    `categoria_tienda_id` INTEGER NOT NULL,
    `on_boarding_paso` VARCHAR(45) NOT NULL,

    INDEX `fk_tiendas_categoria_tienda1_idx`(`categoria_tienda_id`),
    INDEX `fk_tiendas_usuarios1_idx`(`usuarios_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unidad_medida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `estado` ENUM('Activo', 'Inactivo') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(250) NOT NULL,
    `telefono` VARCHAR(45) NOT NULL,
    `estado` ENUM('Activo', 'Inactivo') NOT NULL,
    `roles_id` INTEGER NOT NULL,

    INDEX `fk_usuarios_roles_idx`(`roles_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ventas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(0) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `estado` ENUM('Completada', 'Cancelada') NOT NULL,
    `usuarios_id` INTEGER NOT NULL,
    `tiendas_id` INTEGER NOT NULL,
    `motivo_cancelacion` TEXT NULL,
    `fecha_cancelacion` DATETIME(0) NULL,

    INDEX `fk_ventas_tiendas1_idx`(`tiendas_id`),
    INDEX `fk_ventas_usuarios1_idx`(`usuarios_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detalle_movimiento` ADD CONSTRAINT `fk_detalle_entrada_entradas1` FOREIGN KEY (`movimientos_id`) REFERENCES `movimientos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detalle_movimiento` ADD CONSTRAINT `fk_detalle_entrada_productos1` FOREIGN KEY (`productos_id`) REFERENCES `productos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detalle_venta` ADD CONSTRAINT `fk_detalle_venta_productos1` FOREIGN KEY (`productos_id`) REFERENCES `productos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detalle_venta` ADD CONSTRAINT `fk_detalle_venta_ventas1` FOREIGN KEY (`ventas_id`) REFERENCES `ventas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `horarios_atencion` ADD CONSTRAINT `fk_horarios_atencion_tiendas1` FOREIGN KEY (`tiendas_id`) REFERENCES `tiendas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `movimientos` ADD CONSTRAINT `fk_entradas_proveedores1` FOREIGN KEY (`proveedores_id`) REFERENCES `proveedores`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `movimientos` ADD CONSTRAINT `fk_movimientos_tiendas1` FOREIGN KEY (`tiendas_id`) REFERENCES `tiendas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `movimientos` ADD CONSTRAINT `fk_movimientos_usuarios1` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_categoria_producto1` FOREIGN KEY (`categoria_producto_id`) REFERENCES `categoria_producto`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_tiendas1` FOREIGN KEY (`tiendas_id`) REFERENCES `tiendas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_unidad_medida1` FOREIGN KEY (`unidad_medida_id`) REFERENCES `unidad_medida`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tiendas` ADD CONSTRAINT `fk_tiendas_categoria_tienda1` FOREIGN KEY (`categoria_tienda_id`) REFERENCES `categoria_tienda`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tiendas` ADD CONSTRAINT `fk_tiendas_usuarios1` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`roles_id`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ventas` ADD CONSTRAINT `fk_ventas_tiendas1` FOREIGN KEY (`tiendas_id`) REFERENCES `tiendas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ventas` ADD CONSTRAINT `fk_ventas_usuarios1` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
