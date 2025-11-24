"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sismografo {
    constructor(fechaAdquisicion, identificadorSismografo, nroSerie, estadoActual, estacionSismologica) {
        this.fechaAdquisicion = fechaAdquisicion;
        this.identificadorSismografo = identificadorSismografo;
        this.nroSerie = nroSerie;
        this.estadoActual = estadoActual;
        this.estacionSismologica = estacionSismologica;
    }
    getEstacionSismologica() {
        return this.estacionSismologica;
    }
    getDatos() {
        return {
            fechaAdquisicion: this.fechaAdquisicion,
            identificadorSismografo: this.identificadorSismografo,
            nroSerie: this.nroSerie,
            estadoActual: this.estadoActual,
            estacionSismologica: this.estacionSismologica
        };
    }
}
exports.default = Sismografo;
