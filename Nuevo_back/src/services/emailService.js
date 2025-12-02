const nodemailer = require("nodemailer");

const isDev = !process.env.SMTP_HOST; // Mock if no SMTP_HOST

let transporter;
if (!isDev) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendWelcomeEmail(to, name) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "no-reply@tecnomatch.com",
    to,
    subject: "Bienvenido a TecnoMatch",
    text: `Hola ${name},\n\nGracias por registrarte en TecnoMatch. ¡Bienvenido a bordo!`,
  };
  if (isDev) {
    console.log("[MOCK EMAIL] Welcome Email to:", to);
    console.log("[MOCK EMAIL] Subject:", mailOptions.subject);
    console.log("[MOCK EMAIL] Body:", mailOptions.text);
    return { message: "Email mocked for dev" };
  }
  await transporter.sendMail(mailOptions);
}

async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM || "no-reply@tecnomatch.com",
    to,
    subject: "Recuperación de contraseña TecnoMatch",
    text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetUrl}`,
  };
  if (isDev) {
    console.log("[MOCK EMAIL] Password Reset to:", to);
    console.log("[MOCK EMAIL] Subject:", mailOptions.subject);
    console.log("[MOCK EMAIL] Body:", mailOptions.text);
    return { message: "Email mocked for dev" };
  }
  await transporter.sendMail(mailOptions);
}

async function sendResultNotification(to, result) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "no-reply@tecnomatch.com",
    to,
    subject: "Resultados de tu test en TecnoMatch",
    text: `Hola,\n\nAquí están los resultados de tu test:\n${JSON.stringify(result, null, 2)}`,
  };
  if (isDev) {
    console.log("[MOCK EMAIL] Result Notification to:", to);
    console.log("[MOCK EMAIL] Subject:", mailOptions.subject);
    console.log("[MOCK EMAIL] Body:", mailOptions.text);
    return { message: "Email mocked for dev" };
  }
  await transporter.sendMail(mailOptions);
}


// Removed sendPasswordChangeConfirmation to simplify password-flow (no further confirmation required)

module.exports = { sendWelcomeEmail, sendPasswordResetEmail, sendResultNotification };
