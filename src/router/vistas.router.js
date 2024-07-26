import { Router } from "express";
import { auth, authADM, authUSER } from "../middleware/auth.js";
import { VistasControler } from "../controller/vistas.controler.js";

export const router = Router();

router.get("/", auth, VistasControler.getInicio);

router.get("/realtimeproducts", VistasControler.getRealTime);

router.get("/chat",authUSER, VistasControler.getChat);

router.get("/products", auth, VistasControler.getProducts);

router.get("/carts", auth, VistasControler.getCarts);

router.get("/registro", VistasControler.getRegistro);

router.get("/login", VistasControler.getLogin);

router.get("/perfil", auth, VistasControler.getPerfil);

router.get("/ticket", VistasControler.getTicket);

router.get("/reset-password/:token", VistasControler.resPassword);
