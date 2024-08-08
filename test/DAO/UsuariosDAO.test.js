import { before, after, describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest-session";
import mongoose, { isValidObjectId } from "mongoose";
import { config } from "../../src/config/congif.js";

const requester = supertest("http://localhost:8080");


const connectMDB = async () => {
    try {
      await mongoose.connect(config.MONGO_URL, {
        dbName: "BackEnd",
      });
      console.log("DB conectada");
    } catch (error) {
      console.error("Error de conexión a DB:", error);
    }
  };
  connectMDB();


  describe("Prueba de proyecto adopme", function(){

    describe("Pruebas router usuarios", function(){

        let uid;

        it("La ruta /api/sessions/usuarios, en su metodo get, retorna un array de usuarios",async()=>{

            let {body} = await requester.get("/api/sessions/usuarios").expect(200)
            
            expect(Array.isArray(body.usuarios)).to.be.true

        })

        it("La ruta /api/sessions/registro, en su metodo post, crea un usuario en la dase de datos ", async()=>{
            let mockUser={
                first_name:"John",
                last_name:"Smith",
                age:56,
                email:"john9test.com",
                password:"123"
            }

            let {body}=await requester.post("/api/sessions/registro").send(mockUser)

            expect(body._id).to.exist;  
            expect(body.rol).to.exist;  
            expect(body.password).to.not.exist;  
            expect(isValidObjectId(body._id)).to.be.true;

            uid = body._id



        })

        it("La ruta /api/sessions/eliminar/:uid, en su metodo get, retorna un usuario",async()=>{

            let {body} = await requester.delete(`/api/sessions/eliminar/${uid}`)
                                        .expect(200)
            expect(body.payload).to.be.equal("Usuario eliminado")

        })



    })



  })