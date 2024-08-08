export class UsuarioDTO {
  constructor(usuario) {
    this._id = usuario._id
    this.first_name = usuario.first_name
    this.last_name = usuario.last_name ? usuario.last_name : null
    this.age = usuario.age
    this.email = usuario.email
    this.cart = usuario.cart
    this.rol = usuario.rol
  }
}
