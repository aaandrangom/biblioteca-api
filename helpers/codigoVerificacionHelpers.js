const nodemailer = require("nodemailer");

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            text-align: center;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .footer {
            background-color: #ddd;
            padding: 10px;
            text-align: center;
            font-size: 0.8em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Biblioteca La Costeñita</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Gracias por unirte a nuestra biblioteca. Estamos emocionados de tenerte a bordo.</p>
            <p>Tu código de verificación es: <strong>{{codigoVerificacion}}</strong></p>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
        <div class="footer">
            <p>Saludos,</p>
            <p>El equipo de Biblioteca La Costeñita</p>
        </div>
    </div>
</body>
</html>
`;

const htmlPedidoAceptado = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            text-align: center;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .footer {
            background-color: #ddd;
            padding: 10px;
            text-align: center;
            font-size: 0.8em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Biblioteca La Costeñita</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Su pedido con el identificador <strong>{{ped_secuencial}}</strong> ha sido aceptado.</p>
            <p>Por favor, acérquese a la biblioteca hasta el <strong>{{FECHA_DE_ENTREGA}}</strong>.</p>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
        <div class="footer">
            <p>Saludos,</p>
            <p>El equipo de Biblioteca La Costeñita</p>
        </div>
    </div>
</body>
</html>
`;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function enviarCodigoVerificacion(usuarioEmail, codigoVerificacion) {
  const htmlConCodigo = htmlContent.replace(
    "{{codigoVerificacion}}",
    codigoVerificacion
  );

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: usuarioEmail,
    subject: "Bienvenido a la Biblioteca La costeñita",
    html: htmlConCodigo,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);
  } catch (error) {
    console.error("Error al enviar correo: ", error);
  }
}

async function enviarMensajeLibroAcceptado(
  usuarioEmail,
  pedSecuencial,
  fechaEntrega
) {
  const htmlConTextoPersonalizado = htmlPedidoAceptado
    .replace("{{ped_secuencial}}", pedSecuencial)
    .replace("{{FECHA_DE_ENTREGA}}", fechaEntrega);

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: usuarioEmail,
    subject: "Respuesta Pedido",
    html: htmlConTextoPersonalizado,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);
  } catch (error) {
    console.error("Error al enviar correo: ", error);
  }
}

module.exports = { enviarCodigoVerificacion, enviarMensajeLibroAcceptado };
