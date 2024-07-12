import { Router } from "express";
import { logger } from "../utils/Logger.js";

export const router=new Router()

router.get("/", (req,res)=>{

    logger.debug("DEBUG LOGGER")
    logger.http("HTTP LOGGER")
    logger.info("INFO LOGGER")
    logger.warning("WARN LOGGER")
    logger.error("ERROR LOGGER")
    logger.fatal("ASD");

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"HOLA"});

})