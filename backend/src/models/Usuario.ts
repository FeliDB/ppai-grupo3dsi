
export default class Usuario {
  private nombreUsuario: string;
  private contrasena: string;

  constructor(nombreUsuario: string, contrasena: string) {
    this.nombreUsuario = nombreUsuario;
    this.contrasena = contrasena;
  }

  getEmpleado(): Usuario {
    return this;
  }

  getNombreUsuario(): string {
    return this.nombreUsuario;
  }
}
