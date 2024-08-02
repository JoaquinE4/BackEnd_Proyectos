import { usuarioModelo } from "./models/usuario.model.js";

export class UsuariosManagerMongo {
  async create(usuario) {
    return await usuarioModelo.create(usuario);
  }

  async getAll(){
    return await usuarioModelo.find().lean()
  }

  async getBy(filtro = {}) {
    return await usuarioModelo.findOne(filtro).lean();
  }
  async getByPopulate(filtro = {}) {
    return await usuarioModelo.findOne(filtro).populate("cart").lean();
  }

  async update(id, ticket) {
    return await usuarioModelo.findOneAndUpdate(
      { _id: id },
      { $push: { ticket } },
      { new: true }
    );
  }

  async updatePassword(id,newPassword){
   return await usuarioModelo.findOneAndUpdate(
      { _id: id },
      { password: newPassword },
      { new: true }
  );
  }
  async updateRol(id,rol){
   return await usuarioModelo.findOneAndUpdate(
      { _id: id },
      { rol: rol },
      { new: true }
  );
  }

}
