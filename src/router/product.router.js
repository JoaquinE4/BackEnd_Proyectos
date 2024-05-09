import { Router } from 'express';
import __dirname from '../utils.js';
import ProductManager from '../dao/ProductManagerMongo.js';
import { io } from '../app.js';






export const router = Router()


const productManager = new ProductManager()





router.get("/", async (req, res) => {
    let { limit, sort, page } = req.query;
    limit = Number(limit);
    if (!limit || limit <= 0) {
        limit = 10;
    }
    page = Number(page);


    if (!page) {
        page = 1
    }

    try {
        let { docs: productos } = await productManager.getProductsPaginate(page);

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
            
        
        console.log({ Pagina: page });

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productos });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: 'Error inesperado' });
    }
});


router.get("/:pid", async (req, res) => {
    let id = req.params.pid
    
    console.log(id, typeof id)
    if (!isNaN(id)) {
        return res.json("Su valor   es  ")
    }

    try {
        let productId = await productManager.getProductByCode({ _id :id });
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productId });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message });
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

        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ message: "Producto agregado correctamente", product: newProduct });

    } catch (error) {

        res.setHeader('Content-Type', 'application/json');
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
        let updatedProduct = await productManager.updateProduct({ id }, updatedFields);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(({ message: "Producto actualizado correctamente", product: updatedProduct }))
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: "No fue posible" });
    }
});

router.delete("/:pid", async (req, res) => {
    let id = req.params.pid
    
    let productos
    if (!isNaN(id)) {
        return (res.json("El valor no es "))
    }
    try {
        let eliminarproducto = await productManager.deleteProduct({ _id :id })
        res.json({ message: "Producto Eliminado" })
        productos = await productManager.getProducts()

        io.emit('delete', productos)
    } catch {
        return res.json({ error: error.message })
    }
})


