const socket = io();

socket.on('nuevaConexion', data=>{
    Toastify({

        text: `${data} se ha conectado!`,

        duration: 3000

    }).showToast();
})


const list = document.getElementById('list-group');

socket.on("nuevoProducto", newProduct => {
    console.log(newProduct)
    list.innerHTML += `<li class="list-group-item" >${newProduct.title} <br/><p>Precio ${newProduct.price}</li>`;
});

socket.on('delete',productos=>{
    console.log(productos)
   list.innerHTML=""
    productos.map(p=>{
        list.innerHTML+=`<li class="list-group-item" >Nombre: ${p.title} <br/><p>Precio ${p.price}</p></li>`
    })
})

//``localhost/8080/api/products/${prevLink}`