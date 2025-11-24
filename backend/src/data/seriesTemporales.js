"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERIES_TEMPORALES = void 0;
const DetalleMuestraSismica_1 = __importDefault(require("../models/DetalleMuestraSismica"));
const MuestraSismica_1 = __importDefault(require("../models/MuestraSismica"));
const SerieTemporal_1 = __importDefault(require("../models/SerieTemporal"));
const TipoDeDato_1 = __importDefault(require("../models/TipoDeDato"));
const sismografos_1 = require("./sismografos");
const tipoVelocidad = new TipoDeDato_1.default("Velocidad de onda", "Km/seg", 8.0);
const tipoFrecuencia = new TipoDeDato_1.default("Frecuencia de onda", "Hz", 12.0);
const tipoLongitud = new TipoDeDato_1.default("Longitud de onda", "km/ciclo", 0.75);
const muestrasSerie1 = [
    new MuestraSismica_1.default(new Date("2025-02-21T19:05:41"), [
        new DetalleMuestraSismica_1.default(7.0, tipoVelocidad),
        new DetalleMuestraSismica_1.default(10.0, tipoFrecuencia),
        new DetalleMuestraSismica_1.default(0.7, tipoLongitud),
    ]),
    new MuestraSismica_1.default(new Date("2025-02-21T19:15:41"), [
        new DetalleMuestraSismica_1.default(6.99, tipoVelocidad),
        new DetalleMuestraSismica_1.default(10.01, tipoFrecuencia),
        new DetalleMuestraSismica_1.default(0.7, tipoLongitud),
    ]),
    new MuestraSismica_1.default(new Date("2025-02-21T19:10:41"), [
        new DetalleMuestraSismica_1.default(7.02, tipoVelocidad),
        new DetalleMuestraSismica_1.default(10.0, tipoFrecuencia),
        new DetalleMuestraSismica_1.default(0.69, tipoLongitud),
    ]),
];
const muestrasSerie2 = [
    new MuestraSismica_1.default(new Date("2025-03-03T14:30:00"), [
        new DetalleMuestraSismica_1.default(8.5, tipoVelocidad),
        new DetalleMuestraSismica_1.default(12.5, tipoFrecuencia),
        new DetalleMuestraSismica_1.default(0.8, tipoLongitud),
    ]),
    new MuestraSismica_1.default(new Date("2025-03-03T14:35:00"), [
        new DetalleMuestraSismica_1.default(8.1, tipoVelocidad),
        new DetalleMuestraSismica_1.default(12.6, tipoFrecuencia),
        new DetalleMuestraSismica_1.default(0.78, tipoLongitud),
    ]),
    new MuestraSismica_1.default(new Date("2025-03-03T14:40:00"), [
        new DetalleMuestraSismica_1.default(7.9, tipoVelocidad),
        new DetalleMuestraSismica_1.default(12.4, tipoFrecuencia),
        new DetalleMuestraSismica_1.default(0.79, tipoLongitud),
    ]),
];
exports.SERIES_TEMPORALES = {
    serieTemporal1: new SerieTemporal_1.default(new Date("2025-02-21T19:05:41"), new Date("2025-02-21T19:15:41"), 50, muestrasSerie1, sismografos_1.SISMOGRAFOS.sismografo1),
    serieTemporal2: new SerieTemporal_1.default(new Date("2025-03-03T14:30:00"), new Date("2025-03-03T14:40:00"), 50, muestrasSerie2, sismografos_1.SISMOGRAFOS.sismografo3),
    serieTemporal3: new SerieTemporal_1.default(new Date("2025-03-03T14:30:00"), new Date("2025-03-03T14:40:00"), 50, muestrasSerie2, sismografos_1.SISMOGRAFOS.sismografo3)
};
