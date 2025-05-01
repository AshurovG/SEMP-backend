const { WebSocketServer } = require('ws');
import http from 'http';
const { UsersDAO } = require('./users/users.DAO');
const { ChatsRepository } = require('./chats/chats.repository');
const { MessagesRepository } = require('./messages/messages.repository');

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

  const sendMessageToOtherUsers = (message: any, createdMessage: any) => {
    console.log('created', createdMessage);
    const responseMessageData = {
      id: createdMessage.id,
      chatID: message.chatID,
      text: createdMessage.text,
      image: createdMessage.image,
      sendingTime: createdMessage.sendingTime,
      sender: {
        id: message.sender.id,
        firstname: message.sender.firstname,
        lastname: message.sender.lastname,
        avatar: message.sender.avatar,
      },
    };

    for (const [key, value] of Object.entries(connections)) {
      console.log('key', key, message.sender.id);
      console.log(
        'value.chatIds',
        value.chatIds,
        'id',
        message.chatID,
        value.chatIds.includes(message.chatID)
      );

      if (Number(key) !== Number(message.sender.id)) {
        if (value.chatIds.includes(message.chatID)) {
          value.ws.send(JSON.stringify(responseMessageData)); // Отправляем все пользователям кроме отправителя
        }
      }
    }
  };

  wss.on('connection', async (ws: any, req: any) => {
    console.log('Client connected');
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userID = url.searchParams.get('id');
    const userData = await UsersDAO.getUser(userID);
    const userChats = await ChatsRepository.getChats(userData);
    const chatIds = userChats.map((chat: any) => chat.id);
    console.log('connected', userID);

    if (userID) {
      // Проверяем, есть ли уже подключение для данного пользователя
      // if (connections[userID]) {
      //   // Если подключение уже существует, закрываем его
      //   connections[userID].ws.close();
      // }
      // Добавляем новое подключение
      connections[userID] = { id: Date.now(), ws: ws, chatIds };
      console.log(connections);
    } else {
      ws.close();
    }

    ws.on('message', async (message: any) => {
      try {
        // Получение сообщения от отправителя с браузера
        const messageString = message.toString();
        const messageJSON = JSON.parse(messageString);
        console.log('message json', messageJSON);
        const currentDateISO = new Date().toISOString();
        const createdMessage = await MessagesRepository.postMessage({
          senderID: messageJSON.sender.id,
          chatID: messageJSON.chatID,
          text: messageJSON.message.text,
          sendingTime: currentDateISO,
        });

        sendMessageToOtherUsers(messageJSON, createdMessage);
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

  return wss;
};
