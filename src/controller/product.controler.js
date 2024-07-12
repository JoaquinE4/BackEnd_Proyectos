import { io } from "../app.js";
import { productosService } from "../repository/Products.service.js";
import { argumentosProductos } from "../utils/argumentosError.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERROR } from "../utils/Error.js";

export class ProductosControler {
  static getProduct = async (req, res, next) => {
    let { limit, sort, page } = req.query;
    limit = Number(limit);
    if (!limit || limit <= 0) {
      limit = 10;
    }
    page = Number(page);

    if (!page) {
      page = 1;
    }

    try {
      let { docs: productos } = await productosService.getProductsPaginate(
        page
      );

      if (sort) {
        if (sort === "asc") {
          productos = productos.sort((a, b) => a.price - b.price);
        } else if (sort === "desc") {
          productos = productos.sort((a, b) => b.price - a.price);
        }
      }

      if (limit && limit > 0) {
        productos = productos.slice(0, limit);
      }

      req.logger.debug("Exito al buscar todos los productos");
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ productos });
    } catch (error) {
      req.logger.error(error);

      next(error);
    }
  };

  static getProductId = async (req, res, next) => {
    let id = req.params.pid;

    if (!isNaN(id)) {
      CustomError.createError(
        "Error ID invalido",
        "Error ID invalido",
        "Error ID invalido",
        TIPOS_ERROR.ARGUMENTOS_INVALIDOS
      );
    }

    try {
      let productId = await productosService.getProductByCode({ _id: id });
      req.logger.debug("Exito al buscar producto" + productId);

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ productId });
    } catch (error) {
      req.logger.error(error);

      next(error);
    }
  };

  static postProduct = async (req, res, next) => {
    let newProduct;
    try {
      let { title, description, price, thumbnail, code, stock } = req.body;

      if (!title || !description || !price || !thumbnail || !code || !stock) {
        CustomError.createError(
          "Error Faltandatos Complete los datos solicitados",
          argumentosProductos(req.body),
          "Error Faltandatos Complete los datos solicitados",
          TIPOS_ERROR.ARGUMENTOS_INVALIDOS
        );
      }

      let existe = await productosService.getProductByCode({ code });
      if (existe) {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: "Ya existe un producto con este código" });
      }

      const id = Date.now().toString();
      newProduct = await productosService.addProduct({
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
      req.logger.debug("Exito al agregar producto");
      res.setHeader("Content-Type", "application/json");
      res.status(201).json({
        message: "Producto agregado correctamente",
        product: newProduct,
      });
    } catch (error) {
      req.logger.error(error);

      next(error);
    }
    io.emit("nuevoProducto", newProduct);
  };

  static putProduct = async (req, res, next) => {
    let id = req.params.pid;
    let updatedFields = req.body;
    id = Number(id);
    if (isNaN(id)) {
      CustomError.createError(
        "Error ID invalido",
        "Error ID invalido",
        "Error ID invalido",
        TIPOS_ERROR.ARGUMENTOS_INVALIDOS
      );
    }

    try {
      let updatedProduct = await productosService.updateProduct(
        { id },
        updatedFields
      );
      req.logger.debug(" Exito al editar producto ");

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        message: "Producto actualizado correctamente",
        product: updatedProduct,
      });
    } catch (error) {
      req.logger.error(error);

      next(error);
    }
  };

  static deleteProduct = async (req, res, next) => {
    let id = req.params.pid;

    let productos;
    if (!isNaN(id)) {
      CustomError.createError(
        "Error ID invalido",
        "Error ID invalido",
        "Error ID invalido",
        TIPOS_ERROR.ARGUMENTOS_INVALIDOS
      );
    }
    try {
      let eliminarproducto = await productosService.deleteProduct({ _id: id });
      req.logger.debug("Exito al eliminar producto");

      res.json({ message: "Producto Eliminado" });
      productos = await productManager.getProducts();

      io.emit("delete", productos);
    } catch {
      req.logger.error(error);

      next(error);
    }
  };
} //fin controler
