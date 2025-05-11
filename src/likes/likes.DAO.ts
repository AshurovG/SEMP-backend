const { LikesRepository } = require('./likes.repository');
const { PostsDAO } = require('../posts/posts.DAO');
const { CustomError } = require('../consts');

class LikesDAO {
  static _ifOneFromFieldsEmpty(userID: number, text: string) {
    if (!userID || !text) {
      throw new CustomError('userID, postID, text - required fields', 400);
    }
  }

  static async postLike(postID: number, userID: number) {
    try {
      await PostsDAO._isPostExist(postID);
      await LikesRepository.postLike(postID, userID);
    } catch (e) {
      throw e;
    }
  }

  static async deleteLike(postID: number, userID: number) {
    try {
      await PostsDAO._isPostExist(postID);
      await LikesRepository.deleteLike(postID, userID);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = {
  LikesDAO,
};
export {};
