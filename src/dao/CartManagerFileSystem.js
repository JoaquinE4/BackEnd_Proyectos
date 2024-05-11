import fs from "fs";
import ProductJson from "../data/productos.json" assert { type: "json" };

const productJson = ProductJson;
export class CartManager {
  constructor(cartFile) {
    this.path = cartFile;
    this.carts = this.getCartsFromFile();
    if (!fs.existsSync(cartFile)) {
      fs.writeFileSync(cartFile, JSON.stringify([]));
    }
  }

  addCart() {
    const id = Date.now();
    if (this.carts.some((cart) => cart.id === id)) {
      throw new Error("El carrito con el id  ya existe");
    }

    const newCart = {
      id: id,
      products: [],
    };

    this.carts.push(newCart);
    this.saveCartToFile(this.carts);
    return newCart;
  }

  getCartById(id) {
    const cart = this.carts.find((cart) => cart.id === id);
    if (!cart) {
      throw new Error("Producto no encontrado");
    }
    return cart;
  }
  addProducts(cid, pid) {
    const cart = this.getCartById(cid);
    if (!cart) {
      throw new Error("El carrito no existe");
    }
    const product = productJson.find((product) => product.id === pid);
    if (!product) {
      throw new Error("El producto no existe");
    }

    const seachProduct = cart.products.find((item) => item.product === pid);

    if (seachProduct) {
      seachProduct.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    this.saveCartToFile(this.carts);
  }

  getCartsFromFile() {
    try {
      const data = fs.readFileSync(this.path);
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer el archivo:", error.message);
      return [];
    }
  }

  saveCartToFile(cart) {
    try {
      fs.writeFileSync(this.path, JSON.stringify(cart, null, 2));
    } catch (error) {
      console.error("Error al guardar en el archivo:", error.message);
    }
  }
}
