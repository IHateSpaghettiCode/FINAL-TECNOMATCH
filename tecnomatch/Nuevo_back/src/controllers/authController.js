// src/controllers/authController.js - VERSIÓN CORREGIDA
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // 👈 AÑADIR ESTO

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// Función para verificar contraseña SHA2 (para usuarios existentes)
function verifySHA2Password(inputPassword, storedHash) {
  try {
    const inputHash = crypto.createHash('sha256').update(inputPassword).digest('hex');
    return inputHash === storedHash.toLowerCase();
  } catch (error) {
    return false;
  }
}

// Login de usuario - VERSIÓN CORREGIDA CON VALIDACIÓN DE CONFIRMACIÓN
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos", message: "Por favor, completa tu correo y contraseña para iniciar sesión." });
    }

    const user = await prisma.usuarios.findUnique({ 
      where: { correo: email.toUpperCase() } // 👈 Buscar en mayúsculas
    });
    
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas", message: "Email o contraseña incorrectos. Por favor revisa tus datos." });
    }

    let validPassword = false;

    // 👇 VERIFICAR AMBOS MÉTODOS DE ENCRIPTACIÓN
    if (user.password.startsWith('$2')) {
      // Contraseña encriptada con bcrypt (nuevos usuarios)
      validPassword = await bcrypt.compare(password, user.password);
    } else {
      // Contraseña encriptada con SHA2 (usuarios existentes de BD)
      validPassword = verifySHA2Password(password, user.password);
      
      // 👇 OPCIONAL: Migrar a bcrypt automáticamente
      if (validPassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.usuarios.update({
          where: { id_usuario: user.id_usuario },
          data: { password: hashedPassword }
        });
        console.log(`✅ Contraseña migrada a bcrypt para usuario: ${user.correo}`);
      }
    }

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas", message: "Email o contraseña incorrectos. Por favor revisa tus datos." });
    }

    // NOTE: Removed confirmation requirement for login (email verification removed)

    const token = jwt.sign({ id: user.id_usuario }, JWT_SECRET, { expiresIn: "7d" });
    const loginMessage = `¡Bienvenido de vuelta, ${user.nombre || user.nombre_usuario}!`;

    return res.json({
      user: {
        id: user.id_usuario,
        name: user.nombre,
        email: user.correo,
        nombre_usuario: user.nombre_usuario,
        apellido: user.apellido,
        telefono: user.telefono,
        rol_id: user.rol_id
      },
      token,
      message: loginMessage
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error en el login" });
  }
}

// Registro de usuario - VERSIÓN MEJORADA
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son requeridos", message: "Por favor llena Nombre, Correo y Contraseña para registrarte." });
    }

    const existingUser = await prisma.usuarios.findUnique({ 
      where: { correo: email.toUpperCase() } // 👈 Buscar en mayúsculas
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado", message: "El correo ya se encuentra registrado. Intenta con otro correo o inicia sesión." });
    }

    // 👇 SIEMPRE usar bcrypt para nuevos registros
    const hashedPassword = await bcrypt.hash(password, 10);

    // Dividir el nombre en nombre y apellido
    const nameParts = name.trim().split(' ');
    const nombre = nameParts[0] || '';
    const apellido = nameParts.slice(1).join(' ') || 'Usuario';

    const newUser = await prisma.usuarios.create({
      data: { 
        nombre: nombre,
        apellido: apellido,
        correo: email.toUpperCase(), // 👈 Guardar en mayúsculas
        password: hashedPassword,
        nombre_usuario: email.split('@')[0].toUpperCase(), // 👈 Mayúsculas
        estado: 1,
        confirmed: true // Set to true because email verification flow was removed
      },
    });

    const token = jwt.sign({ id: newUser.id_usuario }, JWT_SECRET, { expiresIn: "7d" });
    const firstName = newUser.nombre || 'Usuario';
    const welcomeMessage = `¡Bienvenido, ${firstName}! Tu cuenta ha sido creada con éxito.`;

    return res.status(201).json({ 
      user: { 
        id: newUser.id_usuario, 
        name: newUser.nombre + ' ' + newUser.apellido,
        email: newUser.correo,
        nombre_usuario: newUser.nombre_usuario
      }, 
      token 
      , message: welcomeMessage
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ error: "Error en el registro: " + error.message });
  }
}

// src/controllers/authController.js
const { sendPasswordResetEmail } = require("../services/emailService");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "El correo es obligatorio" });
    }

    // Buscar usuario por email (en mayúsculas)
    const user = await prisma.usuarios.findUnique({
      where: { correo: email.toUpperCase() }
    });

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return res.status(200).json({ message: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña" });
    }

    // Generar token único para reset password
    const resetToken = crypto.randomBytes(32).hex();
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Guardar token en BD (usando confirmation_token temporalmente)
    await prisma.usuarios.update({
      where: { id_usuario: user.id_usuario },
      data: { confirmation_token: hashedToken }
    });

    // Enviar email con token
    await sendPasswordResetEmail(user.correo, resetToken);

    res.status(200).json({ message: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña" });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ message: "Error procesando la solicitud" });
  }
};

// Reset Password - Nuevo endpoint
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token y nueva contraseña son obligatorios" });
    }

    // Hashear el token recibido
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuario con ese token
    const user = await prisma.usuarios.findFirst({
      where: { confirmation_token: hashedToken }
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Hashear nueva contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar token
    await prisma.usuarios.update({
      where: { id_usuario: user.id_usuario },
      data: {
        password: hashedPassword,
        confirmation_token: null
      }
    });

    res.status(200).json({ message: "Contraseña restablecida exitosamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ message: "Error restableciendo contraseña" });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };


