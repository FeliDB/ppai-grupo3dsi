/**
 * 
 * Convierte el nombre de estado (string de la BD) en una instancia del Estado concreto correspondiente.
 * Esto permite "hidratar" objetos de dominio desde la base de datos.
 */

import { Estado } from "./Estado"
import EstadoAutoDetectado from "./EstadoAutoDetectado"
import EstadoAutoConfirmado from "./EstadoAutoConfirmado"
import EstadoPendienteRevision from "./EstadoPendienteRevision"
import EstadoBloqueadoRevision from "./EstadoBloqueadoRevision"
import EstadoConfirmado from "./EstadoConfirmado"
import EstadoRechazado from "./EstadoRechazado"
import EstadoDerivadoExperto from "./EstadoDerivadoExperto"

export default class FabricaEstado {
  /**
   * Crea una instancia del Estado concreto basándose en el nombre almacenado en BD
   * @param nombreEstado - Nombre del estado desde la base de datos
   * @returns Instancia del Estado concreto correspondiente
   */
  static crearPorNombre(nombreEstado: string): Estado {
    switch (nombreEstado) {
      case 'auto_detectado':
        return new EstadoAutoDetectado()
      case 'auto_confirmado':
        return new EstadoAutoConfirmado()
      case 'pendiente_de_revision':
        return new EstadoPendienteRevision()
      case 'bloqueado_en_revision':
        return new EstadoBloqueadoRevision()
      case 'confirmado':
        return new EstadoConfirmado()
      case 'rechazado':
        return new EstadoRechazado()
      case 'derivado_experto':
        return new EstadoDerivadoExperto()
      default:
        throw new Error(`Estado desconocido: ${nombreEstado}`)
    }
  }
}
