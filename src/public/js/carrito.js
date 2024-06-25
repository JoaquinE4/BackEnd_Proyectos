const eliminar = async (pid) => {
  const inputCart = document.getElementById("carrito");
  const cid = inputCart.value;
  if (cid && pid) {
    const url = `/api/carts/${cid}/product/${pid}`;
    try {
      const respuesta = await fetch(url, {
        method: "DELETE",
      });

      if (respuesta.status === 200) {
        let datos = await respuesta.json();
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
    try {
      const respuesta = await fetch(url, {
        method: "DELETE",
      });

      if (respuesta.status === 200) {
        let datos = await respuesta.json();
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

const finalizarCompra = async () => {
  const inputCart = document.getElementById("carrito");
  const cid = inputCart.value;

  if (cid) {
    const url = `/api/carts/${cid}/purchase`;

    const respuesta = await fetch(url, {
      method: "GET",
    });

    location.replace("http://localhost:8080/ticket");
  }
};

const toggleTableVisibility = () => {
  // Obtener el cuerpo de la tabla
  const tbody = document
    .getElementById("table")
    .getElementsByTagName("tbody")[0];
  const table = document.getElementById("table");
  const tienda = document.getElementById("tienda");
  const btnEliminar = document.getElementById("btnEliminar");
  const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");

  // Verificar si hay filas en el cuerpo de la tabla
  if (tbody && tbody.getElementsByTagName("tr").length === 0) {
    btnEliminar.classList.add("d-none");
    btnFinalizarCompra.classList.add("d-none");
    table.classList.add("d-none");
    tienda.classList.remove("d-none");
  } else {
    tienda.classList.add("d-none");
    table.classList.remove("d-none");
    btnEliminar.classList.remove("d-none");
    btnFinalizarCompra.classList.remove("d-none");
  }
};

toggleTableVisibility();
