
import { cartsService } from "../service/Carts.service.js";
import { productosService } from "../service/Products.service.js";
import __dirname from "../utils.js";


export class VistasControler{

    static getInicio= async (req, res) => {
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
    } 

    static getRealTime=async (req, res) => {
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
    }

    static getChat=(req, res) => {
        res.status(200).render("chat");
    }

    static getProducts=async (req, res) => {
        let { pagina } = req.query;
      
        if (!pagina) {
          pagina = 1;
        }
        console.log(req.session.user.cart);
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
           res.setHeader("Content-Type", "application/json");
          return res.status(500).json({
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `${error.message}`,
          });
        }
    }

    static getCarts= async (req, res) => {
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
    }

    static getRegistro= (req, res) => {
        res.status(200).render("registro");
    }

    static getLogin=(req, res) => {
        let { error } = req.query;
      
        res.status(200).render("login", { error });
    }

    static getPerfil=(req, res) => {
        res.status(200).render("perfil", {
          usuario: req.session.user,
        });
    }


}//fin controler