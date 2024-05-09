import express from "express"
import { router as productosRouter } from "./router/product.router.js"
import { router as cartsRouter } from "./router/cart.router.js"
import { router as vistasRouter } from "./router/vistas.router.js"
import { engine } from "express-handlebars"
import __dirname from "./utils.js"
import path from "path"
import { Server } from "socket.io"
import mongoose from "mongoose"
import {MessageModel as mensajesModelo} from "./dao/models/Modelos.js";

  
 

const PORT=8080
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./src/public"))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views",path.join(__dirname, "/views"));

app.use("/api/productos", productosRouter)
app.use("/api/carts", cartsRouter)
app.use("/", vistasRouter)


 let usuarios =[]

const server =
app.listen(PORT, ()=>console.log(`Server online en puerto ${PORT}`));

export const io = new Server(server)

 io.on("connection",async socket=>{
   console.log(`Se ha conectado un cliente con id ${socket.id}`);

   socket.on("id", async(nombre)=>{
      usuarios.push({id:socket.id, nombre})
      let mensajes=await mensajesModelo.find().lean()
      mensajes=mensajes.map(m=>{
          return {nombre: m.user, mensaje: m.message}
      })
      socket.emit("mensajesPrevios", mensajes)
      socket.broadcast.emit("nuevoUsuario", nombre)
  })

  socket.on("mensaje", async(nombre, mensaje)=>{
   
   await mensajesModelo.create({user:nombre,message: mensaje})
   io.emit("nuevoMensaje", nombre, mensaje)
})

 



})

const conecDB = async ()=>{
   try{
      await mongoose.connect("mongodb+srv://jbackend0:CoderCoder2024@clustercoder.bhdint3.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCoder",
   {
      dbName:"BackEnd"
   })
 console.log("DB CONECTADA")
   }
   catch{

   }
}
conecDB();