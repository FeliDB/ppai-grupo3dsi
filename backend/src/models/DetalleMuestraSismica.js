"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DetalleMuestraSismica {
    constructor(valor, tipoDeDato) {
        this.valor = valor;
        this.tipoDeDato = tipoDeDato;
    }
    getDatos() {
        return {
            tipoDeDato: this.tipoDeDato,
            valor: this.valor
        };
    }
}
exports.default = DetalleMuestraSismica;
