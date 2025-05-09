const { dbConf, redisConf, handleRedisOperation } = require('../../db');
const User = require('../../models/user');
const { AuthRepository } = require('../auth/auth.repository');
const { Sequelize, DataTypes } = require('sequelize');
const { minioClient } = require('../../db');
import _ from 'lodash';

class UsersRepository {
  static async getUsers() {
    try {
      const users = await User().findAll();
      return users;
    } catch (e) {
      throw e;
    }
  }

  static async getUser(id: number) {
    try {
      const userInstance = await User().findOne({ where: { id } });
      if (!userInstance) {
        return null;
      }
      const userData = userInstance.toJSON();
      delete userData.lastCode;
      return userData;
    } catch (e) {
      throw e;
    }
  }

  static async getUserBySessionID(sessionID: string) {
    try {
      const telegram = await AuthRepository.getTelegramBySessionID(sessionID);
      if (telegram) {
        const user = await User().findOne({ where: { telegram } });
        return user.toJSON();
      } else {
        return null;
      }
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
      const newUser = await User().build({
        firstname,
        lastname,
        department,
        position,
        telegram,
        whatsapp,
        phoneNumber,
        birthDate,
        isAdmin,
      });
      await newUser.save();
    } catch (e) {
      throw e;
    }
  }

  static async updateUser(
    // id: number,
    // firstname?: string,
    // lastname?: string,
    // department?: string,
    // position?: string,
    // whatsapp?: string,
    // phoneNumber?: string,
    // birthDate?: string,
    // isAdmin?: boolean,
    // status?: string,
    // image?: any
    user: any
  ) {
    try {
      const updateData: any = {};

      // Добавляем поля только если они переданы (не undefined)
      if (user.firstname !== undefined) updateData.firstname = user.firstname;
      if (user.lastname !== undefined) updateData.lastname = user.lastname;
      if (user.department !== undefined)
        updateData.department = user.department;
      if (user.position !== undefined) updateData.position = user.position;
      if (user.whatsapp !== undefined) updateData.whatsapp = user.whatsapp;
      if (user.phoneNumber !== undefined)
        updateData.phoneNumber = user.phoneNumber;
      if (user.birthDate !== undefined) updateData.birthDate = user.birthDate;
      if (user.status !== undefined) updateData.status = user.status;
      if (user.isAdmin !== undefined) updateData.isAdmin = user.isAdmin;

      if (user.image) {
        await minioClient.putObject(
          'semp',
          `users/${user.image.originalname}`,
          user.image.buffer
        );
        updateData.avatar = `http://localhost:9000/semp/users/${user.image.originalname}`;
      }

      console.log('image', user.image);
      await User().update(updateData, { where: { id: user.id } });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async deleteUser(id: number) {
    try {
      await User().destroy({ where: { id } });
    } catch (e) {
      throw e;
    }
  }

  static async getAdmins() {
    try {
      const admins = await User().findAll({
        where: { isAdmin: true },
      });

      return admins;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = {
  UsersRepository,
};
