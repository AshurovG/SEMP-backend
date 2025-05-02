const { UsersRepository } = require('./users.repository');
const { AuthRepository } = require('../auth/auth.repository');
const { CustomError } = require('../consts');
import crypto from 'crypto';
import { User } from './types';

class UsersDAO {
  // TODO: Сделать валидацию полей пользователя

  static async _isUserExist(id: number) {
    await this.getUser(id);
  }

  static async _isCurrentUserAdmin(sessionID: string) {
    if (!(await this.getCurrentUser(sessionID)).isAdmin) {
      throw new CustomError(`you don't have admin permission`, 403);
    }
  }

  static async getUsers() {
    try {
      const query = await UsersRepository.getUsers();
      return query;
    } catch (e) {
      throw e;
    }
  }

  static async getUser(id: number) {
    try {
      const query = await UsersRepository.getUser(id);
      if (!query) {
        throw new CustomError(`There is no user with id=${id}`, 404);
      }
      return query;
    } catch (e) {
      throw e;
    }
  }

  static async getCurrentUser(sessionID: string) {
    try {
      // console.log('session', sessionID);
      const currentUser: User = await UsersRepository.getUserBySessionID(
        sessionID
      );
      // console.log('current user', currentUser);
      if (!currentUser) {
        throw new CustomError(
          `you don't have permission to update user data`,
          403
        );
      }
      return currentUser;
    } catch (e) {
      throw e;
    }
  }

  static async postUser(
    firstname: string,
    lastname: string,
    department: string,
    position: string,
    telegram: string,
    whatsapp: string,
    phoneNumber: string,
    birthDate: string,
    isAdmin: boolean
  ) {
    try {
      await UsersRepository.postUser(
        firstname,
        lastname,
        department,
        position,
        telegram,
        whatsapp,
        phoneNumber,
        birthDate,
        isAdmin
      );
    } catch (e) {
      throw e;
    }
  }

  static async updateUser(
    id: string,
    firstname: string,
    lastname: string,
    department: string,
    position: string,
    whatsapp: string,
    phoneNumber: string,
    birthDate: string,
    isAdmin: boolean,
    sessionID: string,
    image: any
  ) {
    try {
      const currentUser = await this.getCurrentUser(sessionID);
      await this._isUserExist(Number(id));
      if (currentUser.isAdmin) {
        await UsersRepository.updateUser(
          Number(id),
          firstname,
          lastname,
          department,
          position,
          whatsapp,
          phoneNumber,
          birthDate,
          isAdmin,
          image
        );
      } else if (String(currentUser.id) === id && !currentUser.isAdmin) {
        await UsersRepository.updateUser(
          id,
          firstname,
          lastname,
          whatsapp,
          phoneNumber,
          birthDate,
          image
        );
      } else {
        throw new CustomError(
          `you don't have permission to update user data`,
          403
        );
      }
    } catch (e) {
      throw e;
    }
  }

  static async deleteUser(id: number, sessionID: string) {
    try {
      await this._isCurrentUserAdmin(sessionID);
      await this._isUserExist(id);
      await UsersRepository.deleteUser(id);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = {
  UsersDAO,
};
export {};
