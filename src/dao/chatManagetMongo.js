import { MessageModel } from "./models/Modelos.js";

export default class Mensaje {
  async addMessage(mensaje) {
    return await MessageModel.create(mensaje);
  }

  async getMessage() {
    return await MessageModel.find().lean();
  }
}
