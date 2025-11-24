"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESTADOS = void 0;
const Estado_1 = __importDefault(require("../models/Estado"));
exports.ESTADOS = {
    auto_confirmado: new Estado_1.default("EventoSismico", "auto_confirmado"),
    auto_detectado: new Estado_1.default("EventoSismico", "auto_detectado"),
    pendiente_de_revision: new Estado_1.default("EventoSismico", "pendiente_de_revision"),
    bloqueado_en_revision: new Estado_1.default("EventoSismico", "bloqueado_en_revision"),
    confirmado: new Estado_1.default("EventoSismico", "confirmado"),
    rechazado: new Estado_1.default("EventoSismico", "rechazado"),
    derivado_experto: new Estado_1.default("EventoSismico", "derivado_experto"),
    en_linea: new Estado_1.default("Sismografo", "en_linea")
};
