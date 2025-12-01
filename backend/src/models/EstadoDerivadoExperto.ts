import Estado from "./Estado";

export default class EstadoDerivadoExperto extends Estado {
  constructor() {
    super("EventoSismico", "derivado_experto");
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
    return true;
  }

  esBloqueadoEnRevision(): boolean {
    return false;
  }
}
