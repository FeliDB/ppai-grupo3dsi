"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Estado {
    constructor(ambito, nombreEstado) {
        this.ambito = ambito;
        this.nombreEstado = nombreEstado;
    }
    getAmbito() {
        return this.ambito;
    }
    getNombreEstado() {
        return this.nombreEstado;
    }
    esAutoDetectado() {
        return this.nombreEstado === "auto_detectado";
    }
    esPendienteDeRevision() {
        return this.nombreEstado === "pendiente_de_revision";
    }
    esConfirmado() {
        return this.nombreEstado === "confirmado";
    }
    esRechazado() {
        return this.nombreEstado === "rechazado";
    }
    esDerivadoExperto() {
        return this.nombreEstado === "derivado_experto";
    }
    esAmbito(ambito) {
        return this.ambito === ambito;
    }
    esAmbitoEventoSismico() {
        // Compara el ámbito interno con el valor "EventoSismico"
        return this.ambito === "EventoSismico";
    }
    esBloqueadoEnRevision() {
        return this.nombreEstado === "bloqueado_en_revision";
    }
}
exports.default = Estado;
