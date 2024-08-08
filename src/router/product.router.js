import { Router } from "express";
import { ProductosControler } from "../controller/product.controler.js";
import { authADM } from "../middleware/auth.js";

export const router = Router();

router.get("/", ProductosControler.getProduct);

router.get("/:pid", ProductosControler.getProductId);

router.post("/", authADM, ProductosControler.postProduct);

router.put("/:pid", ProductosControler.putProduct);

router.delete("/:pid", authADM, ProductosControler.deleteProduct);
