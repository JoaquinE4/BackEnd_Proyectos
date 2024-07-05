 
import Router from "express";
import { MokingControler } from "../controller/moking.controler.js";

export const router=new Router()

router.get("/", MokingControler.getMoking )


