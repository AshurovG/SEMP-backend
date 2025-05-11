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
const likesRouter = require('./likes/likes.routes');

const app = express();
const PORT = 8000;

const server = http.createServer(app);

setupWebSocket(server);

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'ws://localhost:5173', // для WebSocket
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
app.use('/api', likesRouter);

server.listen(PORT, () => {
  console.log(`HTTP и WebSocket сервер запущен на порту ${PORT}`);
});
