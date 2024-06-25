import { ProductManagerMongo as ProductManager } from "../dao/ProductManagerMongo.js";

class ProductService {
  constructor(dao) {
    this.dao = dao;
  }

  addProduct = async (producto) => {
    return await this.dao.addProduct(producto);
  };

  getProducts = async () => {
    return await this.dao.getProducts();
  };

  getProductsPaginate = async (page) => {
    return await this.dao.getProductsPaginate(page);
  };

  getProductByCode = async (filtro) => {
    return await this.dao.getProductByCode(filtro);
  };

  updateProduct = async (id, updatedFields) => {
    return await this.dao.updateProduct(id, updatedFields);
  };

  deleteProduct = async (filtro) => {
    return await this.dao.deleteProduct(filtro);
  };
}

export const productosService = new ProductService(new ProductManager());
