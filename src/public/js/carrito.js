console.log("Hola!");

const eliminar = async (pid) => {
  const inputCart = document.getElementById("carrito");
  const cid = inputCart.value;
  console.log(pid, cid);
  if (cid && pid) {
    const url = `/api/carts/${cid}/product/${pid}`;
    console.log(url);
    try {
      const respuesta = await fetch(url, {
        method: "DELETE",
      });

      console.log(`Código de producto ${pid} agregado al carrito ${cid}`);
      if (respuesta.status === 200) {
        let datos = await respuesta.json();
        console.log(datos);
        alert("¡Producto eliminado!");
        location.replace("http://localhost:8080/carts");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  } else {
    console.error(
      "El ID del carrito y el ID del producto deben ser números válidos."
    );
  }
};

const eliminarTodo = async () => {
  const inputCart = document.getElementById("carrito");
  const cid = inputCart.value;
  if (cid) {
    const url = `/api/carts/${cid}`;
    console.log(url);
    try {
      const respuesta = await fetch(url, {
        method: "DELETE",
      });

      console.log(` Productos Eliminados del carrito ${cid}`);
      if (respuesta.status === 200) {
        let datos = await respuesta.json();
        console.log(datos);
        alert("¡Productos eliminados!");
        location.replace("http://localhost:8080/carts");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  } else {
    console.error(
      "El ID del carrito y el ID del producto deben ser números válidos."
    );
  }
};

const toggleTableVisibility = () => {
  const tbody = document
    .getElementById("table")
    .getElementsByTagName("tbody")[0];
  const table = document.getElementById("table");
  const tienda = document.getElementById("tienda");

  if (tbody && tbody.getElementsByTagName("tr").length === 0) {
    table.classList.add("d-none");
    tienda.classList.remove("d-none");
  } else {
    tienda.classList.add("d-none");
    table.classList.remove("d-none");
  }
};

toggleTableVisibility();
