const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


app.use(bodyParser.json());
app.use(cors());
app.use(helmet());


const SECRET_KEY = process.env.SECRET_KEY || 'supersecretkey';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;


const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('join-room', (chatRoomId) => {
    if (!chatRoomId) {
      console.error('El cliente intentó unirse a una sala sin un chatRoomId válido.');
      return;
    }
    socket.join(chatRoomId);
    console.log(`Cliente se unió a la sala ${chatRoomId}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

//  validar el token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Registro 
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from('users')
      .insert([{ username, email, password_hash: hashedPassword }]);

    if (error) throw error;

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// Inicio de sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Inicio de sesión exitoso' });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

//  mensajes
app.post('/messages', authenticateToken, async (req, res) => {
  const { content } = req.body;
  const chatRoomId = 1; // Sala global
  const userId = req.user.id;

  if (!content) {
      console.error('El contenido del mensaje está vacío.');
      return res.status(400).json({ message: 'El contenido del mensaje es obligatorio' });
  }

  try {
      const { error } = await supabase
          .from('messages')
          .insert([{ content, user_id: userId, chat_room_id: chatRoomId }]);

      if (error) throw error;

      io.to(chatRoomId).emit('new-message', { content, userId });
      res.status(201).json({ message: 'Mensaje enviado con éxito' });
  } catch (err) {
      console.error('Error al enviar mensaje:', err);
      res.status(500).json({ message: 'Error al enviar mensaje' });
  }
});

// recuperar mensajes
app.get('/messages', authenticateToken, async (req, res) => {
  const chatRoomId = 1; // Sala global
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, content, created_at, user_id, users(username)')
      .eq('chat_room_id', chatRoomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al recuperar mensajes:', error);
      return res.status(500).json({ message: 'Error al recuperar mensajes' });
    }

    console.log('Mensajes recuperados desde el backend:', messages); // Depuración
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error al recuperar mensajes:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
