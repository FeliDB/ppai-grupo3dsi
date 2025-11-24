import { eventosSismicos, usuarios } from "../data/data";
import { ESTADOS } from "../data/estados";
import Sesion from "../models/Sesion";
import EventoSismico from '../models/EventoSismico'; 
import DatosPrincipales from '../models/EventoSismico';
import Estado from '../models/Estado';
import Empleado from "../models/Empleado";

export default class GestorRevisionSismos {
  iniciarSesion(nombreUsuario: string, contraseña: string) {
    const usuario = usuarios.find((usuario) => usuario.getNombreUsuario() === nombreUsuario && usuario.getContraseña() === contraseña)

    if (!usuario) {
      throw new Error("Credenciales incorrectas")
    }

    Sesion.iniciarSesion(usuario)
  }
  
  // Utiliza la fuente de datos real de eventos sismicos
  private readonly eventos: EventoSismico[] = eventosSismicos;

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
  private buscarEventosSismicosAutoDetectados(): EventoSismico[] {
    return this.eventos.filter(
      (evento) => evento.esAutodetectado() || evento.esPendienteDeRevision(),
    )
  }
  
  // Paso 16 – ordenar
  private ordenarEventosSismicos(eventos: EventoSismico[]): EventoSismico[] {
    return [...eventos].sort(
      (a, b) => a.getFechaHoraOcurrencia().getTime() - b.getFechaHoraOcurrencia().getTime(),
    )
  }
  
  // Paso 17 – obtener datos principales para la UI
  public obtenerEventosSismicosAutodetectados(): any[] {
    const candidatos = this.buscarEventosSismicosAutoDetectados()
    const ordenados = this.ordenarEventosSismicos(candidatos)
    return ordenados.map((e) => e.getDatosPrincipales())
  }

  // -------------------------------------------------------------------------
 //TODO* ACA EMPIEZA EL PASO 28 HAY QUE REVISAR Y PREGUNTAR CON EL RAMIRO QUE HIZO EL
 

 buscarEstadoBloqueado(): Estado | undefined {
    const estados = Object.values(ESTADOS)
    return estados.find(
      (estado) => estado.esAmbitoEventoSismico() && estado.esBloqueadoEnRevision()
    )
  }
   /* Corresponde al mensaje 23: tomarFechaHoraActual()
   */
  private tomarFechaHoraActual(): Date {
    return new Date();
  }
  
  public  buscarEmpleadoLogueado(): Empleado {
      const sesion = Sesion.getSesionActual()
      const usuario = sesion.getUsuarioLogueado()
      const empleado = usuario.getEmpleado()
      return empleado
  }
  /*
  obtenerSesionActual() {
    return Sesion.getSesionActual()
  }
  */

  private buscarEventoSismico(id: string): EventoSismico | undefined {
    return this.eventosDisponibles.find(e => e['id'] === id);
  }
  private get eventosDisponibles(): EventoSismico[] {
    return this.eventos.filter(evento => evento.getEstadoActual().esAmbitoEventoSismico());
  }
  
  public ejecutarBloqueo(eventoId: string, empleado: Empleado, fecha: Date) {
    const eventoSeleccionado = this.buscarEventoSismico(eventoId);

    if (eventoSeleccionado) {

      // MENSAJE 28: bloquear()
      eventoSeleccionado.bloquear(fecha, empleado);

      return eventoSeleccionado;
    } else {
      return null;
    }
  }

//TODO ACA TERMINA EL PASO 28






  obtenerEventoPorId(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)

    if (!evento) return

    return evento.getDatosPrincipales()
  }

  buscarDatosSismicos(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)

    if (!evento) throw new Error("Evento no encontrado")

    return {
      clasificacion: evento.getClasificacionSismo(),
      origenDeGeneracion: evento.getOrigenDeGeneracion(),
      seriesTemporales: this.buscarSeriesTemporales(id)

      // TODO: alcanceSismo: evento.getAlcances(),
    }
  }

  // TODO: AGREGAR METODO buscarSeriesTemporales()
  buscarSeriesTemporales(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id);
    if (!evento) throw new Error("Evento no encontrado")

    const seriesTemporales = evento.getSerieTemporal()

    const seriesPorEstacion = evento.clasificarPorEstacion(seriesTemporales)

    return seriesPorEstacion;
  }

  actualizarAPendienteRevision() { // Metodo para actualizar el evento dsp de 5min
    const fechaActual = new Date()
    eventosSismicos.forEach((evento) => {
      evento.actualizarAPendienteRevision(fechaActual)
    })
  }

  obtenerTodosLosUsuarios() {
    return usuarios.map((usuario) => ({
      nombreUsuario: usuario.getNombreUsuario(),
      empleado: usuario.getRILogueado()
    }))
  }

  // NOTE: el diagrama dice revisar()
  bloquearEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return
    if (
      estadoActual.esBloqueadoEnRevision() ||
      estadoActual.esConfirmado() ||
      estadoActual.esRechazado() ||
      estadoActual.esDerivadoExperto()
    ) return // Se verifica que estadoActual no sea ninguno de esos

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getRILogueado()

    // WARN: REVISAR
    // NOTE: esta bien creo
    evento.cambiarEstadoA(ESTADOS.bloqueado_en_revision, empleado)
  }

  rechazarEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getRILogueado()

    evento.cambiarEstadoA(ESTADOS.rechazado, empleado)
  }

  confirmarEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getRILogueado()

    evento.cambiarEstadoA(ESTADOS.confirmado, empleado)
  }

  derivarEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getRILogueado()

    evento.cambiarEstadoA(ESTADOS.derivado_experto, empleado)
  }

}
