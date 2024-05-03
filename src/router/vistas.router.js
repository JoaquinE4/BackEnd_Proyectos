import { Router } from 'express';
import ProductManager from "../dao/ProductManagerMongo.js"
import __dirname from "../utils.js" 
 
const productManager = new ProductManager()
export const router = Router()

router.get("/", async (req, res)=>{

    
    let productos = await productManager.getProducts()


    res.setHeader("Content-type", "text/html")
    res.status(200).render("home", {productos})
})

router.get("/realtimeproducts", async(req,res)=>{
    let productos = await productManager.getProducts()
    res.setHeader("Content-type", "text/html")
    res.status(200).render("realTimeProducts", {productos})
})

router.get("/chat", (req, res)=>{

    

    res.status(200).render('chat')
})
