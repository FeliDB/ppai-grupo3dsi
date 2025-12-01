import { Estado } from "./Estado";

export default class EstadoConfirmado extends Estado {
  constructor() {
    super("EventoSismico", "confirmado");
  }
  public override esConfirmado(): boolean { return true; }
}
