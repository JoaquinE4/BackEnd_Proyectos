import os from "os"

export function argumentosProductos(producto){

    let {title,price,code, ...otros}=producto
    return `Se han detectado argumentos inválidos:
Argumentos obligatorios:
    - title: tipo String. Se recibió: ${title}
    - price: tipo Number. Se recibió: ${price}
    - code: tipo String. Se recibió: ${code}
Argumentos opcionales:
    -descripcion, stock, thumbnail. Se recibió: ${JSON.stringify(otros)}

Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}`

}