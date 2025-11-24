"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Empleado {
    constructor(nombre, apellido, mail, telefono) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.mail = mail;
        this.telefono = telefono;
    }
    getNombre() {
        return this.nombre;
    }
    getApellido() {
        return this.apellido;
    }
}
exports.default = Empleado;
