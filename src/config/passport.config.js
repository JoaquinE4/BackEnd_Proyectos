import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { UsuariosManagerMongo } from "../dao/UsuariosManagerMongo.js";
import { generateHash, validaPassword } from "../utils.js";
 import { cartsService } from "../repository/Carts.service.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERROR } from "../utils/Error.js";

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
            return done(CustomError.createError(
              "Error datos invalido",
              "Datos invalido o inexistente",
              "Datos invalido o inexistente",  
              TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            ));
          }

          age=Number(age)
          if(isNaN(age)){
            return done(CustomError.createError(
              "Error dato invalido",
              "Dato invalido o inexistente",
              "Edad invalido o inexistente",  
              TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            ));
          }

          let existe = await usuariosManager.getBy({ email: username });
          if (existe) {
            return done(CustomError.createError(
              "Error registro",
              "Email ya registrado",
              "Ya existe usuario con ese email",  
              TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            ));
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

        if(!email || !password) {
          return done(CustomError.createError(
            "Datos invalidos",
            "Datos invalidos",
            "Datos invalidos",  
            TIPOS_ERROR.ARGUMENTOS_INVALIDOS
          ));
        }
   
        try {
          let usuario = await usuariosManager.getBy({ email });

          if (!usuario) {
            return done(CustomError.createError(
              "Usuario no encontrado",
              "Usuario no encontrado",
              "Usuario no encontrado",  
              TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            ));
          }

          const validPassword = await validaPassword(
            password,
            usuario.password
          );
          if (!validPassword) {
            return done(CustomError.createError(
              "Contraseña incorrecta",
              "Contraseña incorrecta",
              "Contraseña incorrecta",  
              TIPOS_ERROR.ARGUMENTOS_INVALIDOS
            ));
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
