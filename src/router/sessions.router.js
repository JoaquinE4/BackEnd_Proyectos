import { Router } from "express";
import { UsuariosManagerMongo as UsuariosManager } from "../dao/UsuariosManagerMongo.js";
import passport from "passport";
import { passportCall } from "../utils.js";

export const router = Router();
let usuariosManager = new UsuariosManager();

router.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(500).json({
    detalle: `Fallo al autenticar`,
  });
});

router.post(
  "/registro",
  passportCall("registro"),
  async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(201).redirect("/products");
  }
);

router.post(
  "/login",
  passportCall("login"),
  async (req, res) => {
    let { web } = req.body;

    let usuario = { ...req.session.user };
    delete usuario.password;
 
    req.session.user = usuario;

    if (web) {
      return res.status(200).redirect(`/products`);
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).redirect("/");
    }
  }
);

router.get("/github", passport.authenticate("github", {}), (req, res) => {});
router.get(
  "/callbackGithub",
  passportCall("github"),
  (req, res) => {
    console.log("QUERY PARAMS:", req.query);
    req.session.user = req.user;
 
    res.setHeader("Content-Type", "application/json");
    return res.status(200).redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  });

  res.setHeader("Content-Type", "application/json");
  res.status(200).redirect(`/login`);
});
