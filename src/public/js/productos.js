const comprar = async (pid) => {
  // Obtener el ID del carrito desde el input
  const inputCart = document.getElementById("carrito");
  const cid = inputCart.value;
  console.log(pid, cid);
  // Verificar si el ID del carrito y el ID del producto son números válidos
  if (cid && pid) {
    // Construir la URL para la solicitud
    const url = `/api/carts/${cid}/product/${pid}`;
    console.log(url);
    // Realizar la solicitud POST a la URL construida
    try {
      const respuesta = await fetch(url, {
        method: "POST",
      });

      console.log(`Código de producto ${pid} agregado al carrito ${cid}`);
      if (respuesta.status === 200) {
        let datos = await respuesta.json();
        console.log(datos);
        Toastify({
          text: `Producto con ID ${pid} fue agregado`,

          duration: 3000,
        }).showToast();
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
