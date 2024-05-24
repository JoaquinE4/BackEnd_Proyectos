import { Router } from "express";
import { UsuariosManagerMongo as UsuariosManager } from "../dao/UsuariosManagerMongo.js";
import passport from "passport";

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
  passport.authenticate("registro", { failureRedirect: "/api/sessions/error" }),
  async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(201).redirect("/products");
  }
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/error" }),
  async (req, res) => {
    let { web } = req.body;

    let usuario = { ...req.user };
    delete usuario.password;
    console.log(usuario);

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
  passport.authenticate("github", { failureRedirect: "/api/sessions/error" }),
  (req, res) => {
    console.log("QUERY PARAMS:", req.query);
    req.session.user = req.user;
    console.log(req.user);

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
