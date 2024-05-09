import { Router } from "express";
import { CartManager } from "../dao/CartManagerMongo.js";
import ProductManager from "../dao/ProductManagerMongo.js";
import __dirname from "../utils.js";
import { isValidObjectId } from "mongoose";

export const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  const id = Date.now().toString();

  try {
    let newCart = await cartManager.addCart({ id });
    res.json(newCart);
  } catch {
    console.log("error al crear carrito");
  }
});

router.get("/", async (req, res) => {
  try {
    let tomar = await cartManager.getAll();
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ tomar });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
      return res.status(400).json({ error: "Ingrese un ID de carrito válido" });
    }

    const carrito = await cartManager.getCartByIdPopulate({ _id: cid });

    if (!carrito) {
      return res
        .status(404)
        .json({ error: `No se encontró ningún carrito con el ID ${cid}` });
    }

    return res.status(200).json({ carrito });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
      return res.status(400).json({ error: "Ingrese un ID de carrito válido" });
    }

    const carrito = await cartManager.getCartByIdPopulate({ _id: cid });

    if (!carrito) {
      return res
        .status(404)
        .json({ error: `No se encontró ningún carrito con el ID ${cid}` });
    }

    let product = [];

    let eliminarCart = await cartManager.deleteCart(cid);

    return res
      .status(200)
      .json({ Message: "Se eliminaron todos los productos" });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid", async (req, res) => {
  let { cid } = req.params;
  if (!isValidObjectId(cid)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese un cid válido` });
  }

  let products = [];

  try {
    const updatedCart = await cartManager.update(cid, products);

    if (updatedCart) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(200)
        .json({ message: "Carrito actualizado correctamente" });
    } else {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `No se encontró el carrito con el id ${cid}` });
    }
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(500)
      .json({ error: `Error al actualizar el carrito: ${error.message}` });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese cid / pid válidos` });
  }

  let carrito = await cartManager.getCartById({ _id: cid });
  if (!carrito) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Carrito inexistente: id ${cid}` });
  }

  let producto = await productManager.getProductByCode({ _id: pid });
  if (!producto) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `No existe producto con id ${pid}` });
  }

  console.log(carrito);
  let indiceProducto = carrito.products.findIndex((p) => p.product == pid);
  if (indiceProducto === -1) {
    carrito.products.push({
      product: pid,
      quantity: 1,
    });
  } else {
    carrito.products[indiceProducto].quantity++;
  }

  let resultado = await cartManager.update(cid, carrito);
  if (resultado.modifiedCount > 0) {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Carrito actualizado" });
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `No se pudo realizar la actualizacion`,
    });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  let cantidad = req.body.cantidad;

  cantidad = Number(cantidad);

  console.log(cantidad, typeof cantidad);

  if (isNaN(cantidad)) {
    res
      .status(400)
      .json({ Error: "La cantidad proporcionada no es un número válido" });
  }
  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese cid / pid / cantidad /` });
  }

  let carrito = await cartManager.getCartById({ _id: cid });
  if (!carrito) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Carrito inexistente: id ${cid}` });
  }

  let producto = await productManager.getProductByCode({ _id: pid });
  if (!producto) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `No existe producto con id ${pid}` });
  }

  console.log(carrito);
  let indiceProducto = carrito.products.findIndex((p) => p.product == pid);
  if (indiceProducto === -1) {
    res.status(401).json({ Error: "No existe producto en el carrito" });
  } else {
    carrito.products[indiceProducto].quantity += cantidad;
  }

  let resultado = await cartManager.update(cid, carrito);
  if (resultado.modifiedCount > 0) {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Cantidad actualizada" });
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `No se pudo realizar la actualizacion`,
    });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese cid / pid válidos` });
  }

  let carrito = await cartManager.getCartById({ _id: cid });
  if (!carrito) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Carrito inexistente: id ${cid}` });
  }

  let producto = await productManager.getProductByCode({ _id: pid });
  if (!producto) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `No existe producto con id ${pid}` });
  }

  let indiceProducto = carrito.products.findIndex((p) => p.product == pid);
  if (indiceProducto === -1) {
    res.status(401).json({ Error: "No existe producto en el carrito" });
  } else {
    carrito.products.splice(indiceProducto, 1);
  }

  let resultado = await cartManager.update(cid, carrito);
  if (resultado.modifiedCount > 0) {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Producto eliminado" });
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `No se pudo realizar la actualizacion`,
    });
  }
});
