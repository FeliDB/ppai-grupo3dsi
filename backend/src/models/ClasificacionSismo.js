"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClasificacionSismo {
    constructor(kmProfundidadDesde, kmProfundidadHasta, nombre) {
        this.kmProfundidadDesde = kmProfundidadDesde;
        this.kmProfundidadHasta = kmProfundidadHasta;
        this.nombre = nombre;
    }
    getNombre() {
        return this.nombre;
    }
    static setClasificacionSismo(profundidad) {
        if (profundidad >= 0 && profundidad <= 60) {
            return new ClasificacionSismo(0, 60, "superficial");
        }
        else if (profundidad >= 61 && profundidad <= 300) {
            return new ClasificacionSismo(61, 300, "intermedio");
        }
        else if (profundidad >= 301 && profundidad <= 650) {
            return new ClasificacionSismo(301, 650, "profundo");
        }
        else {
            throw new Error("Profundidad fuera de rango (0-650 km)");
        }
    }
}
exports.default = ClasificacionSismo;
