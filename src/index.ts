// import express from 'express';
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const http = require('http');
// const { WebSocketServer } = require('ws');

// const usersRouter = require('./users/users.routes');
// const authRouter = require('./auth/auth.routes');
// const postsRouter = require('./posts/posts.routes');
// const commentsRouter = require('./comments/comments.routes');
// const chatsRouter = require('./chats/chats.routes');

// const app = express();
// const PORT = 8000;

// const server = http.createServer(app);
// const wss = new WebSocketServer({ server });

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   })
// );
// // app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.json());

// app.use('/api', usersRouter);
// app.use('/api', authRouter);
// app.use('/api', postsRouter);
// app.use('/api', commentsRouter);
// app.use('/api', chatsRouter);

// // app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// // WebSocket соединение
// wss.on('connection', (ws: any) => {
//   console.log('Новое WebSocket соединение');

//   ws.on('message', (message: any) => {
//     console.log(`Получено сообщение: ${message}`);
//     // Рассылка сообщения всем клиентам
//     wss.clients.forEach((client: any) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });

//   ws.on('close', () => {
//     console.log('Соединение закрыто');
//   });
// });

// // Запускаем сервер
// server.listen(PORT, () => {
//   console.log(`HTTP и WebSocket сервер запущен на порту ${PORT}`);
// });

import express from 'express';
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
import { setupWebSocket } from './wsServer'; // Импортируем нашу функцию

const usersRouter = require('./users/users.routes');
const authRouter = require('./auth/auth.routes');
const postsRouter = require('./posts/posts.routes');
const commentsRouter = require('./comments/comments.routes');
const chatsRouter = require('./chats/chats.routes');

const app = express();
const PORT = 8000;

const server = http.createServer(app);

// Настраиваем WebSocket
setupWebSocket(server);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use('/api', usersRouter);
app.use('/api', authRouter);
app.use('/api', postsRouter);
app.use('/api', commentsRouter);
app.use('/api', chatsRouter);

server.listen(PORT, () => {
  console.log(`HTTP и WebSocket сервер запущен на порту ${PORT}`);
});
