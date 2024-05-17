import { Router } from "express";
import { UsuariosManagerMongo as UsuariosManager } from "../dao/UsuariosManagerMongo.js";
import {  validaPassword } from "../utils.js";
import passport from "passport";

export const router = Router();
let usuariosManager = new UsuariosManager();

router.get("/error", (req,res)=>{
  res.setHeader('Content-Type','application/json');
  return res.status(500).json(
    {
      
      detalle:`Fallo al autenticar`
    }
  )
  
})

router.post("/registro", passport.authenticate("registro", {failureRedirect:"/error"}) , async (req, res) => {
  /* let { user, email, password  } = req.body;
  if (!user || !email || !password  ) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese Los Datos` });
  }

  let existe = await usuariosManager.getBy({ email });
  if (existe) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ya existe ${email}` });
  }

  password = generateHash(password);
  let rol = "usuario"
  try {
    let nuevoUsuario = await usuariosManager.create({
      user,
      email,
      password,
      rol,
    });
    res.setHeader("Content-Type", "application/json");
    return res.status(200).redirect(`/login`);
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  } */

  res.setHeader('Content-Type','application/json');
  return res.status(201).json({menssage:"reistro ok", nueUsuario: req.user});
});

router.post("/login",passport.authenticate("login", {failureRedirect:"/error"}) , async (req, res) => {
  let { web } = req.body;

/*   if (!email || !password) {
    if (web) {
      return res.redirect(`/login?error=Datos%20inexistentes`);
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `crde` });
    }
  }
  */
 /*  let usuario = await usuariosManager.getBy({
    email
  });
  if (!usuario) {
    if (web) {
      return res.redirect(`/login?error=Datos%20invalidos`);
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `crde` });
    }
  }

  if(!validaPassword(password, usuario.password)){
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `crde` });
  }
 */
 let usuario = { ...req.user };
  delete usuario.password;
  console.log(usuario);

  req.session.user = usuario;

  if (web) {
    return res.redirect(`/products`);
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Login correcto", usuario });
  }
});

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
