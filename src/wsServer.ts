// websocket.ts
const { WebSocketServer } = require('ws');
import http from 'http';
const { UsersDAO } = require('./users/users.DAO');
const { ChatsDAO } = require('./chats/chats.DAO');
const { ChatsRepository } = require('./chats/chats.repository');

type Connection = {
  id: number;
  ws: WebSocket;
  chatIds: number[];
};

type ConectionsData = {
  [key: string]: Connection;
};

export const setupWebSocket = (server: http.Server) => {
  let connections: ConectionsData = {};

  const wss = new WebSocketServer({ server });

  const sendMessageToOtherUsers = (message: any) => {
    for (const [key, value] of Object.entries(connections)) {
      console.log('key', key, message.user.id);
      if (Number(key) !== Number(message.user.id)) {
        value.ws.send(JSON.stringify(message)); // Отправляем все пользователям кроме отправителя
      }
    }
  };

  wss.on('connection', async (ws: any, req: any) => {
    console.log('Client connected');
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userID = url.searchParams.get('id');
    const userData = await UsersDAO.getUser(userID);
    // const userChats = await ChatsDAO.getChats(userData);
    const userChats = await ChatsRepository.getChats(userData);
    const chatIds = userChats.map((chat: any) => chat.id);
    console.log('connected', userID);

    if (userID) {
      // Проверяем, есть ли уже подключение для данного пользователя
      if (connections[userID]) {
        // Если подключение уже существует, закрываем его
        connections[userID].ws.close();
      }
      // Добавляем новое подключение
      connections[userID] = { id: Date.now(), ws: ws, chatIds };
      console.log(connections);
    } else {
      ws.close();
    }

    ws.on('message', (message: any) => {
      try {
        // Получение сообщения от отправителя с браузера
        const messageString = message.toString();
        const messageJSON = JSON.parse(messageString);
        console.log('message json', messageJSON);
        const currentDateISO = new Date().toISOString();
        messageJSON.time = currentDateISO;
        // TODO: Здесь сохранять в базу
        sendMessageToOtherUsers(messageJSON);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      // Удаляем закрытое подключение из объекта connections при закрытии о
      if (userID && connections[userID]) {
        delete connections[userID];
      }
    });
  });

  //   wss.on('connection', (ws: any) => {
  //     console.log('Новое WebSocket соединение');

  //     ws.on('message', (message: any) => {
  //       console.log(`Получено сообщение: ${message}`);
  //       // Рассылка сообщения всем клиентам
  //       if (wss.clients) {
  //         wss.clients.forEach((client: any) => {
  //           if (client !== ws && client.readyState === WebSocketServer.OPEN) {
  //             client.send(message.toString());
  //           }
  //         });
  //       }
  //     });

  //     ws.on('close', () => {
  //       console.log('Соединение закрыто');
  //     });
  //   });

  return wss;
};
