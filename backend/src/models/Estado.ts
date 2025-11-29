
export abstract class Estado {
  private ambito: string
  private nombreEstado: string

  constructor(
    ambito: string,
    nombreEstado: string
  ) {
    this.ambito = ambito
    this.nombreEstado = nombreEstado
  }

  getAmbito() {
    return this.ambito
  }

  getNombreEstado() {
    return this.nombreEstado
  }

  esAutoDetectado() {
    return this.nombreEstado === "auto_detectado"
  }

  esPendienteDeRevision() {
    return this.nombreEstado === "pendiente_de_revision"
  }

  
  confirmar():void {}
  
  esRechazado() {
    return this.nombreEstado === "rechazado"
  }

  esDerivadoExperto() {
    return this.nombreEstado === "derivado_experto"
  }



  esBloqueadoEnRevision() {
    return this.nombreEstado === "bloqueado_en_revision"
  }

}
