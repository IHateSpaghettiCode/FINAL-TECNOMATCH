-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `apellido` VARCHAR(50) NOT NULL,
    `nombre_completo` VARCHAR(255) NULL,
    `nombre_usuario` VARCHAR(50) NOT NULL,
    `correo` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `fecha_nacimiento` DATE NULL,
    `rol_id` INTEGER NULL DEFAULT 2,
    `estado` TINYINT NULL DEFAULT 1,
    `profileImage` LONGTEXT NULL,
    `intentos_fallidos` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `confirmation_token` VARCHAR(255) NULL,
    `confirmed` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `correo`(`correo`),
    INDEX `rol_id`(`rol_id`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `universidades` (
    `id_universidad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_universidad` VARCHAR(100) NOT NULL,
    `ciudad` VARCHAR(50) NOT NULL,
    `snies` VARCHAR(20) NULL,

    UNIQUE INDEX `snies`(`snies`),
    PRIMARY KEY (`id_universidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carreras` (
    `id_carrera` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_carrera` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(255) NULL,
    `descripcion` TEXT NULL,
    `objetivo` TEXT NULL,
    `duracion` VARCHAR(50) NULL,
    `estado` ENUM('activa', 'inactiva') NULL DEFAULT 'activa',
    `fecha_creacion` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_universidad` INTEGER NOT NULL,

    UNIQUE INDEX `slug`(`slug`),
    INDEX `id_universidad`(`id_universidad`),
    PRIMARY KEY (`id_carrera`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfilespsicologicos` (
    `id_perfil` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_perfil` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,

    PRIMARY KEY (`id_perfil`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resultados_test` (
    `id_resultado` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_perfil` INTEGER NOT NULL,
    `fecha` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_perfil`(`id_perfil`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_resultado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recomendaciones` (
    `id_recomendacion` INTEGER NOT NULL AUTO_INCREMENT,
    `id_resultado` INTEGER NOT NULL,
    `id_carrera` INTEGER NOT NULL,
    `id_universidad` INTEGER NOT NULL,
    `tipo` VARCHAR(50) NULL DEFAULT 'perfil',
    `fecha_generacion` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_carrera`(`id_carrera`),
    INDEX `id_resultado`(`id_resultado`),
    INDEX `id_universidad`(`id_universidad`),
    PRIMARY KEY (`id_recomendacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auditoria_usuarios` (
    `id_auditoria` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `accion` VARCHAR(50) NOT NULL,
    `fecha` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_auditoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `universidades_vistas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_universidad` INTEGER NOT NULL,
    `fecha` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_universidad`(`id_universidad`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carreras_vistas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_carrera` INTEGER NOT NULL,
    `fecha` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_carrera`(`id_carrera`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carreras` ADD CONSTRAINT `carreras_ibfk_1` FOREIGN KEY (`id_universidad`) REFERENCES `universidades`(`id_universidad`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resultados_test` ADD CONSTRAINT `resultados_test_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resultados_test` ADD CONSTRAINT `resultados_test_ibfk_2` FOREIGN KEY (`id_perfil`) REFERENCES `perfilespsicologicos`(`id_perfil`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recomendaciones` ADD CONSTRAINT `recomendaciones_ibfk_1` FOREIGN KEY (`id_resultado`) REFERENCES `resultados_test`(`id_resultado`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recomendaciones` ADD CONSTRAINT `recomendaciones_ibfk_2` FOREIGN KEY (`id_carrera`) REFERENCES `carreras`(`id_carrera`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recomendaciones` ADD CONSTRAINT `recomendaciones_ibfk_3` FOREIGN KEY (`id_universidad`) REFERENCES `universidades`(`id_universidad`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auditoria_usuarios` ADD CONSTRAINT `auditoria_usuarios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `universidades_vistas` ADD CONSTRAINT `universidades_vistas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `universidades_vistas` ADD CONSTRAINT `universidades_vistas_ibfk_2` FOREIGN KEY (`id_universidad`) REFERENCES `universidades`(`id_universidad`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carreras_vistas` ADD CONSTRAINT `carreras_vistas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carreras_vistas` ADD CONSTRAINT `carreras_vistas_ibfk_2` FOREIGN KEY (`id_carrera`) REFERENCES `carreras`(`id_carrera`) ON DELETE CASCADE ON UPDATE CASCADE;
