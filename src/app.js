import express from "express";
import { router as productosRouter } from "./router/product.router.js";
import { router as cartsRouter } from "./router/cart.router.js";
import { router as vistasRouter } from "./router/vistas.router.js";
import { router as sessionsRouter } from "./router/sessions.router.js";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import path from "path";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { MessageModel as mensajesModelo } from "./dao/models/Modelos.js";
import cookieParser from "cookie-parser";
import session from "express-session"; // Cambiado de 'sessions' a 'session'
import { auth } from "./middleware/auth.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initPasport } from "./config/passport.config.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser("segurida"));

app.use(
  session({
    secret: "code24",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      ttl: 3600,
      mongoUrl:
        "mongodb+srv://jbackend0:CoderCoder2024@clustercoder.bhdint3.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCoder&dbName=BackEnd",
    }),
  })
);

initPasport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

app.use("/api/sessions", sessionsRouter);
app.use("/api/productos", productosRouter);
app.use("/api/carts", cartsRouter);
app.use("/", vistasRouter);

app.get("/contador", (req, res) => {
  if (req.session.contador) {
    req.session.contador++;
  } else {
    req.session.contador = 1;
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).send(`Visitas: ${req.session.contador}`);
});

app.get("/setcookies", (req, res) => {
  let datos = { nombre: "Aurora", apellido: "Cassarotti", rol: "user" };
  res.cookie("pruebaCokie", "calor: cookie1", {});
  res.cookie("datosCokie", datos, {});
  res.cookie("datosCokieMax", datos, { maxAge: 3000 });
  res.cookie("datosCokieExp", datos, { expires: new Date(2024, 4, 16) });
  res.cookie("datosCokieExpFirmada", datos, {
    signed: true,
    expires: new Date(2024, 4, 16),
  });
  res.setHeader("Content-Type", "application/json");
  res.status(200).send("hola");
});

app.get("/getcookies", auth, (req, res) => {
  let cookies = req.cookies;
  let cookiesFirmadas = req.signedCookies;
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    cookies,
    cookiesFirmadas,
  });
});

app.get("/delcookies", (req, res) => {
  //  res.clearCookie("pruebaCokie")
  Object.keys(req.cookies).forEach((c) => res.clearCookie(c));
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({});
});

let usuarios = [];

const server = app.listen(PORT, () =>
  console.log(`Server online en puerto http://localhost:${PORT}/`)
);

export const io = new Server(server);

io.on("connection", async (socket) => {
  console.log(`Se ha conectado un cliente con id ${socket.id}`);

  socket.on("id", async (nombre) => {
    usuarios.push({ id: socket.id, nombre });
    let mensajes = await mensajesModelo.find().lean();
    mensajes = mensajes.map((m) => {
      return { nombre: m.user, mensaje: m.message };
    });
    socket.emit("mensajesPrevios", mensajes);
    socket.broadcast.emit("nuevoUsuario", nombre);
  });

  socket.on("mensaje", async (nombre, mensaje) => {
    await mensajesModelo.create({ user: nombre, message: mensaje });
    io.emit("nuevoMensaje", nombre, mensaje);
  });
});

const conecDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://jbackend0:CoderCoder2024@clustercoder.bhdint3.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCoder",
      {
        dbName: "BackEnd",
      }
    );
    console.log("DB CONECTADA");
  } catch {}
};
conecDB();
