import { cartModel } from "./models/Modelos.js";
import ProductManager from "./ProductManagerMongo.js";

const productManager = new ProductManager();

export class CartManager {
  async getAll() {
    return cartModel.find().lean();
  }

  async addCart(cart) {
    return await cartModel.create(cart);
  }

  async getCartById(filtro = {}) {
    return await cartModel.findOne(filtro).lean();
  }
  async getCartByIdPopulate(filtro = {}) {
    return await cartModel.findOne(filtro).populate("products.product").lean();
  }

  async update(id, product) {
    return await cartModel.updateOne({ _id: id }, product);
  }

  async deleteCart(id) {
    return await cartModel.updateOne({ _id: id }, { $set: { products: [] } });
  }
}
