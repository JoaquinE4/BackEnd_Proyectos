document.getElementById("logout").addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        let respuesta = await fetch("/api/sessions/logout", {
            method: "GET"
        });

        let datos = await respuesta.json();
        console.log(datos);

        if (respuesta.ok) {
            window.location.href = "/login";
        }

    } catch (error) {
         window.location.href = "/Perfil?error=Error en la solicitud";
    }
});