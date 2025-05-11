const { LikesDAO } = require('./likes.DAO');
const { ErrorHandler } = require('../consts');
import { Response, Request } from 'express';

class LikesCotroller {
  async postLike(req: Request, res: Response): Promise<void> {
    const postID = req.params.post_id;
    const { userID } = req.body;

    try {
      await LikesDAO.postLike(Number(postID), Number(userID));
      res.sendStatus(200);
    } catch (e) {
      ErrorHandler.handle(res, e);
    }
  }

  async deleteLike(req: Request, res: Response): Promise<void> {
    const postID = req.params.post_id;
    const { userID } = req.body;

    try {
      await LikesDAO.deleteLike(Number(postID), Number(userID));
      res.sendStatus(200);
    } catch (error) {
      ErrorHandler.handle(res, error);
    }
  }
}

module.exports = new LikesCotroller();
export {};
