const { minioClient } = require('../../db');
const Chat = require('../../models/chat');
const User = require('../../models/user');
const UserChat = require('../../models/userChat');
const Message = require('../../models/message');
const { UsersRepository } = require('../users/users.repository');

class ChatsRepository {
  static async getChats(user: any) {
    try {
      let chats;
      if (user.isAdmin) {
        chats = await Chat().findAll();
      } else {
        const userChats = await UserChat().findAll({
          where: { userID: user.id },
        });

        const chatIds = userChats.map((uc: any) => uc.chatID);

        chats = await Chat().findAll({
          where: {
            id: chatIds,
          },
        });
      }

      const chatsWithLatestMessages = await Promise.all(
        chats.map(async (chat: any) => {
          const messages = await Message().findAll({
            where: { chatID: chat.id },
          });

          const latestMessage =
            messages.length > 0
              ? messages.reduce(
                  (latest: any, current: any) =>
                    new Date(current.sendingTime) > new Date(latest.sendingTime)
                      ? current
                      : latest,
                  messages[0]
                )
              : null;

          if (!latestMessage) {
            return { ...chat.toJSON(), latestMessage: null };
          }

          const sender = await User().findOne({
            where: { id: latestMessage.senderID },
          });

          const latestMessageToSend = {
            id: latestMessage.id,
            text: latestMessage.text,
            image: latestMessage.image,
            sendingTime: latestMessage.sendingTime,
            sender: {
              firstname: sender?.firstname,
              lastname: sender?.lastname,
            },
          };

          return { ...chat.toJSON(), latestMessage: latestMessageToSend };
        })
      );

      return chatsWithLatestMessages;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async getChatById(id: number) {
    try {
      console.log('getChatById reo');

      const allUsers = await User().findAll();

      const usersMap = allUsers.reduce((map: any, user: any) => {
        map[user.id] = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          avatar: user.avatar,
        };
        return map;
      }, {});

      const userChats = await UserChat().findAll({
        where: { chatID: id },
      });

      const messages = await Message().findAll({
        where: { chatID: id },
      });

      let users = userChats.map((userChat: any) => usersMap[userChat.userID]);
      const admins = await UsersRepository.getAdmins();
      users = [...admins, ...users];

      const chat = await Chat().findByPk(id);

      const messagesWithSenders = messages.map((message: any) => ({
        id: message.id,
        text: message.text,
        image: message.image,
        sendingTime: message.sendingTime,
        sender: usersMap[message.senderID],
      }));

      return {
        ...chat.toJSON(),
        users,
        messages: messagesWithSenders,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async postChat(title: string, description: string, image: any) {
    try {
      if (image) {
        await minioClient.putObject(
          'semp',
          `chats/${image.originalname}`,
          image.buffer
        );
      }

      const newChat = await Chat().build({
        title,
        description,
        ...(image && {
          image: `http://localhost:9000/semp/posts/${image.originalname}`,
        }),
      });

      await newChat.save();
    } catch (e) {
      throw e;
    }
  }

  static async updateChat(
    id: number,
    title: string,
    description: string,
    image: any
  ) {
    try {
      const chatToUpdate = await Chat().findByPk(id);

      console.log('req', id, title, description, image);
      if (!chatToUpdate) {
        throw new Error('Chat not found');
      }

      if (image) {
        if (chatToUpdate.image) {
          const oldImagePath = chatToUpdate.image.replace(
            'http://localhost:9000/semp/',
            ''
          );
          await minioClient.removeObject('semp', oldImagePath);
        }

        await minioClient.putObject(
          'semp',
          `chats/${image.originalname}`,
          image.buffer
        );

        chatToUpdate.image = `http://localhost:9000/semp/chats/${image.originalname}`;
      }

      chatToUpdate.title = title;
      chatToUpdate.description = description;

      await chatToUpdate.save();
      return chatToUpdate;
    } catch (e) {
      console.log('req', id, title, description, image);
      console.log(e);
      throw e;
    }
  }

  static async deleteChat(id: number) {
    try {
      await Chat().destroy({ where: { id } });
    } catch (e) {
      throw e;
    }
  }

  static async getUsersNotFromChat(id: number) {
    try {
      const allUsers = await User().findAll();

      const userChats = await UserChat().findAll({
        where: { chatID: id },
      });

      const userChatIds = new Set(
        userChats.map((userChat: any) => userChat.userID)
      );

      const usersNotInChat = allUsers.filter(
        (user: any) => !userChatIds.has(user.id) && !user.isAdmin
      );

      return usersNotInChat;
    } catch (e) {
      throw e;
    }
  }

  static async addUsersToChat(id: number, users: number[]) {
    try {
      const userChatEntries = users.map((userID) => ({
        userID: userID,
        chatID: id,
      }));

      await UserChat().bulkCreate(userChatEntries);
    } catch (e) {
      throw e;
    }
  }

  static async deleteUsersFromChat(id: number, users: number[]) {
    await UserChat().destroy({
      where: {
        chatID: id,
        userID: users,
      },
    });
    try {
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

module.exports = {
  ChatsRepository,
};
export {};
