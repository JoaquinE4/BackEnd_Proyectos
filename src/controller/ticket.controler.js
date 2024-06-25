import { TicketService } from "../repository/Ticket.service.js";
import { cartsService } from "../repository/Carts.service.js";

const ticketService = new TicketService();

export class TicketController {
  static create = async (req, res) => {
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

    let pucharse = req.session.user.email;

    let total = getCart.total;
  };
}
