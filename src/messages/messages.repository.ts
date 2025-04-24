const { minioClient } = require('../../db');
const Message = require('../../models/message');

class MessagesRepository {
  static async postMessage(message: any) {
    try {
      const newMessage = await Message().build({
        senderID: message.senderID,
        chatID: message.chatID,
        text: message.text,
        sendingTime: message.sendingTime,
      });
      await newMessage.save();
      return newMessage;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

module.exports = {
  MessagesRepository,
};
export {};
