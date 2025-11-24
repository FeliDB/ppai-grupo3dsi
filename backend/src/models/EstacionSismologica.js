"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EstacionSismologica {
    // private documentoCertificacionAdquisicion: string
    // private fechaSolicitudCertificacion: Date
    // private nroCertificacionAdquisicion: number
    constructor(codigoEstacion, latitud, longitud, nombre
    // documentoCertificacionAdquisicion: string,
    // fechaSolicitudCertificacion: Date,
    // nroCertificacionAdquisicion: number
    ) {
        this.codigoEstacion = codigoEstacion;
        this.latitud = latitud;
        this.longitud = longitud;
        this.nombre = nombre;
        // this.documentoCertificacionAdquisicion = documentoCertificacionAdquisicion
        // this.fechaSolicitudCertificacion = fechaSolicitudCertificacion
        // this.nroCertificacionAdquisicion = nroCertificacionAdquisicion
    }
    getCodigoEstacion() {
        return this.codigoEstacion;
    }
    getNombre() {
        return this.nombre;
    }
    getUbicacion() {
        return {
            latitud: this.latitud,
            longitud: this.longitud
        };
    }
}
exports.default = EstacionSismologica;
