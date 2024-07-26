import { UsuariosManagerMongo as UsuarioService } from "../dao/UsuariosManagerMongo.js";
import { cartsService } from "../repository/Carts.service.js";
import { productosService } from "../repository/Products.service.js";
import __dirname from "../utils.js";
import { CustomError } from "../utils/CustomError.js";

const usuarioService = new UsuarioService();
export class VistasControler {
  static getInicio = async (req, res) => {
    let { pagina } = req.query;
  
    
    if (!pagina) {
      pagina = 1;
    }

    let {
      docs: productos,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = await productosService.getProductsPaginate(pagina);

    res.setHeader("Content-type", "text/html");
    res.status(200).render("home", {
      productos,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    });
  };

  static getRealTime = async (req, res) => {
    let { pagina } = req.query;

    if (!pagina) {
      pagina = 1;
    }
    let {
      docs: productos,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = await productosService.getProductsPaginate(pagina);

    res.setHeader("Content-type", "text/html");
    res.status(200).render("realTimeProducts", {
      productos,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    });
  };

  static getChat = (req, res) => {
    
    res.status(200).render("chat");
  };

  static getProducts = async (req, res) => {
    let { pagina } = req.query;

    if (!pagina) {
      pagina = 1;
    }
    let id = req.session.user.cart;
    let carrito = await cartsService.getCartByIdPopulate({ _id: id });

    if (!carrito) {
      return res
        .status(404)
        .json({ error: `No se encontró ningún carrito con el ID ${id}` });
    }

    try {
      let {
        docs: productos,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = await productosService.getProductsPaginate(pagina);
 
      res.setHeader("Content-Type", "text/html");
      res.status(200).render("products", {
        productos,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        carrito,
        usuario: req.session.user,
      });
    } catch (error) {
      req.logger.error(error)
      next(CustomError.createError("Error interno del servidor","Error interno del servidor","Error interno del servidor", TIOPOS_ERROR.INTERNAL_SERVER_ERROR))
      

    }
  };

  static getCarts = async (req, res) => {
    let id = req.session.user.cart;
    let carrito = await cartsService.getCartByIdPopulate({ _id: id });

    if (!carrito) {
      return res
        .status(404)
        .json({ error: `No se encontró ningún carrito con el ID ${cid}` });
    }

    res.setHeader("Content-Type", "text/html");
    res.status(200).render("cart", {
      carrito,
    });
  };

  static getRegistro = (req, res) => {
    res.status(200).render("registro");
  };

  static getLogin = (req, res) => {
    let { error } = req.query;

    res.status(200).render("login", { error });
  };

  static getPerfil = (req, res) => {
    res.status(200).render("perfil", {
      usuario: req.session.user,
    });
  };

  static getTicket = async (req, res) => {
    let uid = req.session.user._id;
    let cid = req.session.user.cart;

    let carrito = await cartsService.getCartByIdPopulate({ _id: cid });

    let usuario = await usuarioService.getBy({ _id: uid });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (!usuario.ticket || usuario.ticket.length === 0) {
      return res.status(404).json({ mensaje: "El usuario no tiene tickets" });
    }
    const ultimoTicket = usuario.ticket[usuario.ticket.length - 1];

    res.status(200).render("ticket", { ultimoTicket, usuario, carrito });
  };

  static resPassword = async (req, res) => {

    const { token } = req.params;
    console.log(token);
    res.render('recuperar', { token });

  }

  
} //fin controler
