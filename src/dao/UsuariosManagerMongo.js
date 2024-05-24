import { usuarioModelo } from "./models/usuario.model.js";

export class UsuariosManagerMongo {
  async create(usuario) {
    return await usuarioModelo.create(usuario);
  }

  async getBy(filtro = {}) {
    return await usuarioModelo.findOne(filtro).lean();
  }
  async getByPopulate(filtro = {}) {
    return await usuarioModelo.findOne(filtro).populate("cart").lean();
  }
}
