import { Router } from "express";
import { CartsControler } from "../controller/carts.controler.js";
import { authUSER } from "../middleware/auth.js";

export const router = Router();

router.post("/", CartsControler.postCart);

router.get("/", CartsControler.getAllCarts);

router.get("/:cid", CartsControler.getCartId);

router.delete("/:cid", CartsControler.deleteCartId);

router.put("/:cid", CartsControler.putCart);

router.post("/:cid/product/:pid", authUSER, CartsControler.postProdCart);

router.put("/:cid/product/:pid", authUSER, CartsControler.putProdCart);

router.delete("/:cid/product/:pid", authUSER, CartsControler.deleteProdCart);

router.get("/:cid/purchase", CartsControler.validarCompra);
