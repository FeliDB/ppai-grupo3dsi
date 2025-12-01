import Estado from "./Estado";

export default class EstadoEnLinea extends Estado {
  constructor() {
    super("Sismografo", "en_linea");
  }

  esAutoDetectado(): boolean {
    return false;
  }

  esPendienteDeRevision(): boolean {
    return false;
  }

  esConfirmado(): boolean {
    return false;
  }

  esRechazado(): boolean {
    return false;
  }

  esDerivadoExperto(): boolean {
    return false;
  }

  esBloqueadoEnRevision(): boolean {
    return false;
  }
}
