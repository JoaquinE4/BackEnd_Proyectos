import { Router } from "express";
import { CartsControler } from "../controller/carts.controler.js";

export const router = Router();

router.post("/", CartsControler.postCart);

router.get("/",CartsControler.getAllCarts );

router.get("/:cid", CartsControler.getCartId );

router.delete("/:cid", CartsControler.deleteCartId);

router.put("/:cid", CartsControler.putCart );

router.post("/:cid/product/:pid", CartsControler.postProdCart );

router.put("/:cid/product/:pid", CartsControler.putProdCart);

router.delete("/:cid/product/:pid", CartsControler.deleteProdCart);
