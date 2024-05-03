
import { ProductosModels } from "./models/Modelos.js";

export default class ProductManager {




    async addProduct(producto) {

        return await ProductosModels.create(producto)

    }

    async getProducts() {
        return await ProductosModels.find().lean()
    }


    async getProductByCode(filtro) {
        return await ProductosModels.findOne(filtro)


    }

    async updateProduct(id, updatedFields) {
        const producto = await ProductosModels.findOne(id)
        const aModificar = await ProductosModels.findOneAndUpdate(id, updatedFields, { returnOriginal: false })
    }

    deleteProduct(id) {

        return ProductosModels.deleteOne(id)
    }




}

