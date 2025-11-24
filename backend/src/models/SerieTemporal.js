"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SerieTemporal {
    constructor(fechaHoraInicioRegistroMuestras, fechaHoraRegistro, frecuenciaMuestreo, muestraSismica, sismografo) {
        this.fechaHoraInicioRegistroMuestras = fechaHoraInicioRegistroMuestras;
        this.fechaHoraRegistro = fechaHoraRegistro;
        this.frecuenciaMuestreo = frecuenciaMuestreo;
        this.muestraSismica = muestraSismica;
        this.sismografo = sismografo;
        // Si el valor de la muestra es mayor o igual al valor umbral de al menos un tipo de dato
        // se activa la condicion de alarma
        this.condicionAlarma = this.muestraSismica.some(muestra => muestra.getDatos().detalleMuestraSismica.some(detalle => detalle.getDatos().valor >= detalle.getDatos().tipoDeDato.getValorUmbral()));
    }
    getCondicionAlarma() {
        return this.condicionAlarma;
    }
    getFechaHoraInicioRegistroMuestras() {
        return this.fechaHoraInicioRegistroMuestras;
    }
    getFechaHoraRegistro() {
        return this.fechaHoraRegistro;
    }
    getFrecuenciaMuestreo() {
        return this.frecuenciaMuestreo;
    }
    getSismografo() {
        return this.sismografo;
    }
    getDatos() {
        return {
            fechaHoraInicioRegistroMuestras: this.fechaHoraInicioRegistroMuestras,
            fechaHoraRegistro: this.fechaHoraRegistro,
            frecuenciaMuestreo: this.frecuenciaMuestreo,
            condicionAlarma: this.condicionAlarma,
            muestrasSismicas: this.muestraSismica,
            sismografo: this.sismografo
        };
    }
}
exports.default = SerieTemporal;
