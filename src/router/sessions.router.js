import { Router } from "express";
import { UsuariosManagerMongo as UsuariosManager } from "../dao/UsuariosManagerMongo.js";
import passport from "passport";
import { generateHash, passportCall, validaPassword } from "../utils.js";
import { UsuarioDTO } from "../DTO/UsuarioDTO.js";
import { logger } from "../utils/Logger.js";
import { config } from "../config/congif.js";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/Mailin.js";

export const router = Router();
let usuariosManager = new UsuariosManager();

router.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  req.logger.error(error);

  return res.status(500).json({
    detalle: `Fallo al autenticar`,
  });
});

router.post("/registro", passportCall("registro"), async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(201).redirect("/products");
});

router.post("/login", passportCall("login"), async (req, res) => {
  let { web } = req.body;

  let userClean = new UsuarioDTO(req.session.user);

  req.session.user = userClean;
  console.log(req.session.user);

  if (web) {
    return res.status(200).redirect(`/products`);
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).redirect("/");
  }
});

router.get("/github", passport.authenticate("github", {}), (req, res) => {});
router.get("/callbackGithub", passportCall("github"), (req, res) => {
  console.log("QUERY PARAMS:", req.query);
  req.session.user = req.user;

  res.setHeader("Content-Type", "application/json");
  return res.status(200).redirect("/");
});

router.get("/logout", (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      res.setHeader("Content-Type", "application/json");
      req.logger.error(error);

      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  });

  res.setHeader("Content-Type", "application/json");
  res.status(200).redirect(`/login`);
});

router.post("/pass-recuperacion", async (req, res) => {
  const { email } = req.session.user;

  const user = await usuariosManager.getBy({ email });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const token = jwt.sign({ id: user._id }, config.SECRET, { expiresIn: "1h" });
  console.log('Generated Token:', token);
  const resetLink = `http://localhost:8080/reset-password/${token}`;
  console.log('Reset Link:', resetLink);
  
  console.log({Email: email})
  await transporter.sendMail({
    to: email,
    subject: "Recuperar contraseña",
    html: `<p>Click <a href="${resetLink}">Aqui</a> para recuperar tu contraseña. Este link se autodestruira en 1 hora</p>`,
  });

  res.send("Mail de recuperacion de contraseña enviado");
});

router.post("/reset-password/:token", async (req, res) => {
  const {token} = req.params;
  const { newPassword } = req.body;
  console.log('Received Token in POST:', token); // Para depuración
  console.log('Received New Password:', newPassword);
  let decoded;
  try {
  decoded= jwt.verify(token, config.SECRET)

    console.log('Decoded Token:', decoded); 
  } catch (err) {
    console.error(err); // Imprimir el error para depuración
    return res.status(400).redirect("http://localhost:8080/perfil");
  }

  const user = await usuariosManager.getBy({_id:decoded.id});

  if (!user) {
    return res.status(404).send("User not found");
  }

  const validPassword = await validaPassword(newPassword, user.password);
  if (validPassword) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `La contraseña no puede ser la misma` });
  }

  let password = generateHash(newPassword);

  try {
    let nuevaPass = await usuariosManager.updatePassword(user._id, password);
    res.setHeader('Content-Type','application/json');
    return res.status(200).json('Contraseña actualizada con Exito!');
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error al actualizar contraseña`,
    });
  }

   
});

router.put("/premium/:uid",async (req,res,next)=>{

  let {uid} = req.params
  
  try {
    let usuario= await usuariosManager.getBy({_id: uid})
  
    if(!usuario){
      return res.status(404).json({mensaje: "Usuario no encontrado"})
    }
  
    if(usuario.rol === "user"){
      let rol = await usuariosManager.updateRol(usuario._id, "premium")
    
      
    }else if(usuario.rol === "premium"){
      let rol = await usuariosManager.updateRol(usuario._id, "user")
  
    }
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Todo bien"});
  } catch (error) {
    next(error)
  }


}  )
