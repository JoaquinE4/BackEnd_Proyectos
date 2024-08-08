import { ProductosModels } from "./models/Modelos.js";

export class ProductManagerMongo {
  async addProduct(producto) {
    return await ProductosModels.create(producto);
  }

  async getProducts() {
    return await ProductosModels.find().lean();
  }

  async getProductsPaginate(page) {
    return await ProductosModels.paginate({}, { limit: 10, page, lean: true });
  }

  async getProductByCode(filtro) {
    return await ProductosModels.findOne(filtro).lean();
  }

  async updateProduct(id, updatedFields) {
    const aModificar = await ProductosModels.findOneAndUpdate(
      {_id: id},
      updatedFields,
      { returnOriginal: false }
    );
  }

  deleteProduct(filtro = {}) {
    return ProductosModels.deleteOne(filtro);
  }
}
