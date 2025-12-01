import { Estado } from "./Estado";

export default class EstadoAutoConfirmado extends Estado {
  constructor() {
    super("EventoSismico", "auto_confirmado");
  }
  public override esAutoConfirmado(): boolean { return true; }
}
