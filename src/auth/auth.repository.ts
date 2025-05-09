const { dbConf, redisConf } = require('../../db');
const User = require('../../models/user');

class AuthRepository {
  static async codeGen(telegram: string, code: string) {
    await User().update({ lastCode: code }, { where: { telegram } });
  }

  static async auth(telegram: string, sessionID: string) {
    await redisConf.setex(`${sessionID}`, 86400, telegram); // сессия хранится 1 сутки
    const user = await User().findOne({ where: { telegram } });
    return user.lastCode;
  }

  static async resetLastCode(telegram: string) {
    const user = await User().findOne({ where: { telegram } });
    await User().update({ lastCode: '' }, { where: { id: user.id } });
  }

  static async checkUser(telegram: string) {
    const existingUser = await User().findOne({ where: { telegram } });

    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  static async getTelegramBySessionID(sessionID: string) {
    const telegram = await redisConf.get(sessionID);
    return telegram;
  }

  static async logout(sessionID: string) {
    await redisConf.del(sessionID);
  }
}

module.exports = {
  AuthRepository,
};
export {};
