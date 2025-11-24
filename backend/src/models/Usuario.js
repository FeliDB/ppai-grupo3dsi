"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Usuario {
    constructor(nombreUsuario, contraseña, empleado) {
        this.nombreUsuario = nombreUsuario;
        this.contraseña = contraseña;
        this.empleado = empleado;
    }
    getNombreUsuario() {
        return this.nombreUsuario;
    }
    getContraseña() {
        return this.contraseña;
    }
    getEmpleado() {
        return this.empleado;
    }
    getRILogueado() {
        return this.empleado;
    }
}
exports.default = Usuario;
