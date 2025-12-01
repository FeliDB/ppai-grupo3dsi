import Estado from "./Estado";

export default class EstadoAutoConfirmado extends Estado {
  constructor() {
    super("EventoSismico", "auto_confirmado");
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
