"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const estados_1 = require("../data/estados");
const CambioEstado_1 = __importDefault(require("./CambioEstado"));
const ClasificacionSismo_1 = __importDefault(require("./ClasificacionSismo"));
const MagnitudRichter_1 = __importDefault(require("./MagnitudRichter"));
class EventoSismico {
    constructor(fechaHoraOcurrencia, latitudEpicentro, latitudHipocentro, longitudEpicentro, longitudHipocentro, valorMagnitud, profundidad, origenDeGeneracion, serieTemporal) {
        this.cambioEstado = [];
        // Generar id (formato: ES-001-{añoActual})
        const añoActual = new Date().getFullYear();
        this.id = `ES-${EventoSismico.contador.toString().padStart(3, '0')}-${añoActual}`;
        EventoSismico.contador++;
        this.fechaHoraOcurrencia = fechaHoraOcurrencia;
        this.latitudEpicentro = latitudEpicentro;
        this.latitudHipocentro = latitudHipocentro;
        this.longitudEpicentro = longitudEpicentro;
        this.longitudHipocentro = longitudHipocentro;
        this.valorMagnitud = valorMagnitud;
        this.profundidad = profundidad;
        this.origenDeGeneracion = origenDeGeneracion;
        this.serieTemporal = serieTemporal;
        // RN: Si luego del procesamiento con machine learning de los datos sísmicos se estima una
        // magnitud mayor o igual a 4.0 en la escala Richter, el sistema debe registrar
        // automáticamente el evento sísmico como auto confirmado, de lo contrario debe
        // registrarlo como auto detectado.
        const estado = valorMagnitud >= 4.0 ? estados_1.ESTADOS.auto_confirmado : estados_1.ESTADOS.auto_detectado;
        const estadoInicial = new CambioEstado_1.default(estado, new Date(), null, null);
        this.cambioEstado = [estadoInicial];
        this.estadoActual = estadoInicial.getEstado();
        this.magnitud = MagnitudRichter_1.default.setMagnitudRichter(valorMagnitud);
        this.clasificacionSismo = ClasificacionSismo_1.default.setClasificacionSismo(profundidad);
    }
    getId() {
        return this.id;
    }
    getFechaHoraOcurrencia() {
        return this.fechaHoraOcurrencia;
    }
    getValorMagnitud() {
        return this.valorMagnitud;
    }
    getMagnitud() {
        return this.magnitud;
    }
    getProfundidad() {
        return this.profundidad;
    }
    getClasificacionSismo() {
        return this.clasificacionSismo;
    }
    getOrigenDeGeneracion() {
        return this.origenDeGeneracion;
    }
    getLatitudEpicentro() {
        return this.latitudEpicentro;
    }
    getLatitudHipocentro() {
        return this.latitudHipocentro;
    }
    getLongitudEpicentro() {
        return this.longitudEpicentro;
    }
    getLongitudHipocentro() {
        return this.longitudHipocentro;
    }
    getDatosPrincipales() {
        return {
            id: this.id,
            fechaHoraOcurrencia: this.fechaHoraOcurrencia,
            latitudEpicentro: this.latitudEpicentro,
            latitudHipocentro: this.latitudHipocentro,
            longitudEpicentro: this.longitudEpicentro,
            longitudHipocentro: this.longitudHipocentro,
            valorMagnitud: this.valorMagnitud,
            estadoActual: this.estadoActual,
            cambioEstado: this.cambioEstado
        };
    }
    // getAlcances() {
    //   return this.alcances
    // }
    // setea el atributo estadoActual al ultimo estado de la lista de cambioEstado
    setEstadoActual() {
        const actual = this.cambioEstado.find(estado => estado.esEstadoActual());
        if (!actual)
            throw new Error("No hay estado");
        this.estadoActual = actual.getEstado();
    }
    getEstadoActual() {
        return this.estadoActual;
    }
    getHistorialEstados() {
        return this.cambioEstado;
    }
    getSerieTemporal() {
        return this.serieTemporal;
    }
    cambiarEstadoA(nuevoEstado, empleado = null) {
        const fechaHoraActual = new Date(); // fecha actual
        // Si es estado actual lo finaliza (setea la fecha hora actual como fecha hora fin)
        const estadoActual = this.cambioEstado.find((estado) => estado.esEstadoActual());
        if (estadoActual) {
            estadoActual.setFechaHoraFin(fechaHoraActual);
        }
        // Genera una nueva instancia de CambioEstado y agrega el nuevo estado a la lista
        const cambioEstado = new CambioEstado_1.default(nuevoEstado, fechaHoraActual, null, empleado);
        this.cambioEstado.push(cambioEstado);
        this.setEstadoActual();
    }
    //TODO* REVISAR PORQUE NOSE, ES EL PASO 28
    /** Paso 28 – Bloqueo del evento */
    bloquear(fechaActual, empleado) {
        // MENSAJE 29: buscarUltimoCambioEstado()
        const ultimoCambio = this.buscarUltimoCambioEstado();
        if (ultimoCambio) {
            // MENSAJE 30: esActual()
            if (ultimoCambio.esEstadoActual()) {
                // MENSAJE 31: setFechaHoraFin()
                ultimoCambio.setFechaHoraFin(fechaActual);
            }
        }
        const nuevoCambio = this.crearCambioEstado(fechaActual, empleado);
        // Se añade el nuevo cambio al historial
        this.cambioEstado.push(nuevoCambio);
        // Se actualiza el puntero al estado actual del evento
        this.estadoActual = nuevoCambio.getEstado();
    }
    buscarUltimoCambioEstado() {
        if (this.cambioEstado.length === 0) {
            return undefined;
        }
        return this.cambioEstado[this.cambioEstado.length - 1];
    }
    crearCambioEstado(fechaInicio, empleado) {
        // Se asume que el estado a crear es 'bloqueado_en_revision' por el contexto.
        const estadoBloqueado = estados_1.ESTADOS.bloqueado_en_revision;
        // MENSAJE 33: new()
        const nuevoCambio = new CambioEstado_1.default(estadoBloqueado, fechaInicio, null, // La fecha de fin es null porque es el nuevo estado actual
        empleado);
        // El MENSAJE 34: setEstado() se interpreta como la acción de asignar este nuevo
        // estado como el actual, lo cual se hace en el método `bloquear`.
        return nuevoCambio;
    }
    //TODO HASTA ACA ES EL PASO 28 REVISARR
    //-----------------------------------------
    actualizarAPendienteRevision(fechaActual) {
        const haceCuanto = fechaActual.getTime() - this.getFechaHoraOcurrencia().getTime(); // Obtiene el tiempo que paso entre que se creo el evento y la fechaActual
        const cincoMinutos = 5 * 60 * 1000; // Conversion 5min
        // Si pasan 5min cambia el estado a "pendiente_de_revision"
        if (this.getEstadoActual().esAutoDetectado() && haceCuanto >= cincoMinutos) {
            // Al empleado le pasamos null porque lo hace el sistema automaticamente
            this.cambiarEstadoA(estados_1.ESTADOS.pendiente_de_revision, null);
        }
    }
    // FIX: REVISAR 
    // NOTE: esta ok
    // WARN: esto trae el sismografo tambien y no hace falta
    // NOTE: en realidad esta bien que traiga el sismografo porque es un atributo de la serieTemporal
    // y no se especifica que datos se traen
    clasificarPorEstacion(series) {
        const seriesPorEstacion = [];
        for (const serie of series) {
            // Ordenar muestras sismicas por fechaHoraMuestra
            serie.getDatos().muestrasSismicas.sort((a, b) => a.getDatos().fechaHoraMuestra.getTime() - b.getDatos().fechaHoraMuestra.getTime());
            const estacion = serie.getSismografo().getEstacionSismologica();
            const existente = seriesPorEstacion.find(e => e.estacion.getCodigoEstacion() === estacion.getCodigoEstacion());
            if (existente) {
                existente.seriesTemporales.push(serie);
            }
            else {
                seriesPorEstacion.push({
                    estacion,
                    seriesTemporales: [serie]
                });
            }
        }
        // Ordenar las series temporales por fechaHoraInicioRegistroMuestras
        for (const grupo of seriesPorEstacion) {
            grupo.seriesTemporales.sort((a, b) => a.getFechaHoraInicioRegistroMuestras().getTime() -
                b.getFechaHoraInicioRegistroMuestras().getTime());
        }
        return seriesPorEstacion;
    }
    /*TODO:
      -----------------------------------------------------------------
      -------------------------------------------------------------
      --------------------------------------------------*/
    /** Paso 5 – Consulta directa desde Gestor */
    esAutodetectado() {
        // Paso 6 – Delegación a Estado
        return this.estadoActual.esAutoDetectado();
    }
    /** Paso 7 – Consulta directa desde Gestor */
    esPendienteDeRevision() {
        // Paso 8 – Delegación a Estado
        return this.estadoActual.esPendienteDeRevision();
    }
    /** Paso 9 – DTO con los campos principales */
    getDatosPrincipaless() {
        return {
            id: this.id,
            fechaHoraOcurrencia: this.getFechaHoraOcurrenciaa(),
            latitudEpicentro: this.getLatitudEpicentroo(),
            longitudEpicentro: this.getLongitudEpicentroo(),
            latitudHipocentro: this.getLatitudHipocentroo(),
            longitudHipocentro: this.getLongitudHipocentroo(),
            valorMagnitud: this.getValorMagnitudd(),
        };
    }
    // Métodos de acceso individuales (pasos 10–15)
    getFechaHoraOcurrenciaa() {
        return this.fechaHoraOcurrencia;
    }
    getLatitudEpicentroo() {
        return this.latitudEpicentro;
    }
    getLongitudEpicentroo() {
        return this.longitudEpicentro;
    }
    getLatitudHipocentroo() {
        return this.latitudHipocentro;
    }
    getLongitudHipocentroo() {
        return this.longitudHipocentro;
    }
    getValorMagnitudd() {
        return this.valorMagnitud;
    }
}
EventoSismico.contador = 1;
exports.default = EventoSismico;
