import DetalleMuestraSismica from "./DetalleMuestraSismica"

export default class MuestraSismica {
  private fechaHoraMuestra: Date
  private detalleMuestraSismica: DetalleMuestraSismica[]

  constructor(
    fechaHoraMuestra: Date,
    detalleMuestraSismica: DetalleMuestraSismica[]
  ) {
    this.fechaHoraMuestra = fechaHoraMuestra
    this.detalleMuestraSismica = detalleMuestraSismica
  }

  getDatos() {
    return {
      fechaHoraMuestra: this.fechaHoraMuestra,
      detalleMuestraSismica: this.detalleMuestraSismica
    }
  }

  /**
   
   * @returns Esta instancia de MuestraSismica
   */
  getMuestraSismica(): MuestraSismica {
    return this
  }

  /**
   * Paso 49 del CU: Obtener detalles de la muestra sísmica
   * @returns Array de DetalleMuestraSismica
   */
  getDetalleMuestraSismica(): DetalleMuestraSismica[] {
    return this.detalleMuestraSismica
  }
}
