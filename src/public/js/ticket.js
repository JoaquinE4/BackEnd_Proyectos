const alerta = () => {
  const ulProd = document.getElementById("ulProd");
  const alertaDiv = document.getElementById("alerta");

  if (!ulProd) {
    console.error('Elemento <ul> con id "ulProd" no encontrado.');
    return;
  }

  const cantidadLi = ulProd.getElementsByTagName("li").length;
  if (cantidadLi === 0) {
    alertaDiv.classList.add("d-none");
  } else {
    alertaDiv.classList.remove("d-none");
  }
};

alerta();
