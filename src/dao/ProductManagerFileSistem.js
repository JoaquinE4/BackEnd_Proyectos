import fs from "fs";

export default class ProductManager {
  products;
  path;

  /*   constructor(productsFile) {
          this.counter = 1
          this.path = productsFile;
          this.products = this.getProductsFromFile();
          if (!fs.existsSync(productsFile)) {
              fs.writeFileSync(productsFile, JSON.stringify([]));
          }
      } */

  addProduct(title, description, price, thumbnail, code, stock) {
    if (this.products.some((product) => product.code === code)) {
      throw new Error("El código del producto ya existe");
    }

    const id = Date.now();

    const newProduct = {
      id,

      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status: true,
      date: new Date().toLocaleDateString(),
    };

    this.products.push(newProduct);
    this.saveProductsToFile(this.products);
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }
    this.products[index] = { ...this.products[index], ...updatedFields };
    this.saveProductsToFile(this.products);
    return this.products[index];
  }

  deleteProduct(id) {
    this.products = this.products.filter((product) => product.id !== id);
    this.saveProductsToFile(this.products);
  }

  getProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path);
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer el archivo:", error.message);
      return [];
    }
  }

  saveProductsToFile(products) {
    try {
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error al guardar en el archivo:", error.message);
    }
  }
}
