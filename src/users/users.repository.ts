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
    id: number,
    firstname?: string,
    lastname?: string,
    department?: string,
    position?: string,
    whatsapp?: string,
    phoneNumber?: string,
    birthDate?: string,
    isAdmin?: boolean,
    image?: any
  ) {
    try {
      const updateData: any = {};

      // Добавляем поля только если они переданы (не undefined)
      if (firstname !== undefined) updateData.firstname = firstname;
      if (lastname !== undefined) updateData.lastname = lastname;
      if (department !== undefined) updateData.department = department;
      if (position !== undefined) updateData.position = position;
      if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (birthDate !== undefined) updateData.birthDate = birthDate;
      if (isAdmin !== undefined) updateData.isAdmin = isAdmin;

      if (image) {
        await minioClient.putObject(
          'semp',
          `users/${image.originalname}`,
          image.buffer
        );
        updateData.avatar = `http://localhost:9000/semp/users/${image.originalname}`;
      }

      console.log('image', image);
      await User().update(updateData, { where: { id } });
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
}

module.exports = {
  UsersRepository,
};
