import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";

class CartsService {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async () => {
    return await this.dao.getAll();
  };

  addCart = async (cart) => {
    return await this.dao.addCart(cart);
  };

  getCartById = async (filtro) => {
    return await this.dao.getCartById(filtro);
  };

  getCartByIdPopulate = async (filtro) => {
    return await this.dao.getCartByIdPopulate(filtro);
  };

  update = async (id, product) => {
    return await this.dao.update(id, product);
  };

  deleteCart = async (id) => {
    return await this.dao.deleteCart(id);
  };
}

export const cartsService = new CartsService(new CartManager());
