import { Router } from "express";
import ProductManager from "../dao/ProductManagerMongo.js";
import   {CartManager}   from "../dao/CartManagerMongo.js";
import __dirname from "../utils.js";
import { isValidObjectId } from "mongoose";

const productManager = new ProductManager();
const cartManager = new CartManager();
export const router = Router();



router.get("/", async (req, res) => {
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
    } = await productManager.getProductsPaginate(pagina);

    res.setHeader("Content-type", "text/html");
    res
        .status(200)
        .render("home", {
            productos,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        });
});

router.get("/realtimeproducts", async (req, res) => {
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
    } = await productManager.getProductsPaginate(pagina);

    res.setHeader("Content-type", "text/html");
    res
        .status(200)
        .render("realTimeProducts", {
            productos,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        });
});

router.get("/chat", (req, res) => {
    res.status(200).render("chat");
});

router.get("/products", async (req, res) => {
    let { pagina } = req.query;

    if (!pagina) {
        pagina = 1;
    }
    let id = "663a8ea0f5b465f38ecc3ed2"
    let  carrito = await cartManager.getCartByIdPopulate({_id:id});


     
    if (!carrito) {
      return res
        .status(404)
        .json({ error: `No se encontró ningún carrito con el ID ${cid}` });
    }

 
    try {
         let {
            docs: productos,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        } = await productManager.getProductsPaginate(pagina);
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("products", {
            productos,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            carrito
        });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `${error.message}`,
        });
    }

});


router.get("/carts", async(req,res)=>{
   
    let id = "663a8ea0f5b465f38ecc3ed2"
      let  carrito = await cartManager.getCartByIdPopulate({_id:id});

       
      if (!carrito) {
        return res
          .status(404)
          .json({ error: `No se encontró ningún carrito con el ID ${cid}` });
      }

     
     res.setHeader("Content-Type", "text/html");
    res.status(200).render("cart", {
        carrito
    });

})