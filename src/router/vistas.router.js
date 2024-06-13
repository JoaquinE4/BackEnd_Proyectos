import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { VistasControler } from "../controller/vistas.controler.js";

export const router = Router();

router.get("/", auth, VistasControler.getInicio );

router.get("/realtimeproducts", VistasControler.getRealTime);

router.get("/chat", VistasControler.getChat );

router.get("/products", auth, VistasControler.getProducts );

router.get("/carts", auth, VistasControler.getCarts);

router.get("/registro", VistasControler.getRegistro );

router.get("/login", VistasControler.getLogin );

router.get("/perfil", auth, VistasControler.getPerfil );
