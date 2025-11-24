"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MuestraSismica {
    constructor(fechaHoraMuestra, detalleMuestraSismica) {
        this.fechaHoraMuestra = fechaHoraMuestra;
        this.detalleMuestraSismica = detalleMuestraSismica;
    }
    getDatos() {
        return {
            fechaHoraMuestra: this.fechaHoraMuestra,
            detalleMuestraSismica: this.detalleMuestraSismica
        };
    }
}
exports.default = MuestraSismica;
