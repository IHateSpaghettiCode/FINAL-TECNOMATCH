-- BASE DE DATOS TECNOMATCH (Fusionada)
DROP DATABASE IF EXISTS tecnomatch;
CREATE DATABASE tecnomatch CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE tecnomatch;

-- TABLA ROLES
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- TABLA USUARIOS
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nombre_completo VARCHAR(255) GENERATED ALWAYS AS (CONCAT(nombre, ' ', apellido)) STORED,
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
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- TRIGGERS PARA USUARIOS (MAYÚSCULAS)
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

-- =====================================
-- TABLAS UNIVERSIDADES Y CARRERAS
-- =====================================
CREATE TABLE universidades (
  id_universidad INT AUTO_INCREMENT PRIMARY KEY,
  nombre_universidad VARCHAR(100) NOT NULL,
  ciudad VARCHAR(50) NOT NULL,
  snies VARCHAR(20) UNIQUE
) ENGINE=InnoDB;

CREATE TABLE carreras (
  id_carrera INT AUTO_INCREMENT PRIMARY KEY,
  nombre_carrera VARCHAR(100) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  id_universidad INT NOT NULL,
  FOREIGN KEY (id_universidad) REFERENCES universidades(id_universidad)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================
-- TRIGGERS PARA UNIVERSIDADES Y CARRERAS
-- =====================================
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

-- =====================================
-- TABLA PERFILES PSICOLÓGICOS
-- =====================================
CREATE TABLE perfilespsicologicos (
  id_perfil INT AUTO_INCREMENT PRIMARY KEY,
  nombre_perfil VARCHAR(100) NOT NULL,
  descripcion TEXT
) ENGINE=InnoDB;

-- =====================================
-- TABLA RESULTADOS DEL TEST
-- =====================================
CREATE TABLE resultados_test (
  id_resultado INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_perfil INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_perfil) REFERENCES perfilespsicologicos(id_perfil)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =====================================
-- TABLA RECOMENDACIONES
-- =====================================
CREATE TABLE recomendaciones (
  id_recomendacion INT AUTO_INCREMENT PRIMARY KEY,
  id_resultado INT NOT NULL,
  id_carrera INT NOT NULL,
  id_universidad INT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'perfil',
  fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_resultado) REFERENCES resultados_test(id_resultado)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_universidad) REFERENCES universidades(id_universidad)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================
-- TABLA AUDITORÍA DE USUARIOS
-- =====================================
CREATE TABLE auditoria_usuarios (
  id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  accion VARCHAR(50) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- =====================================
-- TABLA HISTORIAL UNIVERSIDADES VISTAS
-- =====================================
CREATE TABLE universidades_vistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_universidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_universidad) REFERENCES universidades(id_universidad)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================
-- TABLA HISTORIAL DE VISTAS DE CARRERAS
-- =====================================
CREATE TABLE carreras_vistas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_carrera INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================
-- PROCEDIMIENTO PARA INSERTAR USUARIOS (MAYÚSCULAS)
-- =====================================
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
        rol_id
    ) VALUES (
        UPPER(p_nombre),
        UPPER(p_apellido),
        UPPER(p_usuario),
        UPPER(p_correo),
        SHA2(p_password_plain, 256),
        UPPER(p_telefono),
        p_fecha_nacimiento,
        p_rol_id
    );
END;
//
DELIMITER ;

-- =====================================
-- TRIGGER AUDITORÍA DE USUARIOS
-- =====================================
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

-- =====================================
-- INSERTAR DATOS DE PRUEBA
-- =====================================
INSERT INTO roles (nombre) VALUES ('ADMINISTRADOR'), ('USUARIO');

CALL insertar_usuario('Luis', 'Pérez', 'usua1', 'luis@gmail.com', '12345', '3001112233', '1990-01-01', 1);
CALL insertar_usuario('Ana', 'Gómez', 'ana99', 'ana@gmail.com', '12345', '3001112244', '1995-05-12', 2);
CALL insertar_usuario('Carlos', 'Rivas', 'crivas', 'carlos@gmail.com', '12345', '3001112255', '1992-03-08', 2);
CALL insertar_usuario('Juan', 'Pérez', 'juanp', 'juan@gmail.com', '12345', '3001112266', '1993-04-10', 2);
CALL insertar_usuario('María', 'García', 'mariag', 'maria@gmail.com', '12345', '3001112277', '1994-09-25', 2);
CALL insertar_usuario('Admin', 'Extra', 'admin2', 'admin2@gmail.com', 'admin123', '3000000000', '1980-01-01', 1);

INSERT INTO universidades (nombre_universidad, ciudad, snies) VALUES
('UNIVERSIDAD SERGIO ARBOLEDA', 'BOGOTÁ', '1728'),
('UNIVERSIDAD NACIONAL DE COLOMBIA', 'BOGOTÁ', '1101'),
('UNIVERSIDAD DE LOS ANDES', 'BOGOTÁ', '1816'),
('PONTIFICIA UNIVERSIDAD JAVERIANA', 'BOGOTÁ', '953'),
('UNIVERSIDAD JORGE TADEO LOZANO', 'BOGOTÁ', NULL),
('UNIVERSIDAD EXTERNADO DE COLOMBIA', 'BOGOTÁ', NULL),
('POLITÉCNICO GRANCOLOMBIANO', 'BOGOTÁ', NULL),
('UNIVERSIDAD CENTRAL', 'BOGOTÁ', NULL);

INSERT INTO carreras (nombre_carrera, id_universidad) VALUES
('INGENIERÍA DE SISTEMAS', 1),
('DISEÑO INTERACTIVO', 2),
('ADMINISTRACIÓN EN REDES', 3),
('SEGURIDAD INFORMÁTICA', 1);

INSERT INTO perfilespsicologicos (nombre_perfil) VALUES
('ENFJ'), ('ENFP'), ('ENTJ'), ('ENTP'), ('ESFJ'), ('ESFP'), ('ESTJ'), ('ESTP'),
('INFJ'), ('INFP'), ('INTJ'), ('INTP'), ('ISFJ'), ('ISFP'), ('ISTJ'), ('ISTP');

INSERT INTO resultados_test (id_usuario, id_perfil) VALUES
(1, 1), (2, 2), (3, 3), (4, 1), (5, 2);

INSERT INTO recomendaciones (id_resultado, id_carrera, id_universidad, tipo) VALUES
(1, 1, 1, 'PERFIL'),
(2, 2, 2, 'PERFIL'),
(3, 3, 3, 'PERFIL'),
(4, 4, 1, 'PERFIL'),
(5, 1, 1, 'PERFIL');

-- =====================================
-- VISTAS
-- =====================================
CREATE OR REPLACE VIEW vista_universidades_vistas AS
SELECT
    uv.id,
    u.id_usuario,
    UPPER(u.nombre_usuario) AS nombre_usuario,
    un.id_universidad,
    UPPER(un.nombre_universidad) AS nombre_universidad,
    UPPER(un.ciudad) AS ciudad,
    uv.fecha AS fecha_vista
FROM universidades_vistas uv
JOIN usuarios u ON uv.id_usuario = u.id_usuario
JOIN universidades un ON uv.id_universidad = un.id_universidad
ORDER BY uv.fecha DESC;

CREATE OR REPLACE VIEW vista_recomendaciones AS
SELECT
    UPPER(u.nombre_usuario) AS estudiante,
    UPPER(u.nombre_completo) AS nombre_completo,
    p.nombre_perfil,
    UPPER(ca.nombre_carrera) AS nombre_carrera,
    UPPER(un.nombre_universidad) AS nombre_universidad,
    r.fecha_generacion,
    r.tipo
FROM usuarios u
JOIN resultados_test rt ON u.id_usuario = rt.id_usuario
JOIN perfilespsicologicos p ON rt.id_perfil = p.id_perfil
JOIN recomendaciones r ON rt.id_resultado = r.id_resultado
JOIN carreras ca ON r.id_carrera = ca.id_carrera
JOIN universidades un ON r.id_universidad = un.id_universidad;

CREATE OR REPLACE VIEW vista_usuarios_completa AS
SELECT
    u.id_usuario,
    UPPER(u.nombre_completo) AS nombre_completo,
    UPPER(u.nombre_usuario) AS nombre_usuario,
    UPPER(u.correo) AS correo,
    p.nombre_perfil,
    UPPER(c.nombre_carrera) AS nombre_carrera,
    UPPER(un.nombre_universidad) AS nombre_universidad,
    r.fecha_generacion AS fecha_recomendacion
FROM usuarios u
LEFT JOIN resultados_test rt ON u.id_usuario = rt.id_usuario
LEFT JOIN perfilespsicologicos p ON rt.id_perfil = p.id_perfil
LEFT JOIN recomendaciones r ON rt.id_resultado = r.id_resultado
LEFT JOIN carreras c ON r.id_carrera = c.id_carrera
LEFT JOIN universidades un ON r.id_universidad = un.id_universidad;

-- =====================================
-- USUARIO MYSQL
-- =====================================
DROP USER IF EXISTS 'tecnomatch'@'localhost';
CREATE USER 'tecnomatch'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON tecnomatch.* TO 'tecnomatch'@'localhost';
FLUSH PRIVILEGES;
SELECT * FROM usuarios;
