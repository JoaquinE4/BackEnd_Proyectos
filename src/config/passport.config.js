import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { UsuariosManagerMongo } from "../dao/UsuariosManagerMongo.js";
import { generateHash, validaPassword } from "../utils.js";
 import { cartsService } from "../repository/Carts.service.js";

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
          let { first_name , last_name, age } = req.body;
          if (!first_name || !last_name ) {
            return done(null, false);
          }

          age=Number(age)
          if(isNaN(age)){
            return done(null, false);
          }

          let existe = await usuariosManager.getBy({ email: username });
          if (existe) {
            return done(null, false);
          }

          password = generateHash(password);
          let rol = "user";
          const id = Date.now().toString();
          let newCart = await cartsService.addCart({ id });

          let nuevoUsuario = await usuariosManager.create({
            first_name,
            last_name,
            age,
            email: username,
            password,
            rol,
            cart: newCart._id,
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

          const validPassword = await validaPassword(
            password,
            usuario.password
          );
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

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: " ",
        clientSecret: " ",
        callbackURL: "http://localhost:8080/api/sessions/callbackGithub",
      },
      async (ta, tr, profile, done) => {
        try {
          let email = profile._json.email;
          let nombre = profile._json.nombre;

          if (!email) {
            return done(null, false);
          }

          let usuario = await usuariosManager.getBy({ email });

          if (!usuario) {
            let newCart = await cartsService.addCart({ id });
            let rol = "usuario";

            usuario = await usuariosManager.create({
              user: nombre,
              email,
              cart: newCart._id,
              profile,
              rol,
            });

            usuario = await usuariosManager.getByPopulate({ email });

            return done(null, usuario);
          } else {
            return done(null, usuario);
          }
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
