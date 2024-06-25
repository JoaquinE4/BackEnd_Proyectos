export class UsuarioDTO {
  constructor(usuario) {
    delete usuario.password;
    return usuario;
  }
}
