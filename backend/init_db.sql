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
-- Evento 2: Magnitud 6.5 -> pendiente_de_revision (id 3)
INSERT INTO EventoSismico (id, identificador_evento, fecha_hora_ocurrencia, latitud_epicentro, latitud_hipocentro, longitud_epicentro, longitud_hipocentro, valor_magnitud, profundidad, origen_id, estado_actual_id) VALUES
(2, 'ES-002-2025', NOW(), -33.4489, -33.4600, -70.6693, -70.6800, 6.5, 30, 1, 3);

-- Cambio de Estado Inicial para Evento 1

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

-- ==========================================
-- DATOS ADICIONALES: 15 Eventos Sísmicos Completos
-- ==========================================

-- Sismógrafo adicional para Estación 3
INSERT INTO Sismografo (id, fecha_adquisicion, identificador, nro_serie, estado_id, estacion_id) VALUES
(4, '2022-01-15', 'SIS-004', 11111, 8, 3);

-- 15 Eventos Sísmicos adicionales (con origen, para clasificación por profundidad y alcance)
-- Eventos con estado auto_detectado (2) o pendiente_de_revision (3)
INSERT INTO EventoSismico (id, identificador_evento, fecha_hora_ocurrencia, latitud_epicentro, latitud_hipocentro, longitud_epicentro, longitud_hipocentro, valor_magnitud, profundidad, origen_id, estado_actual_id) VALUES
-- Eventos LOCALES (cerca de estaciones, <100km)
(3, 'ES-003-2025', '2025-05-15 08:30:00', -34.6500, -34.6600, -58.4000, -58.4100, 3.2, 25, 1, 2),
(4, 'ES-004-2025', '2025-05-16 10:15:00', -31.5000, -31.5100, -64.2500, -64.2600, 2.8, 15, 2, 2),
(5, 'ES-005-2025', '2025-05-17 14:45:00', -38.1000, -38.1100, -57.6000, -57.6100, 3.5, 45, 3, 3),
-- Eventos REGIONALES (100-1000km de estaciones)
(6, 'ES-006-2025', '2025-05-18 09:00:00', -29.0000, -29.0100, -67.5000, -67.5100, 4.2, 80, 1, 2),
(7, 'ES-007-2025', '2025-05-19 11:30:00', -40.5000, -40.5100, -63.0000, -63.0100, 3.8, 55, 2, 3),
(8, 'ES-008-2025', '2025-05-20 16:20:00', -27.3667, -27.3700, -65.8500, -65.8600, 4.5, 120, 1, 2),
(9, 'ES-009-2025', '2025-05-21 07:45:00', -42.0000, -42.0100, -65.0000, -65.0100, 3.1, 35, 3, 2),
(10, 'ES-010-2025', '2025-05-22 13:10:00', -26.8000, -26.8100, -60.0000, -60.0100, 2.9, 20, 2, 3),
-- Eventos TELESISMOS (>1000km de estaciones)
(11, 'ES-011-2025', '2025-05-23 18:00:00', -15.5000, -15.5100, -75.0000, -75.0100, 5.8, 200, 1, 2),
(12, 'ES-012-2025', '2025-05-24 22:30:00', -54.8000, -54.8100, -68.3000, -68.3100, 4.1, 90, 3, 3),
(13, 'ES-013-2025', '2025-05-25 05:15:00', -10.0000, -10.0100, -70.0000, -70.0100, 6.2, 150, 2, 2),
-- Eventos con magnitudes variadas y profundidades para clasificación
(14, 'ES-014-2025', '2025-05-26 12:00:00', -33.0000, -33.0100, -71.5000, -71.5100, 5.5, 65, 1, 2),
(15, 'ES-015-2025', '2025-05-27 08:45:00', -35.2000, -35.2100, -59.0000, -59.0100, 2.5, 10, 3, 3),
(16, 'ES-016-2025', '2025-05-28 15:30:00', -32.5000, -32.5100, -68.5000, -68.5100, 4.8, 100, 2, 2),
(17, 'ES-017-2025', '2025-05-29 20:00:00', -37.0000, -37.0100, -57.0000, -57.0100, 3.6, 40, 1, 2);

-- Series Temporales para los 15 nuevos eventos (2 series por evento = 30 series)
-- Evento 3
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(4, '2025-05-15 08:30:00', '2025-05-15 08:40:00', 100, 0, 1, 3),
(5, '2025-05-15 08:30:00', '2025-05-15 08:40:00', 100, 0, 2, 3);
-- Evento 4
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(6, '2025-05-16 10:15:00', '2025-05-16 10:25:00', 100, 0, 3, 4);
-- Evento 5
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(7, '2025-05-17 14:45:00', '2025-05-17 14:55:00', 100, 1, 4, 5),
(8, '2025-05-17 14:45:00', '2025-05-17 14:55:00', 100, 1, 1, 5);
-- Evento 6
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(9, '2025-05-18 09:00:00', '2025-05-18 09:10:00', 100, 1, 2, 6),
(10, '2025-05-18 09:00:00', '2025-05-18 09:10:00', 100, 1, 3, 6);
-- Evento 7
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(11, '2025-05-19 11:30:00', '2025-05-19 11:40:00', 100, 0, 4, 7);
-- Evento 8
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(12, '2025-05-20 16:20:00', '2025-05-20 16:30:00', 100, 1, 1, 8),
(13, '2025-05-20 16:20:00', '2025-05-20 16:30:00', 100, 1, 3, 8);
-- Evento 9
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(14, '2025-05-21 07:45:00', '2025-05-21 07:55:00', 100, 0, 2, 9);
-- Evento 10
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(15, '2025-05-22 13:10:00', '2025-05-22 13:20:00', 100, 0, 4, 10),
(16, '2025-05-22 13:10:00', '2025-05-22 13:20:00', 100, 0, 1, 10);
-- Evento 11
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(17, '2025-05-23 18:00:00', '2025-05-23 18:10:00', 100, 1, 2, 11),
(18, '2025-05-23 18:00:00', '2025-05-23 18:10:00', 100, 1, 3, 11);
-- Evento 12
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(19, '2025-05-24 22:30:00', '2025-05-24 22:40:00', 100, 0, 4, 12);
-- Evento 13
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(20, '2025-05-25 05:15:00', '2025-05-25 05:25:00', 100, 1, 1, 13),
(21, '2025-05-25 05:15:00', '2025-05-25 05:25:00', 100, 1, 2, 13);
-- Evento 14
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(22, '2025-05-26 12:00:00', '2025-05-26 12:10:00', 100, 1, 3, 14),
(23, '2025-05-26 12:00:00', '2025-05-26 12:10:00', 100, 1, 4, 14);
-- Evento 15
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(24, '2025-05-27 08:45:00', '2025-05-27 08:55:00', 100, 0, 1, 15);
-- Evento 16
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(25, '2025-05-28 15:30:00', '2025-05-28 15:40:00', 100, 1, 2, 16),
(26, '2025-05-28 15:30:00', '2025-05-28 15:40:00', 100, 1, 3, 16);
-- Evento 17
INSERT INTO SerieTemporal (id, fecha_hora_inicio_registro, fecha_hora_registro, frecuencia_muestreo, condicion_alarma, sismografo_id, evento_sismico_id) VALUES
(27, '2025-05-29 20:00:00', '2025-05-29 20:10:00', 100, 0, 4, 17),
(28, '2025-05-29 20:00:00', '2025-05-29 20:10:00', 100, 0, 1, 17);

-- Muestras Sísmicas para las nuevas series (3 muestras por serie)
-- Series 4-5 (Evento 3)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(10, '2025-05-15 08:32:00', 4), (11, '2025-05-15 08:35:00', 4), (12, '2025-05-15 08:38:00', 4),
(13, '2025-05-15 08:32:00', 5), (14, '2025-05-15 08:35:00', 5), (15, '2025-05-15 08:38:00', 5);
-- Serie 6 (Evento 4)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(16, '2025-05-16 10:17:00', 6), (17, '2025-05-16 10:20:00', 6), (18, '2025-05-16 10:23:00', 6);
-- Series 7-8 (Evento 5)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(19, '2025-05-17 14:47:00', 7), (20, '2025-05-17 14:50:00', 7), (21, '2025-05-17 14:53:00', 7),
(22, '2025-05-17 14:47:00', 8), (23, '2025-05-17 14:50:00', 8), (24, '2025-05-17 14:53:00', 8);
-- Series 9-10 (Evento 6)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(25, '2025-05-18 09:02:00', 9), (26, '2025-05-18 09:05:00', 9), (27, '2025-05-18 09:08:00', 9),
(28, '2025-05-18 09:02:00', 10), (29, '2025-05-18 09:05:00', 10), (30, '2025-05-18 09:08:00', 10);
-- Serie 11 (Evento 7)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(31, '2025-05-19 11:32:00', 11), (32, '2025-05-19 11:35:00', 11), (33, '2025-05-19 11:38:00', 11);
-- Series 12-13 (Evento 8)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(34, '2025-05-20 16:22:00', 12), (35, '2025-05-20 16:25:00', 12), (36, '2025-05-20 16:28:00', 12),
(37, '2025-05-20 16:22:00', 13), (38, '2025-05-20 16:25:00', 13), (39, '2025-05-20 16:28:00', 13);
-- Serie 14 (Evento 9)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(40, '2025-05-21 07:47:00', 14), (41, '2025-05-21 07:50:00', 14), (42, '2025-05-21 07:53:00', 14);
-- Series 15-16 (Evento 10)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(43, '2025-05-22 13:12:00', 15), (44, '2025-05-22 13:15:00', 15), (45, '2025-05-22 13:18:00', 15),
(46, '2025-05-22 13:12:00', 16), (47, '2025-05-22 13:15:00', 16), (48, '2025-05-22 13:18:00', 16);
-- Series 17-18 (Evento 11)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(49, '2025-05-23 18:02:00', 17), (50, '2025-05-23 18:05:00', 17), (51, '2025-05-23 18:08:00', 17),
(52, '2025-05-23 18:02:00', 18), (53, '2025-05-23 18:05:00', 18), (54, '2025-05-23 18:08:00', 18);
-- Serie 19 (Evento 12)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(55, '2025-05-24 22:32:00', 19), (56, '2025-05-24 22:35:00', 19), (57, '2025-05-24 22:38:00', 19);
-- Series 20-21 (Evento 13)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(58, '2025-05-25 05:17:00', 20), (59, '2025-05-25 05:20:00', 20), (60, '2025-05-25 05:23:00', 20),
(61, '2025-05-25 05:17:00', 21), (62, '2025-05-25 05:20:00', 21), (63, '2025-05-25 05:23:00', 21);
-- Series 22-23 (Evento 14)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(64, '2025-05-26 12:02:00', 22), (65, '2025-05-26 12:05:00', 22), (66, '2025-05-26 12:08:00', 22),
(67, '2025-05-26 12:02:00', 23), (68, '2025-05-26 12:05:00', 23), (69, '2025-05-26 12:08:00', 23);
-- Serie 24 (Evento 15)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(70, '2025-05-27 08:47:00', 24), (71, '2025-05-27 08:50:00', 24), (72, '2025-05-27 08:53:00', 24);
-- Series 25-26 (Evento 16)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(73, '2025-05-28 15:32:00', 25), (74, '2025-05-28 15:35:00', 25), (75, '2025-05-28 15:38:00', 25),
(76, '2025-05-28 15:32:00', 26), (77, '2025-05-28 15:35:00', 26), (78, '2025-05-28 15:38:00', 26);
-- Series 27-28 (Evento 17)
INSERT INTO MuestraSismica (id, fecha_hora_muestra, serie_temporal_id) VALUES
(79, '2025-05-29 20:02:00', 27), (80, '2025-05-29 20:05:00', 27), (81, '2025-05-29 20:08:00', 27),
(82, '2025-05-29 20:02:00', 28), (83, '2025-05-29 20:05:00', 28), (84, '2025-05-29 20:08:00', 28);

-- Detalles de Muestras Sísmicas (velocidad, frecuencia, longitud para cada muestra)
-- Muestras 10-15 (Series 4-5, Evento 3)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(6.5, 1, 10), (9.8, 2, 10), (0.66, 3, 10),
(6.8, 1, 11), (10.2, 2, 11), (0.67, 3, 11),
(6.3, 1, 12), (9.5, 2, 12), (0.66, 3, 12),
(6.6, 1, 13), (9.9, 2, 13), (0.67, 3, 13),
(6.4, 1, 14), (9.7, 2, 14), (0.66, 3, 14),
(6.7, 1, 15), (10.0, 2, 15), (0.67, 3, 15);
-- Muestras 16-18 (Serie 6, Evento 4)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(5.8, 1, 16), (8.5, 2, 16), (0.68, 3, 16),
(5.9, 1, 17), (8.7, 2, 17), (0.68, 3, 17),
(5.7, 1, 18), (8.4, 2, 18), (0.68, 3, 18);
-- Muestras 19-24 (Series 7-8, Evento 5)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(7.2, 1, 19), (11.0, 2, 19), (0.65, 3, 19),
(7.4, 1, 20), (11.3, 2, 20), (0.65, 3, 20),
(7.1, 1, 21), (10.8, 2, 21), (0.66, 3, 21),
(7.3, 1, 22), (11.1, 2, 22), (0.66, 3, 22),
(7.5, 1, 23), (11.4, 2, 23), (0.65, 3, 23),
(7.0, 1, 24), (10.7, 2, 24), (0.66, 3, 24);
-- Muestras 25-30 (Series 9-10, Evento 6)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(8.2, 1, 25), (12.8, 2, 25), (0.64, 3, 25),
(8.5, 1, 26), (13.1, 2, 26), (0.65, 3, 26),
(8.0, 1, 27), (12.5, 2, 27), (0.64, 3, 27),
(8.3, 1, 28), (12.9, 2, 28), (0.64, 3, 28),
(8.4, 1, 29), (13.0, 2, 29), (0.65, 3, 29),
(8.1, 1, 30), (12.6, 2, 30), (0.64, 3, 30);
-- Muestras 31-33 (Serie 11, Evento 7)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(7.6, 1, 31), (11.5, 2, 31), (0.66, 3, 31),
(7.8, 1, 32), (11.8, 2, 32), (0.66, 3, 32),
(7.5, 1, 33), (11.3, 2, 33), (0.67, 3, 33);
-- Muestras 34-39 (Series 12-13, Evento 8)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(8.8, 1, 34), (13.5, 2, 34), (0.65, 3, 34),
(9.0, 1, 35), (13.8, 2, 35), (0.65, 3, 35),
(8.6, 1, 36), (13.2, 2, 36), (0.66, 3, 36),
(8.7, 1, 37), (13.4, 2, 37), (0.65, 3, 37),
(8.9, 1, 38), (13.6, 2, 38), (0.65, 3, 38),
(8.5, 1, 39), (13.1, 2, 39), (0.66, 3, 39);
-- Muestras 40-42 (Serie 14, Evento 9)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(6.2, 1, 40), (9.2, 2, 40), (0.67, 3, 40),
(6.4, 1, 41), (9.5, 2, 41), (0.67, 3, 41),
(6.1, 1, 42), (9.0, 2, 42), (0.68, 3, 42);
-- Muestras 43-48 (Series 15-16, Evento 10)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(5.5, 1, 43), (8.0, 2, 43), (0.69, 3, 43),
(5.7, 1, 44), (8.3, 2, 44), (0.68, 3, 44),
(5.4, 1, 45), (7.8, 2, 45), (0.69, 3, 45),
(5.6, 1, 46), (8.1, 2, 46), (0.69, 3, 46),
(5.8, 1, 47), (8.4, 2, 47), (0.68, 3, 47),
(5.3, 1, 48), (7.7, 2, 48), (0.70, 3, 48);
-- Muestras 49-54 (Series 17-18, Evento 11)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(9.5, 1, 49), (14.5, 2, 49), (0.66, 3, 49),
(9.8, 1, 50), (14.9, 2, 50), (0.65, 3, 50),
(9.3, 1, 51), (14.2, 2, 51), (0.66, 3, 51),
(9.6, 1, 52), (14.6, 2, 52), (0.65, 3, 52),
(9.7, 1, 53), (14.8, 2, 53), (0.65, 3, 53),
(9.4, 1, 54), (14.3, 2, 54), (0.66, 3, 54);
-- Muestras 55-57 (Serie 19, Evento 12)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(7.9, 1, 55), (12.0, 2, 55), (0.66, 3, 55),
(8.1, 1, 56), (12.3, 2, 56), (0.66, 3, 56),
(7.8, 1, 57), (11.8, 2, 57), (0.67, 3, 57);
-- Muestras 58-63 (Series 20-21, Evento 13)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(10.2, 1, 58), (15.5, 2, 58), (0.66, 3, 58),
(10.5, 1, 59), (15.9, 2, 59), (0.66, 3, 59),
(10.0, 1, 60), (15.2, 2, 60), (0.67, 3, 60),
(10.3, 1, 61), (15.6, 2, 61), (0.66, 3, 61),
(10.4, 1, 62), (15.8, 2, 62), (0.66, 3, 62),
(10.1, 1, 63), (15.4, 2, 63), (0.66, 3, 63);
-- Muestras 64-69 (Series 22-23, Evento 14)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(9.0, 1, 64), (13.8, 2, 64), (0.65, 3, 64),
(9.2, 1, 65), (14.1, 2, 65), (0.65, 3, 65),
(8.8, 1, 66), (13.5, 2, 66), (0.66, 3, 66),
(9.1, 1, 67), (13.9, 2, 67), (0.65, 3, 67),
(9.3, 1, 68), (14.2, 2, 68), (0.65, 3, 68),
(8.9, 1, 69), (13.6, 2, 69), (0.66, 3, 69);
-- Muestras 70-72 (Serie 24, Evento 15)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(4.8, 1, 70), (7.0, 2, 70), (0.69, 3, 70),
(5.0, 1, 71), (7.3, 2, 71), (0.68, 3, 71),
(4.7, 1, 72), (6.8, 2, 72), (0.70, 3, 72);
-- Muestras 73-78 (Series 25-26, Evento 16)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(8.6, 1, 73), (13.2, 2, 73), (0.65, 3, 73),
(8.8, 1, 74), (13.5, 2, 74), (0.65, 3, 74),
(8.4, 1, 75), (12.9, 2, 75), (0.66, 3, 75),
(8.7, 1, 76), (13.3, 2, 76), (0.65, 3, 76),
(8.9, 1, 77), (13.6, 2, 77), (0.65, 3, 77),
(8.5, 1, 78), (13.0, 2, 78), (0.66, 3, 78);
-- Muestras 79-84 (Series 27-28, Evento 17)
INSERT INTO DetalleMuestraSismica (valor, tipo_dato_id, muestra_sismica_id) VALUES
(7.3, 1, 79), (11.0, 2, 79), (0.66, 3, 79),
(7.5, 1, 80), (11.3, 2, 80), (0.66, 3, 80),
(7.2, 1, 81), (10.8, 2, 81), (0.67, 3, 81),
(7.4, 1, 82), (11.1, 2, 82), (0.66, 3, 82),
(7.6, 1, 83), (11.4, 2, 83), (0.66, 3, 83),
(7.1, 1, 84), (10.6, 2, 84), (0.67, 3, 84);
