const { ChatsRepository } = require('./chats.repository');
const { CustomError } = require('../consts');
import { ChatData } from './types';

class ChatsDAO {
  static _ifOneFromFieldsEmpty(title: string, description: string) {
    if (!title || !description) {
      throw new CustomError('title, description - required fields', 400);
    }
  }

  static async _isChatExist(id?: number, title?: string) {
    const chats = await this.getChats();
    if (title) {
      return chats.some((chat: ChatData) => chat.title.trim() === title);
    } else if (id) {
      return chats.some((chat: ChatData) => chat.id === id);
    }
  }

  static async getChats() {
    try {
      const chats = await ChatsRepository.getChats();
      return chats;
    } catch (e) {
      throw e;
    }
  }

  static async getChatById(id: number) {
    try {
      const isChatExist = await this._isChatExist(id);
      if (!isChatExist) {
        throw new CustomError(`chat with id=${id} doesn't exist`, 404);
      }

      const chat = await ChatsRepository.getChatById(id);
      return chat;
    } catch (e) {
      throw e;
    }
  }

  static async postChat(title: string, description: string, image: any) {
    try {
      this._ifOneFromFieldsEmpty(title, description);
      const isChatExist = await this._isChatExist(undefined, title);
      if (isChatExist) {
        throw new CustomError(`chat with name="${title}" already exists`, 400);
      }
      await ChatsRepository.postChat(title, description, image);
    } catch (e) {
      throw e;
    }
  }

  static async updateChat(id: number, title: string, description: string) {
    try {
      const isChatExist = await this._isChatExist(id);
      if (!isChatExist) {
        throw new CustomError(`chat with id=${id} doesn't exist`, 404);
      }

      await ChatsRepository.updateChat(id, title, description);
    } catch (e) {
      throw e;
    }
  }

  static async deleteChat(id: number) {
    try {
      const isChatExist = await this._isChatExist(id);
      if (!isChatExist) {
        throw new CustomError(`chat with id=${id} doesn't exist`, 404);
      }

      await ChatsRepository.deleteChat(id);
    } catch (e) {
      throw e;
    }
  }

  static async getUsersNotFromChat(id: number) {
    try {
      const isChatExist = await this._isChatExist(id);
      if (!isChatExist) {
        throw new CustomError(`chat with id=${id} doesn't exist`, 404);
      }

      const users = await ChatsRepository.getUsersNotFromChat(id);
      return users;
    } catch (e) {
      throw e;
    }
  }

  static async addUsersToChat(id: number, users: number[]) {
    try {
      const isChatExist = await this._isChatExist(id);
      if (!isChatExist) {
        throw new CustomError(`chat with id=${id} doesn't exist`, 404);
      }

      await ChatsRepository.addUsersToChat(id, users);
    } catch (e) {
      throw e;
    }
  }

  static async deleteUsersFromChat(id: number, users: number[]) {
    try {
      const isChatExist = await this._isChatExist(id);
      if (!isChatExist) {
        throw new CustomError(`chat with id=${id} doesn't exist`, 404);
      }

      await ChatsRepository.deleteUsersFromChat(id, users);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = {
  ChatsDAO,
};
export {};
