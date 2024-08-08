import { TIPOS_ERROR } from "../utils/Error.js";

export const errorHandler = (error, req, res, next) => {
  console.error(error.cause ? error.cause : error.message);

  if (!res.headersSent) {
    res.setHeader("Content-Type", "application/json");
    switch (error.code) {
      case TIPOS_ERROR.AUTENTICACION:
        return res.status(401).json({ error: error.message });
      case TIPOS_ERROR.AUTORIZACION:
        return res.status(403).json({ error: error.message });
      case TIPOS_ERROR.ARGUMENTOS_INVALIDOS:
      case TIPOS_ERROR.TIPO_DE_DATOS:
        return res.status(400).json({ error: error.message });
      case TIPOS_ERROR.NOT_FOUD:
        return res.status(404).json({ error: error.message });
      case TIPOS_ERROR.INTERNAL_SERVER_ERROR:
        return res.status(500).json({ error: error.message });
      default:
        return res.status(500).json({ error: "Error inesperado - Contacte con el administrador" });
    }
  }

  next();
};
