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

  describe("Pruebas proyecto", function(){
    this.timeout(10000);

    
    describe("Pruebas router carts", function(){
        
        let idCart;
        let agent;
    
        beforeEach(async () => {
            agent = supertest("http://localhost:8080");
            const response = await agent
              .post("/api/sessions/login")
              .send({ email: "tulio@test.com", password: "123" });
           });
      
          afterEach(async () => {
            await requester.get("/api/sessions/logout");
            });

     it("La ruta /api/carts en su metodo post, crea un carrito de compras", async()=>{

            let { body}= await requester.post("/api/carts")
                                        .expect(200)

            expect(isValidObjectId(body._id)).to.be.true;
            expect(body.products).to.be.an("array");
            idCart = body._id;

        })
          
        it("La ruta /api/carts en su metodo get, retorna una lista de carritos", async()=>{

            let { body}= await requester.get("/api/carts")
                                        .expect(200)

            expect(body.tomar).to.be.an("array")
            expect(body.tomar.length > 0).to.be.true
            if(body.tomar.length > 0){
                expect(body.tomar[0]).to.have.property('_id');
            }
        })

        it("La ruta /api/carts/:id en su metodo get, retorna un carrito", async()=>{

            let { body}= await requester.get(`/api/carts/667b1af4319024aeca139e12`)
                                        .expect(200)

            expect(body.carrito).to.be.an("object");
            expect(isValidObjectId(body.carrito._id)).to.be.true;
        })

        it("La ruta /api/carts/cid , en su metodo put, Vacia el array de productos", async()=>{

            let {body}= await requester.put("/api/carts/667b1af4319024aeca139e12")
                                        .expect(200)
            expect(body.message).to.be.equal("Carrito actualizado correctamente")


        })

        it("La ruta /api/carts/:cid/product/:pid, en su método post, agrega un producto al carrito (products array)", async () => {
            let cidTulio = "66a278fb26a88abbabfde78d";
            let pidProducto = "6637c17997ce66ddfaccf235";
            const { body } = await agent.post(`/api/carts/${cidTulio}/product/${pidProducto}`)
              .expect(200); 
          
            expect(body.payload).to.equal("Carrito actualizado");
          
          });


          it("La ruta /api/carts/:cid/product/:pid, en su metodo delete, elimina un producto del carrito (products array)", async () => {
            let cidTulio = "66a278fb26a88abbabfde78d";
            let pidProducto = "6637c17997ce66ddfaccf235";
            const { body } = await agent.delete(`/api/carts/${cidTulio}/product/${pidProducto}`)
              .expect(200); 
          
            expect(body.payload).to.equal("Producto eliminado");
          
          });

          it("La ruta /api/carts/:cid, en su metodo delete, resetea los valores de total a 0 y vacia el array de products",async()=>{
            let { body}= await requester.delete(`/api/carts/${idCart}`)
                                        .expect(200)
            expect(body.message).to.be.equal("Se eliminaron todos los productos")
          })




    })



  })