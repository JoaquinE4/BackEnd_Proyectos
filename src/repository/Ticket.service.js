import { TicketManagerMongo as TicketManager } from "../dao/TicketManagerMongo.js";

class TicketService {
  constructor(dao) {
    this.dao = dao;
  }

  create = async (total, email) => {
    let codeGen = () => {
      const length = 8;
      const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let resultado = "";

      for (let i = 0; i < length; i++) {
        resultado += caracteres.charAt(
          Math.floor(Math.random() * caracteres.length)
        );
      }
      return resultado;
    };

    const code = codeGen();

    let ticket = {
      code,
      purchaser: email,
      amount: total,
    };

    return await this.dao.create(ticket);
  };
}

export const ticketService = new TicketService(new TicketManager());
