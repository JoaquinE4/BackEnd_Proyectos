import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: "587",
  auth: {
    user: "casarotajoachin@gmail.com",
    pass: "qkospevztaifnays",
  },
});

/* transeporer.sendMail({
  from: "casarotajoachin@gmail.com",
  to: "casarotajoachin@gmail.com",
  subject: "Confirmacion de compra",
  text: "Gracias por su compra, su pedido esta en camino.",
}); */

/* export const enviarEmail = async (para, asunto, mensaje, adjuntos) => {
  return await transporter.sendMail({
    to: para,
    subject: asunto,
    html: mensaje,
    attachments: adjuntos,
  });
};

let resultado = await enviarEmail(
  "jbackend0@gmail.com",
  "prueba II",
  "hola...!!!"
);
if (resultado.accepted.length > 0) {
  console.log("Mail enviado...!!!");
} */
