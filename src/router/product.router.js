import { Router } from 'express';
import __dirname from '../utils.js';
import ProductManager from '../dao/ProductManagerMongo.js';
import { io } from '../app.js';



export const router = Router()


const productManager = new ProductManager()

router.get("/", async (req, res) => {

    try {
        let productos = await productManager.getProducts()
        res.setHeader('Conntent-Type', 'application/json');
        return res.status(200).json({ productos })
    } catch (error) {
        res.setHeader('Conntent-Type', 'application/json');
        return res.status(500).json(
            {
                error: 'Error Inesperado'
            }
        )

    }

})

router.get("/:pid",async (req, res) => {
    let id = req.params.pid
    id = Number(id)
    console.log(id, typeof id)
    if (isNaN(id)) {
        return res.json("Su valor no es un numero")
    }

    try {
        let productId = await productManager.getProductByCode({id});
        return res.json(productId);
    } catch (error) {
        return res.json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    let newProduct;
    try {
        let { title, description, price, thumbnail, code, stock } = req.body;
        
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Faltan datos' });
        }
        
        let existe = await productManager.getProductByCode({ code });
        if (existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Ya existe un producto con este código' });
        }

        const id = Date.now().toString();
       newProduct = await productManager.addProduct({ id, title, description, price, thumbnail, code, stock });
        
        res.status(201).json({ message: "Producto agregado correctamente", product: newProduct });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Hubo un error al procesar la solicitud' });
    }
    io.emit("nuevoProducto", newProduct);
});


router.put("/:pid", async (req, res) => {
    let id = req.params.pid
    let updatedFields = req.body;
    id = Number(id)
    console.log(id, typeof id)
    if (isNaN(id)) {
        return res.json("Su valor no es un numero")
    }

    try {
        let updatedProduct = await productManager.updateProduct({id}, updatedFields);


        res.json(({ message: "Producto actualizado correctamente", product: updatedProduct }))
    } catch (error) {
        return res.json({ error: "No fue posible"});
    }
});

router.delete("/:pid", async(req, res) => {
    let id = req.params.pid
    id = Number(id)
    let productos
    if (isNaN(id)) {
        return (res.json("El valor no es un numero"))
    }
    try {
       let eliminarproducto =  await productManager.deleteProduct({id})
        res.json({ message: "Producto Eliminado" })
         productos = await productManager.getProducts()

         io.emit('delete', productos)
    } catch {
        return res.json({ error: error.message })
    }
})