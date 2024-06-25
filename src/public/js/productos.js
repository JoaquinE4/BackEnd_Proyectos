const comprar = async (pid) => {
  const inputCart = document.getElementById("carrito");
  const cid = inputCart.value;
  if (cid && pid) {
    const url = `/api/carts/${cid}/product/${pid}`;

    try {
      const respuesta = await fetch(url, {
        method: "POST",
      });

      console.log(`Código de producto ${pid} agregado al carrito ${cid}`);
      if (respuesta.status === 200) {
        let datos = await respuesta.json();
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
