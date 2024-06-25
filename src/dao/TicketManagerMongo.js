import { ticketModel } from "./models/Ticket.model.js";

export class TicketManagerMongo {
  async create(ticket) {
    return await ticketModel.create(ticket);
  }

  async get(ticket) {
    return await ticketModel.find().lean();
  }

  async getOneBy(filtro = {}) {
    return await ticketModel.findOne(filtro).lean();
  }
}
