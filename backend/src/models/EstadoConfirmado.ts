import Estado from "./Estado";

export default class EstadoConfirmado extends Estado {
  constructor() {
    super("EventoSismico", "confirmado");
  }

  esAutoDetectado(): boolean {
    return false;
  }

  esPendienteDeRevision(): boolean {
    return false;
  }

  esConfirmado(): boolean {
    return true;
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
