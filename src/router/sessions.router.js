import { Router } from "express";
import { UsuariosManagerMongo as UsuariosManager } from "../dao/UsuariosManagerMongo.js";
import { generateHash } from "../utils.js";

export const router = Router();
let usuariosManager = new UsuariosManager();

router.post("/registro", async (req, res) => {
  let { user, email, password  } = req.body;
  if (!user || !email || !password ) {
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
  }
});

router.post("/login", async (req, res) => {
  let { email, password, web } = req.body;

  if (!email || !password) {
    if (web) {
      return res.redirect(`/login?error=Datos%20inexistentes`);
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `crde` });
    }
  }

  // otras validaciones
  // preguntar por adminCoder@coder.com, y la contraseña adminCod3r123
  // si son esos datos, devolves al usuario nombre "admin", email
  // adminCoder@coder.com y rol "admin"

  let usuario = await usuariosManager.getBy({
    email,
    password: generateHash(password),
  });
  if (!usuario) {
    if (web) {
      return res.redirect(`/login?error=Datos%20invalidos`);
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `crde` });
    }
  }

  usuario = { ...usuario };
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
