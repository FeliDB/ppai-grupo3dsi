"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarios = exports.eventosSismicos = exports.ORIGEN_DE_GENERACION = void 0;
const Empleado_1 = __importDefault(require("../models/Empleado"));
const EventoSismico_1 = __importDefault(require("../models/EventoSismico"));
const OrigenDeGeneracion_1 = __importDefault(require("../models/OrigenDeGeneracion"));
const Usuario_1 = __importDefault(require("../models/Usuario"));
const seriesTemporales_1 = require("./seriesTemporales");
exports.ORIGEN_DE_GENERACION = {
    sismo_interplaca: new OrigenDeGeneracion_1.default("interplaca"),
    sismo_volcanico: new OrigenDeGeneracion_1.default("volcanico"),
    sismo_provocado_por_explosiones_de_minas: new OrigenDeGeneracion_1.default("explosiones_de_minas")
};
exports.eventosSismicos = [
    new EventoSismico_1.default(new Date(), -24.7821, -24.7900, -65.4232, -65.4300, 3.9, 145, exports.ORIGEN_DE_GENERACION.sismo_provocado_por_explosiones_de_minas, [
        seriesTemporales_1.SERIES_TEMPORALES.serieTemporal1,
        seriesTemporales_1.SERIES_TEMPORALES.serieTemporal2
    ]),
    // new EventoSismico(
    //   new Date(),
    //   -31.4201,
    //   -31.4300,
    //   -64.1888,
    //   -64.1900,
    //   4.8,
    //   50,
    //   ORIGEN_DE_GENERACION.sismo_interplaca,
    //   [
    //     SERIES_TEMPORALES.serieTemporal1,
    //     SERIES_TEMPORALES.serieTemporal2
    //   ]
    // ),
    // new EventoSismico(
    //   new Date(),
    //   -34.6037,
    //   -34.6100,
    //   -58.3816,
    //   -58.3900,
    //   5.2,
    //   43,
    //   ORIGEN_DE_GENERACION.sismo_volcanico,
    //   [
    //     SERIES_TEMPORALES.serieTemporal1
    //   ]
    // ),
    // new EventoSismico(
    //   new Date(),
    //   -24.7821,
    //   -24.7900,
    //   -65.4232,
    //   -65.4300,
    //   3.9,
    //   145,
    //   ORIGEN_DE_GENERACION.sismo_provocado_por_explosiones_de_minas,
    //   [
    //     SERIES_TEMPORALES.serieTemporal1,
    //     SERIES_TEMPORALES.serieTemporal2
    //   ]
    // ),
    // new EventoSismico(
    //   new Date(),
    //   -24.7821,
    //   -24.7900,
    //   -65.4232,
    //   -65.4300,
    //   3.9,
    //   160,
    //   ORIGEN_DE_GENERACION.sismo_volcanico,
    //   [
    //     SERIES_TEMPORALES.serieTemporal2
    //   ]
    // ),
    // new EventoSismico(
    //   new Date(),
    //   -24.7821,
    //   -24.7900,
    //   -65.4232,
    //   -65.4300,
    //   2.3,
    //   388,
    //   ORIGEN_DE_GENERACION.sismo_interplaca,
    //   [
    //     SERIES_TEMPORALES.serieTemporal1
    //   ]
    // ),
    // new EventoSismico(
    //   new Date(),
    //   -26.8303,
    //   -26.8400,
    //   -65.2038,
    //   -65.2100,
    //   4.3,
    //   600,
    //   ORIGEN_DE_GENERACION.sismo_provocado_por_explosiones_de_minas,
    //   [
    //     SERIES_TEMPORALES.serieTemporal1
    //   ]
    // ),
    // new EventoSismico(
    //   new Date(),
    //   -38.0055,
    //   -38.0100,
    //   -57.5426,
    //   -57.5500,
    //   4.6,
    //   450,
    //   ORIGEN_DE_GENERACION.sismo_volcanico,
    //   [
    //     SERIES_TEMPORALES.serieTemporal1
    //   ]
    // )
];
const empleado1 = new Empleado_1.default("Juan", "Perez", "emp1@ccrs.con", 123123123);
const empleado2 = new Empleado_1.default("Juan", "Perez", "emp2@ccrs.con", 123123123);
const empleado3 = new Empleado_1.default("Juan", "Perez", "emp3@ccrs.con", 123123123);
exports.usuarios = [
    new Usuario_1.default("juan1.p", "123abc", empleado1),
    new Usuario_1.default("juan2.p", "123abc", empleado2),
    new Usuario_1.default("juan3.p", "123abc", empleado3)
];
