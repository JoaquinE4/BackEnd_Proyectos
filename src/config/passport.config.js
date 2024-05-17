import passport from "passport";
import local from "passport-local";
import { UsuariosManagerMongo } from "../dao/UsuariosManagerMongo.js";
import { generateHash, validaPassword } from "../utils.js";

const usuariosManager = new UsuariosManagerMongo();

export const initPasport = () => {
  passport.use(
    "registro",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { user } = req.body;
          if (!user) {
            return done(null, false);
          }

          let existe = await usuariosManager.getBy({ email: username });
          if (existe) {
            return done(null, false);
          }

          password = generateHash(password);
          let rol = "usuario";

          let nuevoUsuario = await usuariosManager.create({
            user,
            email: username,
            password,
            rol,
          });

          return done(null, nuevoUsuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          let usuario = await usuariosManager.getBy({ email });
  
          if (!usuario) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
  
          const validPassword = await validaPassword(password, usuario.password);
          if (!validPassword) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }
  
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  

  passport.serializeUser((usuario, done) => {
    return done(null, usuario._id);
  });

  passport.deserializeUser(async (id, done) => {
    let usuario = await usuariosManager.getBy({ _id: id });
    return done(null, usuario);
  });
};
