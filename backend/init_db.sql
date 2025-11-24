-- Script de creacion de tablas y poblacion de datos
-- Generado automaticamente basado en los modelos y datos de backend/src
-- Adaptado para MySQL

USE sismografo;

-- ==========================================
-- Creacion de Tablas
-- ==========================================

CREATE TABLE IF NOT EXISTS Estado (
    id INTEGER NOT NULL AUTO_INCREMENT,
    ambito VARCHAR(50) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS EstacionSismologica (
    id INTEGER NOT NULL AUTO_INCREMENT,
    codigo_estacion VARCHAR(50) NOT NULL,
    latitud DECIMAL(10, 6) NOT NULL,
    longitud DECIMAL(10, 6) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Sismografo (
    id INTEGER NOT NULL AUTO_INCREMENT,
    fecha_adquisicion DATETIME NOT NULL,
    identificador VARCHAR(50) NOT NULL,
    nro_serie INTEGER NOT NULL,
    estado_id INTEGER,
    estacion_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (estado_id) REFERENCES Estado(id),
    FOREIGN KEY (estacion_id) REFERENCES EstacionSismologica(id)
);

CREATE TABLE IF NOT EXISTS TipoDeDato (
    id INTEGER NOT NULL AUTO_INCREMENT,
    denominacion VARCHAR(100) NOT NULL,
    nombre_unidad_medida VARCHAR(50) NOT NULL,
    valor_umbral DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Empleado (
    id INTEGER NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    mail VARCHAR(100) NOT NULL,
    telefono INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Usuario (
    id INTEGER NOT NULL AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    empleado_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (empleado_id) REFERENCES Empleado(id)
);

CREATE TABLE IF NOT EXISTS Sesion (
    id INTEGER NOT NULL AUTO_INCREMENT,
    usuario_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE IF NOT EXISTS OrigenDeGeneracion (
    id INTEGER NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS EventoSismico (
    id INTEGER NOT NULL AUTO_INCREMENT,
    identificador_evento VARCHAR(50),
    fecha_hora_ocurrencia DATETIME NOT NULL,
    latitud_epicentro DECIMAL(10, 6) NOT NULL,
    latitud_hipocentro DECIMAL(10, 6) NOT NULL,
    longitud_epicentro DECIMAL(10, 6) NOT NULL,
    longitud_hipocentro DECIMAL(10, 6) NOT NULL,
    valor_magnitud DECIMAL(5, 2) NOT NULL,
    profundidad DECIMAL(10, 2) NOT NULL,
    origen_id INTEGER,
    estado_actual_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (origen_id) REFERENCES OrigenDeGeneracion(id),
    FOREIGN KEY (estado_actual_id) REFERENCES Estado(id)
);

CREATE TABLE IF NOT EXISTS CambioEstado (
    id INTEGER NOT NULL AUTO_INCREMENT,
    fecha_hora_inicio DATETIME NOT NULL,
    fecha_hora_fin DATETIME,
    estado_id INTEGER NOT NULL,
    evento_sismico_id INTEGER NOT NULL,
    empleado_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (estado_id) REFERENCES Estado(id),
    FOREIGN KEY (evento_sismico_id) REFERENCES EventoSismico(id),
    FOREIGN KEY (empleado_id) REFERENCES Empleado(id)
);

CREATE TABLE IF NOT EXISTS SerieTemporal (
    id INTEGER NOT NULL AUTO_INCREMENT,
    fecha_hora_inicio_registro DATETIME NOT NULL,
    fecha_hora_registro DATETIME NOT NULL,
    frecuencia_muestreo INTEGER NOT NULL,
    condicion_alarma TINYINT(1) DEFAULT 0,
    sismografo_id INTEGER NOT NULL,
    evento_sismico_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (sismografo_id) REFERENCES Sismografo(id),
    FOREIGN KEY (evento_sismico_id) REFERENCES EventoSismico(id)
);

CREATE TABLE IF NOT EXISTS MuestraSismica (
    id INTEGER NOT NULL AUTO_INCREMENT,
    fecha_hora_muestra DATETIME NOT NULL,
    serie_temporal_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (serie_temporal_id) REFERENCES SerieTemporal(id)
);

CREATE TABLE IF NOT EXISTS DetalleMuestraSismica (
    id INTEGER NOT NULL AUTO_INCREMENT,
    valor DECIMAL(10, 2) NOT NULL,
    tipo_dato_id INTEGER NOT NULL,
    muestra_sismica_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (tipo_dato_id) REFERENCES TipoDeDato(id),
    FOREIGN KEY (muestra_sismica_id) REFERENCES MuestraSismica(id)
);

-- ==========================================
-- Insercion de Datos
-- ==========================================

-- 1. Estados
INSERT INTO Estado (id, ambito, nombre) VALUES 
(1, 'EventoSismico', 'auto_confirmado'),
(2, 'EventoSismico', 'auto_detectado'),
(3, 'EventoSismico', 'pendiente_de_revision'),
(4, 'EventoSismico', 'bloqueado_en_revision'),
(5, 'EventoSismico', 'confirmado'),
(6, 'EventoSismico', 'rechazado'),
(7, 'EventoSismico', 'derivado_experto'),
(8, 'Sismografo', 'en_linea');

-- 2. Estaciones Sismologicas
INSERT INTO EstacionSismologica (id, codigo_estacion, latitud, longitud, nombre) VALUES
(1, 'EST-001', -34.6037, -58.3816, 'Estacion 1'),
(2, 'EST-002', -31.4201, -64.1888, 'Estacion 2'),
(3, 'EST-003', -38.0055, -57.5426, 'Estacion 3');

-- 3. Sismografos
INSERT INTO Sismografo (id, fecha_adquisicion, identificador, nro_serie, estado_id, estacion_id) VALUES
(1, '2020-05-12', 'SIS-001', 12345, 8, 1),
(2, '2021-03-08', 'SIS-002', 54321, 8, 1),
(3, '2019-11-20', 'SIS-003', 67890, 8, 2);

-- 4. Tipos de Dato
INSERT INTO TipoDeDato (id, denominacion, nombre_unidad_medida, valor_umbral) VALUES
(1, 'Velocidad de onda', 'Km/seg', 8.0),
(2, 'Frecuencia de onda', 'Hz', 12.0),
(3, 'Longitud de onda', 'km/ciclo', 0.75);

-- 5. Empleados
INSERT INTO Empleado (id, nombre, apellido, mail, telefono) VALUES
(1, 'Juan', 'Perez', 'emp1@ccrs.con', 123123123),
(2, 'Juan', 'Perez', 'emp2@ccrs.con', 123123123),
(3, 'Juan', 'Perez', 'emp3@ccrs.con', 123123123);

-- 6. Usuarios
INSERT INTO Usuario (id, nombre_usuario, contrasena, empleado_id) VALUES
(1, 'juan1.p', '123abc', 1),
(2, 'juan2.p', '123abc', 2),
(3, 'juan3.p', '123abc', 3);

-- 6.1. Sesion (Usuario logueado: juan1.p)
INSERT INTO Sesion (id, usuario_id) VALUES
(1, 1);

-- 7. Origenes de Generacion
INSERT INTO OrigenDeGeneracion (id, nombre) VALUES
(1, 'interplaca'),
(2, 'volcanico'),
(3, 'explosiones_de_minas');

-- 8. Eventos Sismicos
-- Evento 1: Magnitud 3.9 -> auto_detectado (id 2)
INSERT INTO EventoSismico (id, identificador_evento, fecha_hora_ocurrencia, latitud_epicentro, latitud_hipocentro, longitud_epicentro, longitud_hipocentro, valor_magnitud, profundidad, origen_id, estado_actual_id) VALUES
(1, 'ES-001-2025', NOW(), -24.7821, -24.7900, -65.4232, -65.4300, 3.9, 145, 3, 2);

-- Cambio de Estado Inicial para Evento 1
INSERT INTO CambioEstado (fecha_hora_inicio, fecha_hora_fin, estado_id, evento_sismico_id, empleado_id) VALUES
(NOW(), NULL, 2, 1, NULL);

-- 9. Series Temporales
-- Serie 1 (Asociada a Evento 1, Sismografo 1)
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(1, '2025-02-21 19:05:41', '2025-02-21 19:15:41', 50, 0, 1, 1);

-- Serie 2 (Asociada a Evento 1, Sismografo 3)
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(2, '2025-03-03 14:30:00', '2025-03-03 14:40:00', 50, 1, 3, 1);

-- Serie 3 (Sin evento asociado explicito en data.ts, pero existe en seriesTemporales.ts)
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(3, '2025-03-03 14:30:00', '2025-03-03 14:40:00', 50, 1, 3, NULL);

-- 10. Muestras Sismicas
-- Para Serie 1
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(1, '2025-02-21 19:05:41', 1),
(2, '2025-02-21 19:15:41', 1),
(3, '2025-02-21 19:10:41', 1);

-- Para Serie 2
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(4, '2025-03-03 14:30:00', 2),
(5, '2025-03-03 14:35:00', 2),
(6, '2025-03-03 14:40:00', 2);

-- Para Serie 3 (Mismas muestras que Serie 2 segun data.ts, duplicamos para la DB)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(7, '2025-03-03 14:30:00', 3),
(8, '2025-03-03 14:35:00', 3),
(9, '2025-03-03 14:40:00', 3);

-- 11. Detalles Muestra Sismica
-- Muestra 1 (Serie 1)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(7.0, 1, 1), (10.0, 2, 1), (0.7, 3, 1);

-- Muestra 2 (Serie 1)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(6.99, 1, 2), (10.01, 2, 2), (0.7, 3, 2);

-- Muestra 3 (Serie 1)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(7.02, 1, 3), (10.0, 2, 3), (0.69, 3, 3);

-- Muestra 4 (Serie 2)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(8.5, 1, 4), (12.5, 2, 4), (0.8, 3, 4);

-- Muestra 5 (Serie 2)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(8.1, 1, 5), (12.6, 2, 5), (0.78, 3, 5);

-- Muestra 6 (Serie 2)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(7.9, 1, 6), (12.4, 2, 6), (0.79, 3, 6);

-- Muestra 7 (Serie 3)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(8.5, 1, 7), (12.5, 2, 7), (0.8, 3, 7);

-- Muestra 8 (Serie 3)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(8.1, 1, 8), (12.6, 2, 8), (0.78, 3, 8);

-- Muestra 9 (Serie 3)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(7.9, 1, 9), (12.4, 2, 9), (0.79, 3, 9);
