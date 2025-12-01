import CambioEstado from "./CambioEstado";

// Forward declaration
export type EventoSismicoType = {
  agregarCambioEstado(cambioEstado: CambioEstado): void;
  setEstadoActual(estado: Estado): void;
  getValorMagnitud(): number;
  getOrigenDeGeneracion(): any;
  getClasificacionSismo?(): any; // Opcional por ahora (comentado en EventoSismico)
}

export abstract class Estado {
  private ambito: string;
  private nombreEstado: string;

  constructor(ambito: string, nombreEstado: string) {
    this.ambito = ambito;
    this.nombreEstado = nombreEstado;
  }

  // ==========================================
  // GETTERS Y CONSULTAS
  // ==========================================
  public getAmbito(): string { return this.ambito; }
  public getNombreEstado(): string { return this.nombreEstado; }

  // Por defecto todos false, los concretos sobrescriben el suyo a true
  public esAutoDetectado(): boolean { return false; }
  public esPendienteDeRevision(): boolean { return false; }
  public esConfirmado(): boolean { return false; }
  public esRechazado(): boolean { return false; }
  public esDerivadoExperto(): boolean { return false; }
  public esBloqueadoEnRevision(): boolean { return false; }
  public esAutoConfirmado(): boolean { return false; }

  // ==========================================
  // MÉTODOS DE TRANSICIÓN (Template Pattern)
  // Lanzan error por defecto.
  // ==========================================

  public bloquear(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    throw new Error(`No se puede bloquear un evento en estado ${this.nombreEstado}`);
  }

  public rechazar(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    throw new Error(`No se puede rechazar un evento en estado ${this.nombreEstado}`);
  }

  public confirmar(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    throw new Error(`No se puede confirmar un evento en estado ${this.nombreEstado}`);
  }

  public derivarAExperto(contexto: EventoSismicoType, fechaHoraActual: Date): void {
    throw new Error(`No se puede derivar a experto un evento en estado ${this.nombreEstado}`);
  }

  // Valida datos obligatorios antes de decisiones críticas
  public validarDatosCompletos(contexto: EventoSismicoType): boolean {
    const magnitud = contexto.getValorMagnitud();
    const origen = contexto.getOrigenDeGeneracion();
    const clasificacion = contexto.getClasificacionSismo?.();
    
    return magnitud !== null && magnitud !== undefined &&
           origen !== null && origen !== undefined &&
           (clasificacion === undefined || (clasificacion !== null));
  }

  // ==========================================
  // LÓGICA CENTRALIZADA (PROTECTED)
  // ==========================================

  /**
   * Método polimórfico auxiliar.
   * Se usa cuando hay un flujo lineal claro (ej: Pendiente -> Bloqueado).
   */
  public crearEstadoSiguiente(): Estado | null {
    return null;
  }

  /**
   * Crea el objeto CambioEstado vinculado al NUEVO estado.
   */
  public crearCambioEstado(fechaHoraInicio: Date): CambioEstado {
    // 'this' aquí se refiere a la instancia del NUEVO estado
    return new CambioEstado(this, fechaHoraInicio, null, null); 
  }

  /**
   * MÉTODO DE ORO: Centraliza toda la actualización del contexto.
   */
  protected hacerTransicion(contexto: EventoSismicoType, nuevoEstado: Estado, fechaHora: Date): void {
    // 1. Seteamos el estado en el contexto
    contexto.setEstadoActual(nuevoEstado);

    // 2. Creamos el historial usando el nuevo estado
    const nuevoCambioEstado = nuevoEstado.crearCambioEstado(fechaHora);

    // 3. Guardamos el historial
    contexto.agregarCambioEstado(nuevoCambioEstado);
  }
}