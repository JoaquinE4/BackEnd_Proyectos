import { Router } from "express";
import { CartManager } from "../dao/CartManagerMongo.js";
import __dirname from "../utils.js";

export const router = Router()

const cartManager = new CartManager()


router.post("/", async(req,res)=>{

    const id =Date.now().toString(); 
    const product = []


    try{
        let newCart = await cartManager.addCart({id,product})
        res.json(newCart)

    }catch{
        console.log("error al crear carrito")
    }
})


router.get("/:cid", async (req,res)=>{
    let id = req.params.cid
    id = Number(id)
    if(isNaN(id)){
        res.jsom("No es un numero")
    }

    try{
        let getCart = await cartManager.getCartById({id})
        return res.json({Message:"Se encontro carrito", getCart})
    }catch{
        return res.json({error:"No se encontro cart correspontiente"})
    }
})


router.post("/:cid/product/:pid",async(req,res)=>{
    let cid = req.params.cid
    let pid = req.params.pid
    cid = Number(cid)
    pid = Number(pid)
    if(isNaN(cid) || isNaN(pid) ){
        return res.json("No corresponde a un ID válido");
    }

    try{
         const add= await cartManager.addProducts(cid, pid)

        res.json({ message: "Producto agregado al carrito correctamente" });
       

    }catch{
        res.json({ error: "no se puede"}); 
    }


})
