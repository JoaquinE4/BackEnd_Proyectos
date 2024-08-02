document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

 
    let formData = new FormData(document.getElementById("loginForm"));
    let email = formData.get("email");
    let password = formData.get("password");

 
    let body = {
        email,
        password
    };

    try {
        let respuesta = await fetch("/api/sessions/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        let datos = await respuesta.json();

        if (respuesta.ok) {
            window.location.href = "/perfil";
        } else {
            window.location.href = "/login?error=Error al validar";
        }
    } catch (error) {
        console.error("Error al realizar el login:", error);
        window.location.href = "/login?error=Error en la solicitud";
    }
});
