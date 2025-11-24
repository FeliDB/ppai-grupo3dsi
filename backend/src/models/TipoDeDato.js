"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TipoDeDato {
    constructor(denominacion, nombreUnidadMedida, valorUmbral) {
        this.denominacion = denominacion;
        this.nombreUnidadMedida = nombreUnidadMedida;
        this.valorUmbral = valorUmbral;
    }
    getDenominacion() {
        return this.denominacion;
    }
    getNombreUnidadMedida() {
        return this.nombreUnidadMedida;
    }
    getValorUmbral() {
        return this.valorUmbral;
    }
}
exports.default = TipoDeDato;
