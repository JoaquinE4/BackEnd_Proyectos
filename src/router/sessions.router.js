import { Router } from "express";
import { UsuariosManagerMongo as UsuariosManager } from "../dao/UsuariosManagerMongo.js";
import passport from "passport";
import { generateHash, passportCall, validaPassword } from "../utils.js";
import { UsuarioDTO } from "../DTO/UsuarioDTO.js";
import { logger } from "../utils/Logger.js";
import { config } from "../config/congif.js";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/Mailin.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERROR } from "../utils/Error.js";
import { isValidObjectId } from "mongoose";

export const router = Router();
let usuariosManager = new UsuariosManager();

router.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  req.logger.error(error);

  return res.status(500).json({
    detalle: `Fallo al autenticar`,
  });
});

router.get("/usuarios", async (req, res, next) => {
  try {
    let usuarios = await usuariosManager.getAll();

    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({ usuarios });
  } catch {
    next(
      CustomError.createError(
        "Error de búsqueda",
        "No se ejecutó el servicio",
        "Error al realizar la búsqueda",
        TIPOS_ERROR.INTERNAL_SERVER_ERROR
      )
    );
  }
});

router.post("/registro", passportCall("registro"), async (req, res) => {
  let userClean = new UsuarioDTO(req.session.user);

  req.session.user = userClean;
  console.log(userClean);
  res.setHeader("Content-Type", "application/json");
  return res.status(201).json(req.session.user);
});

router.post("/login", passportCall("login"), async (req, res, next) => {
  let userClean = new UsuarioDTO(req.session.user);

  req.session.user = userClean;
  console.log(req.session.user);
  try {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(req.session.user);
  } catch (error) {
    next(error);
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
  res.status(200).json({ payload: "Session destruida con exito" });
});

router.post("/pass-recuperacion", async (req, res) => {
  const { email } = req.session.user;

  const user = await usuariosManager.getBy({ email });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const token = jwt.sign({ id: user._id }, config.SECRET, { expiresIn: "1h" });
  console.log("Generated Token:", token);
  const resetLink = `http://localhost:8080/reset-password/${token}`;
  console.log("Reset Link:", resetLink);

  console.log({ Email: email });
  await transporter.sendMail({
    to: email,
    subject: "Recuperar contraseña",
    html: `<p>Click <a href="${resetLink}">Aqui</a> para recuperar tu contraseña. Este link se autodestruira en 1 hora</p>`,
  });

  res.send("Mail de recuperacion de contraseña enviado");
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  console.log("Received Token in POST:", token); // Para depuración
  console.log("Received New Password:", newPassword);
  let decoded;
  try {
    decoded = jwt.verify(token, config.SECRET);

    console.log("Decoded Token:", decoded);
  } catch (err) {
    console.error(err); // Imprimir el error para depuración
    return res.status(400).redirect("http://localhost:8080/perfil");
  }

  const user = await usuariosManager.getBy({ _id: decoded.id });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const validPassword = await validaPassword(newPassword, user.password);
  if (validPassword) {
    res.setHeader("Content-Type", "application/json");
    return CustomError.createError(
      "contraseña invalida",
      "contraseña invalida",
      "La contraseña no puede ser la misma",
      TIPOS_ERROR.ARGUMENTOS_INVALIDOS
    );
  }

  let password = generateHash(newPassword);

  try {
    let nuevaPass = await usuariosManager.updatePassword(user._id, password);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json("Contraseña actualizada con Exito!");
  } catch (error) {
    return CustomError.createError(
      "Error al modificar la contraseña",
      "Error al modificar la contraseña",
      "Error al modificar la contraseña",
      TIPOS_ERROR.ARGUMENTOS_INVALIDOS
    );
  }
});

router.put("/premium/:uid", async (req, res, next) => {
  let { uid } = req.params;

  try {
    let usuario = await usuariosManager.getBy({ _id: uid });

    if (!usuario) {
      return CustomError.createError(
        "Usuario no encontrado",
        "Usuario no encontrado",
        "Usuario no encontrado",
        TIPOS_ERROR.AUTENTICACION
      );
    }

    if (usuario.rol === "user") {
      let rol = await usuariosManager.updateRol(usuario._id, "premium");
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: "Rol premium adquirido" });
    } else if (usuario.rol === "premium") {
      let rol = await usuariosManager.updateRol(usuario._id, "user");
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: "Rol user adquirido" });
    } else {
      return CustomError.createError(
        "Operacion invalida",
        "Error al modificar privilegios",
        "Error al modificar privilegios",
        TIPOS_ERROR.INTERNAL_SERVER_ERROR
      );
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/eliminar/:uid", async (req, res, next) => {
  let { uid } = req.params;
  console.log(uid)
  try {
    if (!uid) {
      CustomError.createError(
        "URL incompleto",
        "URL incompleto",
        "Error en la direccion del usuario",
        TIPOS_ERROR.ARGUMENTOS_INVALIDOS
      );
    }

    if (!isValidObjectId(uid)) {
      CustomError.createError(
        "ID invalido",
        "ID invalido",
        "ID invalido",
        TIPOS_ERROR.AUTENTICACION
      );
    }

    let usuario = await usuariosManager.getBy({ _id: uid });

    if (!usuario) {
      CustomError.createError(
        "Error al buscar el usuario",
        "Error al buscar el usuario",
        "Error al buscar el usuario",
        TIPOS_ERROR.INTERNAL_SERVER_ERROR
      );
    }

    let eliminado = await usuariosManager.delete(usuario._id);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Usuario eliminado" });
  } catch (error) {
    next(error);
  }
});
