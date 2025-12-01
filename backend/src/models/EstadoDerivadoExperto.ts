import { Estado } from "./Estado";

export default class EstadoDerivadoExperto extends Estado {
  constructor() {
    super("EventoSismico", "derivado_experto");
  }
  public override esDerivadoExperto(): boolean { return true; }
}
