console.log("Hola!")

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
          location.replace('http://localhost:8080/carts')
  
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
    if (cid)  {
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
          location.replace('http://localhost:8080/carts')
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
    // Obtener el cuerpo de la tabla
    const tbody = document.getElementById('table').getElementsByTagName('tbody')[0];
    const table = document.getElementById('table'); // Asegúrate de tener una referencia a la tabla
    const tienda = document.getElementById('tienda'); // Asegúrate de tener una referencia a la tabla

    // Verificar si hay filas en el cuerpo de la tabla
    if (tbody && tbody.getElementsByTagName('tr').length === 0) {
        // Si la tabla está vacía, cambiar la clase a 'd-none'
        table.classList.add('d-none');
        tienda.classList.remove('d-none');

      } else {
        // Si la tabla tiene elementos, asegurarse de que la clase 'd-none' esté eliminada
        tienda.classList.add('d-none');
        table.classList.remove('d-none');
    }
};

// Llamar a la función para inicializar el estado de la tabla
toggleTableVisibility();
