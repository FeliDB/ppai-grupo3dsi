"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CambioEstado {
    constructor(estado, fechaHoraInicio, fechaHoraFin, empleadoResponsable = null) {
        this.estado = estado;
        this.fechaHoraInicio = fechaHoraInicio;
        this.fechaHoraFin = null;
        this.empleadoResponsable = empleadoResponsable;
    }
    getFechaHoraInicio() {
        return this.fechaHoraInicio;
    }
    getFechaHoraFin() {
        return this.fechaHoraFin;
    }
    getEmpleadoResponsable() {
        return this.empleadoResponsable;
    }
    getEstado() {
        return this.estado;
    }
    esEstadoActual() {
        return this.fechaHoraFin === null;
    }
    setFechaHoraFin(horaFin) {
        return this.fechaHoraFin = horaFin;
    }
}
exports.default = CambioEstado;
