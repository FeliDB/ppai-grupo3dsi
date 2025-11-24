"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MagnitudRichter {
    constructor(descripcionMagnitud, numero) {
        this.descripcionMagnitud = descripcionMagnitud;
        this.numero = numero;
    }
    getDescripcionMagnitud() {
        return this.descripcionMagnitud;
    }
    static setMagnitudRichter(valor) {
        if (valor < 3.5)
            return new MagnitudRichter("muy_leve", 0);
        if (valor < 4.5)
            return new MagnitudRichter("leve", 3.5);
        if (valor < 6.0)
            return new MagnitudRichter("moderado", 4.5);
        if (valor < 7.5)
            return new MagnitudRichter("fuerte", 6.0);
        return new MagnitudRichter("catastrofico", 7.5);
    }
}
exports.default = MagnitudRichter;
