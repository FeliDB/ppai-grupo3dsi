/**
 * ESTADOS - Instancias Singleton de los Estados del Patrón State
 * 
 * Este archivo centraliza la creación de instancias de estados concretos.
 * Cada estado implementa el comportamiento polimórfico definido en la clase abstracta Estado.
 * 
 * Patrón: State (GoF)
 * Uso: Importar ESTADOS.nombre_estado para obtener la instancia del estado deseado
 * 
 * Estados de EventoSismico:
 * - auto_confirmado: Evento confirmado automáticamente (magnitud >= 4.0)
 * - auto_detectado: Evento detectado automáticamente (magnitud < 4.0)
 * - pendiente_de_revision: Evento pendiente de revisión manual
 * - bloqueado_en_revision: Evento bloqueado mientras se revisa
 * - confirmado: Evento confirmado manualmente
 * - rechazado: Evento rechazado manualmente
 * - derivado_experto: Evento derivado a un experto
 * 
 * Estados de Sismógrafo:
 * - en_linea: Sismógrafo operativo
 */

import EstadoAutoConfirmado from "../models/EstadoAutoConfirmado"
import EstadoAutoDetectado from "../models/EstadoAutoDetectado"
import EstadoPendienteRevision from "../models/EstadoPendienteRevision"
import EstadoBloqueadoRevision from "../models/EstadoBloqueadoRevision"
import EstadoConfirmado from "../models/EstadoConfirmado"
import EstadoRechazado from "../models/EstadoRechazado"
import EstadoDerivadoExperto from "../models/EstadoDerivadoExperto"
import EstadoEnLinea from "../models/EstadoEnLinea"

export const ESTADOS = {
  // Estados de EventoSismico
  auto_confirmado: new EstadoAutoConfirmado(),
  auto_detectado: new EstadoAutoDetectado(),
  pendiente_de_revision: new EstadoPendienteRevision(),
  bloqueado_en_revision: new EstadoBloqueadoRevision(),
  confirmado: new EstadoConfirmado(),
  rechazado: new EstadoRechazado(),
  derivado_experto: new EstadoDerivadoExperto(),
  
  // Estados de Sismógrafo
  en_linea: new EstadoEnLinea()
}
