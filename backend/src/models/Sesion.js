"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sesion {
    constructor(usuario) {
        this.usuarioLogueado = usuario;
    }
    static iniciarSesion(usuario) {
        this.sesionActual = new Sesion(usuario);
    }
    static getSesionActual() {
        if (!this.sesionActual)
            throw new Error("No hay una sesion iniciada");
        return this.sesionActual;
    }
    getUsuarioLogueado() {
        return this.usuarioLogueado;
    }
}
exports.default = Sesion;
