"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AlcanceSismo {
    constructor(
    // descripcion: string,
    nombre, distancia) {
        // this.descripcion = descripcion
        this.nombre = nombre,
            this.distancia = distancia;
    }
    getNombre() {
        return this.nombre;
    }
    static setAlcance(estacionSismologica, epicentro) {
        if (!estacionSismologica)
            return;
        // Si la tierra fuese plana
        const kmPorGrado = 111; // 1 grado ≈ 111 km en lat/long
        const dLat = epicentro.latitud - estacionSismologica.getUbicacion().latitud;
        const dLong = epicentro.longitud - estacionSismologica.getUbicacion().longitud;
        const distancia = Math.round(Math.sqrt(dLat * dLat + dLong * dLong) * kmPorGrado * 100) / 100;
        if (distancia <= 100)
            return new AlcanceSismo("local", distancia);
        if (distancia <= 1000)
            return new AlcanceSismo("regional", distancia);
        return new AlcanceSismo("tele_sismo", distancia);
    }
}
exports.default = AlcanceSismo;
