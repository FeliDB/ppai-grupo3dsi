import TipoDato from "./TipoDato"

export default class DetalleMuestraSismica {
  private valor: number
  private tipoDato: TipoDato

  constructor(
    valor: number,
    tipoDato: TipoDato
  ) {
    this.valor = valor
    this.tipoDato = tipoDato
  }

  getDatos() {
    return {
      tipoDeDato: this.tipoDato,
      valor: this.valor
    }
  }

  getTipoDato(): TipoDato {
    return this.tipoDato
  }

  getValor(): number {
    return this.valor
  }

  /**
   * Paso 146 del diagrama de clases: Obtener el detalle de muestra sísmica
   * @returns Esta instancia de DetalleMuestraSismica
   */
  getDetalleMuestraSismica(): DetalleMuestraSismica {
    return this
  }

  /**
   * Obtener el valor del detalle
   * @returns Valor numérico del detalle
   */
  getValorUmbral(): number {
    return this.valor
  }
}
