const { UsersDAO } = require('./users.DAO');
const { ErrorHandler } = require('../consts');
import { Response, Request } from 'express';

class UsersCotroller {
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const data = await UsersDAO.getUsers();
      res.json(data);
    } catch (e) {
      ErrorHandler.handle(res, e);
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const data = await UsersDAO.getUser(id);
      res.json(data);
    } catch (e) {
      ErrorHandler.handle(res, e);
    }
  }

  async postUser(req: Request, res: Response): Promise<void> {
    const {
      firstname,
      lastname,
      department,
      position,
      telegram,
      whatsapp,
      phoneNumber,
      birthDate,
      isAdmin,
    } = req.body;
    try {
      await UsersDAO.postUser(
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
      res.sendStatus(200);
    } catch (e) {
      ErrorHandler.handle(res, e);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const {
      firstname,
      lastname,
      department,
      position,
      whatsapp,
      phoneNumber,
      birthDate,
      isAdmin,
    } = req.body;
    const image = req.file;
    console.log('req file', image);
    const sessionID = (req.cookies['sessionID'] = req.cookies['sessionID']);
    const { id } = req.params;

    try {
      await UsersDAO.updateUser(
        id,
        firstname,
        lastname,
        department,
        position,
        whatsapp,
        phoneNumber,
        birthDate,
        isAdmin,
        sessionID,
        image
      );
      res.sendStatus(200);
    } catch (e) {
      ErrorHandler.handle(res, e);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const { sessionID } = req.cookies;
    const { id } = req.params;

    try {
      await UsersDAO.deleteUser(id, sessionID);
      res.sendStatus(200);
    } catch (e) {
      ErrorHandler.handle(res, e);
    }
  }
}

module.exports = new UsersCotroller();
export {};
