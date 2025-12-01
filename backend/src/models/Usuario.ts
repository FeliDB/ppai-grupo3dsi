
export default class Usuario {
  private nombreUsuario: string
  private contraseña: string
  

  constructor(nombreUsuario: string,contraseña: string,) {
    this.nombreUsuario = nombreUsuario
    this.contraseña = contraseña
    
  }


  getEmpleado(){
    return this.nombreUsuario
    return this.contraseña
  }

}
