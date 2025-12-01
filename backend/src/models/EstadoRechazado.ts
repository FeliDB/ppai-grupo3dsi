import { Estado } from "./Estado";

export default class EstadoRechazado extends Estado {
  constructor() {
    super("EventoSismico", "rechazado");
  }
  public override esRechazado(): boolean { return true; }
}
