"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data/data");
const estados_1 = require("../data/estados");
const Sesion_1 = __importDefault(require("../models/Sesion"));
class GestorRevisionSismos {
    constructor() {
        // Utiliza la fuente de datos real de eventos sismicos
        this.eventos = data_1.eventosSismicos;
    }
    iniciarSesion(nombreUsuario, contraseña) {
        const usuario = data_1.usuarios.find((usuario) => usuario.getNombreUsuario() === nombreUsuario && usuario.getContraseña() === contraseña);
        if (!usuario) {
            throw new Error("Credenciales incorrectas");
        }
        Sesion_1.default.iniciarSesion(usuario);
    }
    /*
    // TODO: separar el map en getDatosPrincipales()
    // NOTE: listo
    obtenerEventosSismicosAutodetectados() {
      const eventosAutodetectados = eventosSismicos
      .filter(evento =>
      evento.getEstadoActual().esAutoDetectado() ||
      evento.getEstadoActual().esPendienteDeRevision()
      ) // Filtra por estado autodetectado o pendiente_de_revision
        .sort((a, b) =>
          a.getFechaHoraOcurrencia().getTime() - b.getFechaHoraOcurrencia().getTime()
        ) // Ordena por fechaHoraOcurriencia
        .map(evento => evento.getDatosPrincipales()); // Obtiene los datosPrincipales
  
      return eventosAutodetectados;
    }
  */
    // -------------------------------------------------------------------------
    // Paso 4 – filtrar
    buscarEventosSismicosAutoDetectados() {
        return this.eventos.filter((evento) => evento.esAutodetectado() || evento.esPendienteDeRevision());
    }
    // Paso 16 – ordenar
    ordenarEventosSismicos(eventos) {
        return [...eventos].sort((a, b) => a.getFechaHoraOcurrencia().getTime() - b.getFechaHoraOcurrencia().getTime());
    }
    // Paso 17 – obtener datos principales para la UI
    obtenerEventosSismicosAutodetectados() {
        const candidatos = this.buscarEventosSismicosAutoDetectados();
        const ordenados = this.ordenarEventosSismicos(candidatos);
        return ordenados.map((e) => e.getDatosPrincipales());
    }
    // -------------------------------------------------------------------------
    //TODO* ACA EMPIEZA EL PASO 28 HAY QUE REVISAR Y PREGUNTAR CON EL RAMIRO QUE HIZO EL
    buscarEstadoBloqueado() {
        const estados = Object.values(estados_1.ESTADOS);
        return estados.find((estado) => estado.esAmbitoEventoSismico() && estado.esBloqueadoEnRevision());
    }
    /* Corresponde al mensaje 23: tomarFechaHoraActual()
    */
    tomarFechaHoraActual() {
        return new Date();
    }
    buscarEmpleadoLogueado() {
        const sesion = Sesion_1.default.getSesionActual();
        const usuario = sesion.getUsuarioLogueado();
        const empleado = usuario.getEmpleado();
        return empleado;
    }
    /*
    obtenerSesionActual() {
      return Sesion.getSesionActual()
    }
    */
    buscarEventoSismico(id) {
        return this.eventosDisponibles.find(e => e['id'] === id);
    }
    get eventosDisponibles() {
        return this.eventos.filter(evento => evento.getEstadoActual().esAmbitoEventoSismico());
    }
    ejecutarBloqueo(eventoId, empleado, fecha) {
        const eventoSeleccionado = this.buscarEventoSismico(eventoId);
        if (eventoSeleccionado) {
            // MENSAJE 28: bloquear()
            eventoSeleccionado.bloquear(fecha, empleado);
            return eventoSeleccionado;
        }
        else {
            return null;
        }
    }
    //TODO ACA TERMINA EL PASO 28
    obtenerEventoPorId(id) {
        const evento = data_1.eventosSismicos.find((evento) => evento.getId() === id);
        if (!evento)
            return;
        return evento.getDatosPrincipales();
    }
    buscarDatosSismicos(id) {
        const evento = data_1.eventosSismicos.find((evento) => evento.getId() === id);
        if (!evento)
            throw new Error("Evento no encontrado");
        return {
            clasificacion: evento.getClasificacionSismo(),
            origenDeGeneracion: evento.getOrigenDeGeneracion(),
            seriesTemporales: this.buscarSeriesTemporales(id)
            // TODO: alcanceSismo: evento.getAlcances(),
        };
    }
    // TODO: AGREGAR METODO buscarSeriesTemporales()
    buscarSeriesTemporales(id) {
        const evento = data_1.eventosSismicos.find((evento) => evento.getId() === id);
        if (!evento)
            throw new Error("Evento no encontrado");
        const seriesTemporales = evento.getSerieTemporal();
        const seriesPorEstacion = evento.clasificarPorEstacion(seriesTemporales);
        return seriesPorEstacion;
    }
    actualizarAPendienteRevision() {
        const fechaActual = new Date();
        data_1.eventosSismicos.forEach((evento) => {
            evento.actualizarAPendienteRevision(fechaActual);
        });
    }
    obtenerTodosLosUsuarios() {
        return data_1.usuarios.map((usuario) => ({
            nombreUsuario: usuario.getNombreUsuario(),
            empleado: usuario.getRILogueado()
        }));
    }
    // NOTE: el diagrama dice revisar()
    bloquearEvento(id) {
        const evento = data_1.eventosSismicos.find((evento) => evento.getId() === id);
        if (!evento)
            throw new Error("Evento no encontrado");
        const estadoActual = evento.getEstadoActual();
        if (!estadoActual.esAmbito("EventoSismico"))
            return;
        if (estadoActual.esBloqueadoEnRevision() ||
            estadoActual.esConfirmado() ||
            estadoActual.esRechazado() ||
            estadoActual.esDerivadoExperto())
            return; // Se verifica que estadoActual no sea ninguno de esos
        const usuario = Sesion_1.default.getSesionActual().getUsuarioLogueado();
        const empleado = usuario.getRILogueado();
        // WARN: REVISAR
        // NOTE: esta bien creo
        evento.cambiarEstadoA(estados_1.ESTADOS.bloqueado_en_revision, empleado);
    }
    rechazarEvento(id) {
        const evento = data_1.eventosSismicos.find((evento) => evento.getId() === id);
        if (!evento)
            throw new Error("Evento no encontrado");
        const estadoActual = evento.getEstadoActual();
        if (!estadoActual.esAmbito("EventoSismico"))
            return;
        const usuario = Sesion_1.default.getSesionActual().getUsuarioLogueado();
        const empleado = usuario.getRILogueado();
        evento.cambiarEstadoA(estados_1.ESTADOS.rechazado, empleado);
    }
    confirmarEvento(id) {
        const evento = data_1.eventosSismicos.find((evento) => evento.getId() === id);
        if (!evento)
            throw new Error("Evento no encontrado");
        const estadoActual = evento.getEstadoActual();
        if (!estadoActual.esAmbito("EventoSismico"))
            return;
        const usuario = Sesion_1.default.getSesionActual().getUsuarioLogueado();
        const empleado = usuario.getRILogueado();
        evento.cambiarEstadoA(estados_1.ESTADOS.confirmado, empleado);
    }
    derivarEvento(id) {
        const evento = data_1.eventosSismicos.find((evento) => evento.getId() === id);
        if (!evento)
            throw new Error("Evento no encontrado");
        const estadoActual = evento.getEstadoActual();
        if (!estadoActual.esAmbito("EventoSismico"))
            return;
        const usuario = Sesion_1.default.getSesionActual().getUsuarioLogueado();
        const empleado = usuario.getRILogueado();
        evento.cambiarEstadoA(estados_1.ESTADOS.derivado_experto, empleado);
    }
}
exports.default = GestorRevisionSismos;
