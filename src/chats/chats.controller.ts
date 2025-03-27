const { ChatsDAO } = require('./chats.DAO');
const { ErrorHandler } = require('../consts');
import { Response, Request } from 'express';

class ChatsController {
  async getChats(_: Request, res: Response): Promise<void> {
    try {
      const data = await ChatsDAO.getChats();
      res.json(data);
    } catch (e) {
      ErrorHandler.handle(res, e);
    }
  }

  async getChatById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const data = await ChatsDAO.getChatById(Number(id));
      res.json(data);
    } catch (error) {
      ErrorHandler.handle(res, error);
    }
  }

  async postChat(req: Request, res: Response): Promise<void> {
    const { title, description } = req.body;
    const image = req.file;

    try {
      await ChatsDAO.postChat(title, description, image);
      res.sendStatus(200);
    } catch (error) {
      ErrorHandler.handle(res, error);
    }
  }

  async updateChat(req: Request, res: Response): Promise<void> {
    const { title, description } = req.body;
    const { id } = req.params;

    try {
      await ChatsDAO.updateChat(Number(id), title, description);
      res.sendStatus(200);
    } catch (error) {
      ErrorHandler.handle(res, error);
    }
  }

  async deleteChat(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await ChatsDAO.deleteChat(Number(id));
      res.sendStatus(200);
    } catch (error) {
      ErrorHandler.handle(res, error);
    }
  }

  async addUsersToChat(req: Request, res: Response): Promise<void> {
    const { users } = req.body;
    const { id } = req.params;

    try {
      await ChatsDAO.addUsersToChat(Number(id), users);
      res.sendStatus(200);
    } catch (error) {
      ErrorHandler.handle(res, error);
    }
  }

  async deleteUsersFromChat(req: Request, res: Response): Promise<void> {
    const { users } = req.body;
    const { id } = req.params;

    try {
      await ChatsDAO.deleteUsersFromChat(Number(id), users);
      res.sendStatus(200);
    } catch (error) {
      ErrorHandler.handle(res, error);
    }
  }
}

module.exports = new ChatsController();
export {};
