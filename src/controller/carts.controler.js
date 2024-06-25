import { UsuariosManagerMongo as UsuarioManager } from "../dao/UsuariosManagerMongo.js";
import { cartsService } from "../repository/Carts.service.js";
import { productosService } from "../repository/Products.service.js";
import { ticketService } from "../repository/Ticket.service.js";
import __dirname from "../utils.js";
import { isValidObjectId } from "mongoose";

const usuarioService = new UsuarioManager();

export class CartsControler {
  static postCart = async (req, res) => {
    const id = Date.now().toString();

    try {
      let newCart = await cartsService.addCart({ id });
      res.json(newCart);
    } catch {
      console.error("error al crear carrito");
    }
  };

  static getAllCarts = async (req, res) => {
    try {
      let tomar = await cartsService.getAll();
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ tomar });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: error.message });
    }
  };

  static getCartId = async (req, res) => {
    try {
      const { cid } = req.params;

      if (!isValidObjectId(cid)) {
        return res
          .status(400)
          .json({ error: "Ingrese un ID de carrito válido" });
      }

      const carrito = await cartsService.getCartByIdPopulate({ _id: cid });

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
  };

  static deleteCartId = async (req, res) => {
    try {
      const { cid } = req.params;

      if (!isValidObjectId(cid)) {
        return res
          .status(400)
          .json({ error: "Ingrese un ID de carrito válido" });
      }

      const carrito = await cartsService.getCartByIdPopulate({ _id: cid });

      if (!carrito) {
        return res
          .status(404)
          .json({ error: `No se encontró ningún carrito con el ID ${cid}` });
      }

      let product = [];

      let eliminarCart = await cartsService.deleteCart(cid);

      return res
        .status(200)
        .json({ Message: "Se eliminaron todos los productos" });
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static putCart = async (req, res) => {
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Ingrese un cid válido` });
    }

    let products = [];

    try {
      const updatedCart = await cartsService.update(cid, products);

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
  };

  static postProdCart = async (req, res) => {
    let { cid, pid } = req.params;
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Ingrese cid / pid válidos` });
    }

    let carrito = await cartsService.getCartById({ _id: cid });
    if (!carrito) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Carrito inexistente: id ${cid}` });
    }

    let producto = await productosService.getProductByCode({ _id: pid });
    if (!producto) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `No existe producto con id ${pid}` });
    }

    let indiceProducto = carrito.products.findIndex((p) => p.product == pid);
    if (indiceProducto === -1) {
      carrito.products.push({
        product: pid,
        quantity: 1,
      });

      carrito.total += producto.price;
    } else {
      carrito.products[indiceProducto].quantity++;
      carrito.total = await calculateTotal(carrito.products);
    }

    async function calculateTotal(products) {
      let total = 0;
      for (const item of products) {
        try {
          const product = await productosService.getProductByCode(
            item.product._id
          );
          if (product) {
            total += product.price * item.quantity;
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
      return total;
    }

    let resultado = await cartsService.update(cid, carrito);
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
  };

  static putProdCart = async (req, res) => {
    let { cid, pid } = req.params;
    let cantidad = req.body.cantidad;

    cantidad = Number(cantidad);


    if (isNaN(cantidad)) {
      res
        .status(400)
        .json({ Error: "La cantidad proporcionada no es un número válido" });
    }
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Ingrese cid / pid / cantidad /` });
    }

    let carrito = await cartsService.getCartById({ _id: cid });
    if (!carrito) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Carrito inexistente: id ${cid}` });
    }

    let producto = await productosService.getProductByCode({ _id: pid });
    if (!producto) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `No existe producto con id ${pid}` });
    }

    let indiceProducto = carrito.products.findIndex((p) => p.product == pid);
    if (indiceProducto === -1) {
      res.status(401).json({ Error: "No existe producto en el carrito" });
    } else {
      carrito.products[indiceProducto].quantity += cantidad;
    }

    let total = 0;
    for (const item of carrito.products) {
      try {
        const product = await productosService.getProductByCode(item.product);
        if (product) {
          total += product.price * item.quantity;
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    total;

    carrito.total = total;

    let resultado = await cartsService.update(cid, carrito);
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
  };

  static deleteProdCart = async (req, res) => {
    let { cid, pid } = req.params;
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Ingrese cid / pid válidos` });
    }

    let carrito = await cartsService.getCartById({ _id: cid });
    if (!carrito) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Carrito inexistente: id ${cid}` });
    }

    let producto = await productosService.getProductByCode({ _id: pid });
    if (!producto) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `No existe producto con id ${pid}` });
    }

    let indiceProducto = carrito.products.findIndex((p) => p.product == pid);
    if (indiceProducto === -1) {
      res.status(401).json({ Error: "No existe producto en el carrito" });
    } else {
      carrito.products.splice(indiceProducto, 1);
    }

    let total = 0;
    for (const item of carrito.products) {
      try {
        const product = await productosService.getProductByCode(item.product);
        if (product) {
          total += product.price * item.quantity;
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    total;

    carrito.total = total;

    let resultado = await cartsService.update(cid, carrito);
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
  };

  static validarCompra = async (req, res) => {
    let { cid } = req.params;

    let carrito = await cartsService.getCartById({ _id: cid });
    if (!carrito) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Carrito inexistente: id ${cid}` });
    }

    let usuario = await usuarioService.getBy({ cart: cid });

    let productosAComprar = [];
    let productosAGuardar = [];

    for (let item of carrito.products) {
      let product = await productosService.getProductByCode(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Producto inexistente: id ${item.product}` });
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await productosService.updateProduct(product._id, product);

        productosAComprar.push({
          product: product._id,
          quantity: item.quantity,
        });
      } else {
        productosAGuardar.push({
          product: product._id,
          quantity: item.quantity,
        });
      }
    }

    carrito.products = productosAGuardar;

    let total = 0;
    for (const item of carrito.products) {
      try {
        const product = await productosService.getProductByCode(item.product);
        if (product) {
          total += product.price * item.quantity;
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    total;

    carrito.total = total;

    await cartsService.update(cid, carrito);

    let totalCrado = 0;
    for (const item of productosAComprar) {
      try {
        const product = await productosService.getProductByCode(item.product);
        if (product) {
          totalCrado += product.price * item.quantity;
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    totalCrado;

    let email = usuario.email;

    let ticket = await ticketService.create(totalCrado, email);

    if (!usuario.tickets) {
      // Si el usuario no tiene un array de tickets definido
      // Crear un nuevo array con el ticket
      // Asignar el array de tickets al usuario
      let id = usuario._id;

      try {
        let updateTicket = await usuarioService.update(id, ticket);
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Usuario actualizado"});
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        // Manejar el error según sea necesario
      }
    } else {
      // Si el usuario ya tiene un array de tickets definido
      usuario.tickets.push(ticket); // Agregar el nuevo ticket al array existente
    }

    res.status(200).json({
      message: "Compra validada correctamente",
      ticket: ticket,
      productosNoComprados: productosAGuardar,
    });
  };
} //fin copntroler
