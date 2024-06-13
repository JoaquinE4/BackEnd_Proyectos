import { Router } from "express";
import { ProductosControler } from "../controller/product.controler.js";

export const router = Router();


router.get("/", ProductosControler.getProduct);

router.get("/:pid",ProductosControler.getProductId );

router.post("/", ProductosControler.postProduct);

router.put("/:pid", ProductosControler.putProduct);

router.delete("/:pid", ProductosControler.deleteProduct);
