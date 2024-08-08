import { before, after, describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest-session";
import mongoose, { isValidObjectId } from "mongoose";
import { config } from "../../src/config/congif.js";
import { response } from "express";

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

describe("Pruebas proyecto adoptMe", function () {
  this.timeout(10000);

  describe("Pruebas router productos", function () {
    let agent;
    let idProducto;

    before(async () => {
      agent = supertest("http://localhost:8080");
      const response = await agent
        .post("/api/sessions/login")
        .send({ email: "adminCoder@coder.com", password: "adminCod3r123" });
    });

    afterEach(async () => {
      await requester.get("/api/sessions/logout");
     });

    it("La ruta /api/productos, en su método get, retorna un array de productos", async () => {
      const { body } = await requester.get("/api/productos/");
      expect(Array.isArray(body.productos)).to.be.true;
      expect(body.productos.length > 0).to.be.true;
      expect(isValidObjectId(body.productos[0]._id)).to.be.true;
    });

    it("La ruta /api/productos/:id, en su método get, retorna un producto", async () => {
      const { body } = await requester.get(
        "/api/productos/6632d9c6e383d0150054adf0"
      );
      expect(isValidObjectId(body.productId._id)).to.be.true;
      expect(body.productId.code).to.be.a("string");
    });

    it("La ruta /api/productos, en su método post, crea un nuevo producto", async () => {
      const mockProducto = {
        title: "Alicate",
        description: "Es muy bueno!",
        price: 2333,
        thumbnail: "URL",
        code: "ssd4233",
        stock: 23,
      };
      const { body } = await agent.post("/api/productos/").send(mockProducto);
      expect(isValidObjectId(body.product._id)).to.be.true;
      expect(body.product.title).to.equal(mockProducto.title);
      expect(body.product.code).to.equal(mockProducto.code);

      idProducto = body.product._id;
    });

    it("La ruta /api/productos/:pid, en su método put, actualiza un producto", async () => {
      const mockProducto = {
        title: "Alicate modificado otra vez",
        description: "Es muy bueno! modificado",
        price: 2333,
        thumbnail: "URL modificada",
        code: "ssd4233",
        stock: 23,
      };
      const { body } = await requester
        .put(`/api/productos/${idProducto}`)
        .send(mockProducto);
      expect(body.product.title).to.be.equal(mockProducto.title);
      expect(body.product.code).to.be.equal(mockProducto.code);
    });

    it("La ruta /api/productos/:pid, en su metodo delete, elimina el producto ", async () => {
      const { body } = await agent.delete(`/api/productos/${idProducto}`);

      expect(body.message).to.be.equal("Producto Eliminado");
    });

    //Test Error
    it("La ruta /api/productos, en su método get, ingresando un pid incorrecto, debe retornar un error 400", async () => {
      let pidIncorecto = "66b3ce65b648f6cdb3336bfs";
      const { body } = await requester
        .get(`/api/productos/${pidIncorecto}`)
        .expect(400);
      expect(body.error).to.be.equal("Error ID invalido");
    });

    it("La ruta /api/productos, en su método get, ingresando un pid correcto, debe retornar un error 404", async () => {
      let pidNoExistente = "66b41cad1f1455e98bd4375f";
      const { body, header } = await requester
        .get(`/api/productos/${pidNoExistente}`)
        .expect(404);
      expect(body.error).to.be.equal("Error No se encontro Producto");
    });

    it("La ruta /api/productos, en su método post, sin autorizacion retorna un error de status 401", async () => {
      let mockProducto = {
        title: "Alicate",
        description: "Es muy bueno!",
        price: 2333,
        thumbnail: "URL",
        code: "ssd3233",
        stock: 23,
      };

      let { body } = await requester
        .post("/api/productos")
        .send(mockProducto)
        .expect(401);
      expect(body.error).to.be.equal(
        "El usuario no tiene permisos para realizar esta acción"
      );
    });

    it("La ruta /api/productos, en su metodo post, volviendo a crar el mismo producto retorna un error 400", async () => {
      let prodExistente = {
        title: "qeqeweqwtineta",
        price: "3000",
        description: "adadad",
        thumbnail: 1,
        code: "dddw23",
        stock: 1,
      };

      let { body } = await agent
        .post("/api/productos")
        .send(prodExistente)
        .expect(400);

      expect(body.error).to.be.equal("Ya existe un producto con ese codigo");
    });
    it("La ruta /api/productos, en su metodo post,creando un producto que tenga un campo incompleto retorna un error error 400", async () => {
      //Producto sin title
      let prodIncompleto = {
        price: "3000",
        description: "adadad",
        thumbnail: 1,
        code: "dddw23",
        stock: 1,
      };

      let { body } = await agent
        .post("/api/productos")
        .send(prodIncompleto)
        .expect(400);

      expect(body.error).to.be.equal(
        "Error Faltandatos Complete los datos solicitados"
      );
    });

    it("La ruta /api/productos/:pid , en su metodo put no ingresando datos para actualizar, retorna un error 400", async () => {
      let objetoVacio = {};
      let pidValido = "66b4e4cfe3c5dea28ed85302";

      let { body } = await agent
        .put(`/api/productos/${pidValido}`)
        .send(objetoVacio)
        .expect(400);
      expect(body.error).to.be.equal(
        "Ingrese datos para realizar la actualizacion"
      );
    });

    it("La ruta /api/productos/:pid , en su metodo put  ingresando un pid invalido, retorna un error 400", async () => {
      let objetoVacio = { title: "Pantuflas Modificado" };
      let pidInvalido = "66b4e4cfe3c5dea28ed8530";

      let { body } = await agent
        .put(`/api/productos/${pidInvalido}`)
        .send(objetoVacio)
        .expect(400);
      expect(body.error).to.be.equal("Error  ID invalido");
    });

    it("La ruta /api/productos/:pid , en su metodo put   ingresando un pid inexistente, retorna un error 404", async () => {
      let objeto = { title: "Pantuflas Modificado" };
      let pidInvalido = "66b4e4cfe3c5dea28ed85303";

      let { body } = await requester
        .put(`/api/productos/${pidInvalido}`)
        .send(objeto)
        .expect(404)
        expect(body.error).to.be.equal("Error No se encontro Producto")
    });

    it("La ruta /api/productos/:pid , en su metodo delete   ingresando un pid inexistente, retorna un error 404", async () => {
       let pidInvalido = "66b4e4cfe3c5dea28ed85303";

      let { body } = await agent
        .delete(`/api/productos/${pidInvalido}`)
        .expect(400)
        expect(body.error).to.be.equal("Producto no encontrado")
    });

    it("La ruta /api/productos/:pid , en su metodo delete  ingresando un pid invalido, retorna un error 400", async () => {
      let pidInvalido = "66b4e4cfe3c5dea28ed8530";

      let { body } = await agent
        .delete(`/api/productos/${pidInvalido}`)
        .expect(400);
      expect(body.error).to.be.equal("Error ID invalido");
    });
   
    it("La ruta /api/productos/:pid , en su metodo delete  ingresando un pid invalido, retorna un error 400", async () => {
      let pidInvalido = "66b4e4cfe3c5dea28ed8530";

      let { body } = await requester
        .delete(`/api/productos/${pidInvalido}`)
        .expect(401);
      expect(body.error).to.be.equal("El usuario no tiene permisos para realizar esta acción");
    });


  });
});
