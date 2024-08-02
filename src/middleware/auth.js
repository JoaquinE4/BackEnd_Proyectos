import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERROR } from "../utils/Error.js";

export const auth = (req, res, next) => {
  const { user } = req.session;

  if (!req.session.user) {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).redirect("/login");
  }

  next();
};

export const authADM = (req, res, next) => {
  const { user } = req.session;

  if (!user || (user.rol !== "admin" && user.rol !== "premium")) {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({
      error:"El usuario no tiene permisos para realizar esta acción"
    });
  }

  try {
    next();
  } catch (error) {
    const customError = CustomError.create(
      "Unauthorized",
      "El usuario no tiene permisos para realizar esta acción",
      "El usuario no tiene permisos para realizar esta acción",
      TIPOS_ERROR.AUTENTICACION
    );
    next(customError);
  }
};


export const authUSER = (req, res, next) => {
  
  if (req.session.user.rol !== "user" && req.session.user.rol !== "premium") {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).redirect("/")
  }

  next();
};
