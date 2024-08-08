import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";
import passport from "passport";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword = (password, passwordHash) =>
  bcrypt.compareSync(password, passwordHash);

export const passportCall = (estrategia) => {
  return function (req, res, next) {
    passport.authenticate(estrategia, function (err, user, info, status) {
      if (err) {
        return next(err);  
      }

      if (!user) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: info.message ? info.message : info.toString() });  
      }
console.log(user.cart)
      req.session.user = user;  
      return next();  
    })(req, res, next);  
}}

export const idInvalido = (id, description) => {
  if (!(isValidObjectId(id))) {
    errorName = 'ObjectId no valido'
    return CustomError.createError(errorName,
      errorCause('addProductToCart', errorName, `${description} isValidObjectId: ${isValidObjectId(id)} - value: ${id}`),
      "Favor de corrigir el argumento", TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
  }

}