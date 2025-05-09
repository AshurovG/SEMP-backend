const { AuthRepository } = require('./auth.repository');
const { UsersRepository } = require('../users/users.repository');
const { CustomError } = require('../consts');
import crypto from 'crypto';

class AuthDAO {
  static async codeGen(telegram: string) {
    try {
      const isUserExists = await AuthRepository.checkUser(telegram);
      if (!isUserExists) {
        throw new CustomError('profile has not been found', 404);
      }

      let randomBytes = crypto.randomBytes(10);
      let randomCode = randomBytes
        .toString('base64')
        .replace(/\+/g, '')
        .replace(/\//g, '');
      randomCode = randomCode.slice(0, -2);
      await AuthRepository.codeGen(telegram, randomCode);
      return { code: randomCode };
    } catch (error) {
      throw error;
    }
  }

  static async auth(telegram: string, code: string) {
    try {
      const isUserExists = await AuthRepository.checkUser(telegram);
      if (!isUserExists) {
        const error = new CustomError('profile has not been found', 404);
        throw error;
      }

      const randomBytes = crypto.randomBytes(50);
      const randomSessionID = randomBytes
        .toString('base64')
        .replace(/\+/g, '')
        .replace(/\//g, '');

      const lastCode = await AuthRepository.auth(telegram, randomSessionID);
      if (lastCode !== code) {
        throw new CustomError('invalid access code', 401);
      } else {
        AuthRepository.resetLastCode(telegram);
      }
      return randomSessionID;
    } catch (error) {
      throw error;
    }
  }

  static async getUserBySession(sessionID: string) {
    try {
      const userData = await UsersRepository.getUserBySessionID(sessionID);
      const { lastCode, ...userDataWithoutLastCode } = userData;
      return userDataWithoutLastCode;
    } catch (error) {
      throw error;
    }
  }

  static async logout(sessionID: string) {
    try {
      await AuthRepository.logout(sessionID);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  AuthDAO,
};
export {};
