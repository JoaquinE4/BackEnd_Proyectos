document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    let formData = new FormData(document.getElementById("registerForm"));
    let email = formData.get("email");
    let password = formData.get("password");
    let first_name = formData.get("first_name");
    let last_name = formData.get("last_name");
    let age = formData.get("age");

    let body = {
        first_name,
        last_name,
        age,
        email,
        password
    };

    try {
        let respuesta = await fetch("/api/sessions/registro", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        let datos = await respuesta.json();

        if (respuesta.ok) {
            window.location.href = "/login";
        } else {
            window.location.href = "/registro?error=Error al validar";
        }
    } catch (error) {
        console.error("Error al realizar el registro:", error);
        window.location.href = "/registro?error=Error en la solicitud";
    }
});