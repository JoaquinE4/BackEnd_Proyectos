Swal.fire({
  title: "Identificarse",
  input: "text",
  text: "ingrese su Email",
  inputValidator: (value) => {
    return !value && "Debe ingresar un nombre";
  },
  allowOutsideClick: false,
}).then((datos) => {
  let nombre = datos.value;
  document.title = nombre;
  let inputMensaje = document.getElementById("mensaje");
  let divMensajes = document.getElementById("mensajes");
  inputMensaje.focus();

  const socket = io();

  socket.emit("id", nombre);

  socket.on("nuevoUsuario", (nombre) => {
    Toastify({
      text: `${nombre} se ha conectado...!!!`,

      duration: 3000,
    }).showToast();
  });

  socket.on("saleUsuario", (nombre) => {
    divMensajes.innerHTML += `<span class="mensaje text-danger"><strong>${nombre}</strong> ha salido del chat </span><br>`;
  });

  socket.on("mensajesPrevios", (mensajes) => {
    mensajes.forEach((m) => {
      divMensajes.innerHTML += `<span class="mensaje"><strong>${m.nombre}</strong> dice <i>${m.mensaje}</i></span><br>`;
    });
  });

  inputMensaje.addEventListener("keyup", (e) => {
    e.preventDefault();

    if (e.code === "Enter" && e.target.value.trim().length > 0) {
      socket.emit("mensaje", nombre, e.target.value.trim());
      e.target.value = "";
      e.target.focus();
    }
  });

  socket.on("nuevoMensaje", (nombre, mensaje) => {
    divMensajes.innerHTML += `<span class="mensaje "><strong>${nombre}</strong> dice <i>${mensaje}</i> </span><br>`;
  });
});
