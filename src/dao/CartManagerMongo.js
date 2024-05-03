import { cartModel } from "./models/Modelos.js";
import ProductManager from "./ProductManagerMongo.js";

const productManager = new ProductManager()



export class CartManager {


    async addCart(cart) {
        return await cartModel.create(cart)
    }

    async getCartById(filtro) {
        return await cartModel.findOne(filtro)
    }

    async addProducts(cid, pid) {
        const cart = await this.getCartById({ id: cid });

        if (!cart) {
            throw new Error("El carrito no existe");
        }

        const product = await productManager.getProductByCode({ id: pid })

        if (!product) {
            throw new Error("El producto no existe");
        }

        const seachProduct = await cartModel.findOne({ $and: [{ id: cid }, { 'products.product': pid }] });

        if (seachProduct) {
            const sumar = await cartModel.updateOne(
                { id: cid, 'products.product': pid },
                { $inc: { 'products.$.quantity': 1 } }
            );

        } else {
            const agregar = await cartModel.updateOne({ id: cid }, { $set: { products: { product: product.id, quantity: 1 } } })
        }
    }





}
