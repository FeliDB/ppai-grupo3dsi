export default class Sesion {
 private nombre:string   

 constructor(nombre:string) {
    this.nombre = nombre
 }

 public obtenerUsuarioLogueado(): any {
    return this.nombre
 }
}