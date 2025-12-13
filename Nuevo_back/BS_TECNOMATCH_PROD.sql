-- =====================================================
-- BASE DE DATOS TECNOMATCH (PRODUCCIÓN - RAILWAY)
-- =====================================================
-- La base de datos YA existe (gestionada por Railway)
-- NO se crea ni se elimina aquí
-- =====================================================

-- ======================
-- TABLA ROLES
-- ======================
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- ======================
-- TABLA USUARIOS
-- ======================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nombre_completo VARCHAR(255)
        GENERATED ALWAYS AS (CONCAT(nombre, ' ', apellido)) STORED,
    nombre_usuario VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    rol_id INT NULL DEFAULT 2,
    estado TINYINT DEFAULT 1,
    profileImage LONGTEXT,
    intentos_fallidos INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmation_token VARCHAR(255) DEFAULT NULL,
    confirmed TINYINT(1) DEFAULT 0,
    FOREIGN KEY (rol_id)
        REFERENCES roles(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ======================
-- TRIGGERS USUARIOS
-- ======================
DELIMITER //
CREATE TRIGGER before_usuario_insert
BEFORE INSERT ON usuarios
FOR EACH ROW
BEGIN
    SET NEW.nombre = UPPER(NEW.nombre);
    SET NEW.apellido = UPPER(NEW.apellido);
    SET NEW.nombre_usuario = UPPER(NEW.nombre_usuario);
    SET NEW.correo = UPPER(NEW.correo);
    SET NEW.telefono = UPPER(NEW.telefono);
END;
//

CREATE TRIGGER before_usuario_update
BEFORE UPDATE ON usuarios
FOR EACH ROW
BEGIN
    SET NEW.nombre = UPPER(NEW.nombre);
    SET NEW.apellido = UPPER(NEW.apellido);
    SET NEW.nombre_usuario = UPPER(NEW.nombre_usuario);
    SET NEW.correo = UPPER(NEW.correo);
    SET NEW.telefono = UPPER(NEW.telefono);
END;
//
DELIMITER ;

-- ======================
-- TABLA UNIVERSIDADES
-- ======================
CREATE TABLE IF NOT EXISTS universidades (
  id_universidad INT AUTO_INCREMENT PRIMARY KEY,
  nombre_universidad VARCHAR(100) NOT NULL,
  ciudad VARCHAR(50) NOT NULL,
  snies VARCHAR(20) UNIQUE
) ENGINE=InnoDB;

-- ======================
-- TABLA CARRERAS
-- ======================
CREATE TABLE IF NOT EXISTS carreras (
  id_carrera INT AUTO_INCREMENT PRIMARY KEY,
  nombre_carrera VARCHAR(100) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  id_universidad INT NOT NULL,
  FOREIGN KEY (id_universidad)
      REFERENCES universidades(id_universidad)
      ON UPDATE CASCADE
      ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================
-- TRIGGERS UNIVERSIDADES
-- ======================
DELIMITER //
CREATE TRIGGER before_universidad_insert
BEFORE INSERT ON universidades
FOR EACH ROW
BEGIN
    SET NEW.nombre_universidad = UPPER(NEW.nombre_universidad);
    SET NEW.ciudad = UPPER(NEW.ciudad);
END;
//

CREATE TRIGGER before_universidad_update
BEFORE UPDATE ON universidades
FOR EACH ROW
BEGIN
    SET NEW.nombre_universidad = UPPER(NEW.nombre_universidad);
    SET NEW.ciudad = UPPER(NEW.ciudad);
END;
//
DELIMITER ;

-- ======================
-- TRIGGERS CARRERAS
-- ======================
DELIMITER //
CREATE TRIGGER before_carrera_insert
BEFORE INSERT ON carreras
FOR EACH ROW
BEGIN
    SET NEW.nombre_carrera = UPPER(NEW.nombre_carrera);
END;
//

CREATE TRIGGER before_carrera_update
BEFORE UPDATE ON carreras
FOR EACH ROW
BEGIN
    SET NEW.nombre_carrera = UPPER(NEW.nombre_carrera);
END;
//
DELIMITER ;

-- ======================
-- TABLA PERFILES PSICOLÓGICOS
-- ======================
CREATE TABLE IF NOT EXISTS perfilespsicologicos (
  id_perfil INT AUTO_INCREMENT PRIMARY KEY,
  nombre_perfil VARCHAR(100) NOT NULL,
  descripcion TEXT
) ENGINE=InnoDB;

-- ======================
-- TABLA RESULTADOS TEST
-- ======================
CREATE TABLE IF NOT EXISTS resultados_test (
  id_resultado INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_perfil INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id_usuario)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
  FOREIGN KEY (id_perfil)
      REFERENCES perfilespsicologicos(id_perfil)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ======================
-- TABLA RECOMENDACIONES
-- ======================
CREATE TABLE IF NOT EXISTS recomendaciones (
  id_recomendacion INT AUTO_INCREMENT PRIMARY KEY,
  id_resultado INT NOT NULL,
  id_carrera INT NOT NULL,
  id_universidad INT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'perfil',
  fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_resultado)
      REFERENCES resultados_test(id_resultado)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
  FOREIGN KEY (id_carrera)
      REFERENCES carreras(id_carrera)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
  FOREIGN KEY (id_universidad)
      REFERENCES universidades(id_universidad)
      ON UPDATE CASCADE
      ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================
-- TABLA AUDITORÍA USUARIOS
-- ======================
CREATE TABLE IF NOT EXISTS auditoria_usuarios (
  id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  accion VARCHAR(50) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id_usuario)
      ON UPDATE CASCADE
      ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================
-- TABLA UNIVERSIDADES VISTAS
-- ======================
CREATE TABLE IF NOT EXISTS universidades_vistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_universidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (id_universidad)
        REFERENCES universidades(id_universidad)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================
-- TABLA CARRERAS VISTAS
-- ======================
CREATE TABLE IF NOT EXISTS carreras_vistas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_carrera INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id_usuario)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
  FOREIGN KEY (id_carrera)
      REFERENCES carreras(id_carrera)
      ON UPDATE CASCADE
      ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================
-- PROCEDIMIENTO INSERTAR USUARIO
-- ======================
DELIMITER //
CREATE PROCEDURE insertar_usuario (
    IN p_nombre VARCHAR(50),
    IN p_apellido VARCHAR(50),
    IN p_usuario VARCHAR(50),
    IN p_correo VARCHAR(100),
    IN p_password_plain VARCHAR(255),
    IN p_telefono VARCHAR(20),
    IN p_fecha_nacimiento DATE,
    IN p_rol_id INT
)
BEGIN
    INSERT INTO usuarios (
        nombre,
        apellido,
        nombre_usuario,
        correo,
        password,
        telefono,
        fecha_nacimiento,
        rol_id,
        confirmed
    ) VALUES (
        UPPER(p_nombre),
        UPPER(p_apellido),
        UPPER(p_usuario),
        UPPER(p_correo),
        SHA2(p_password_plain, 256),
        UPPER(p_telefono),
        p_fecha_nacimiento,
        p_rol_id,
        1
    );
END;
//
DELIMITER ;

-- ======================
-- TRIGGER AUDITORÍA
-- ======================
DELIMITER //
CREATE TRIGGER after_usuario_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_usuarios (id_usuario, accion)
    VALUES (NEW.id_usuario, 'CREACIÓN DE USUARIO');
END;
//
DELIMITER ;

-- ======================
-- ROLES BASE
-- ======================
INSERT INTO roles (nombre)
VALUES ('ADMINISTRADOR')
ON DUPLICATE KEY UPDATE nombre = nombre;

INSERT INTO roles (nombre)
VALUES ('USUARIO')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- ======================
-- USUARIO ADMIN INICIAL
-- ======================
INSERT INTO usuarios (
    nombre,
    apellido,
    nombre_usuario,
    correo,
    password,
    telefono,
    fecha_nacimiento,
    rol_id,
    confirmed
)
SELECT
    'ADMIN',
    'SISTEMA',
    'ADMIN',
    'ADMIN@TECNOMATCH.COM',
    SHA2('Admin@123', 256),
    '0000000000',
    '1990-01-01',
    1,
    1
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE correo = 'ADMIN@TECNOMATCH.COM'
);

-- =====================================================
-- FIN DEL SCRIPT DE PRODUCCIÓN
-- =====================================================
