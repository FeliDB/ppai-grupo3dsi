export default class TipoDeDato {
  private valorUmbral: number

  constructor(valorUmbral: number) {
    this.valorUmbral = valorUmbral
  }


  getValorUmbral() {
    return this.valorUmbral
  }
}
