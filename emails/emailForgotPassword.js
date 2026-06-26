import nodemailer from 'nodemailer'
import emailResetPassword from './templates/emailResetPassword.js';

const emailForgotPassword = async (datos) => {
  // Looking to send emails in production? Check out our Email API/SMTP product!
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Enviar Email
  const { name, email, token } = datos;
  console.log(name);
  const info = await transporter.sendMail({
    from: `"MercadoBarrio " <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Restaura tú contraseña en MercadoBarrio",
    html: emailResetPassword({ name, token }),
  });

  console.log("Mensaje enviado: %s", info.messageId + " ");
};

export default emailForgotPassword;
