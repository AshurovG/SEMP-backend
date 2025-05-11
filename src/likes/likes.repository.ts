const Likes = require('../../models/like');

class LikesRepository {
  static async postLike(postID: number, userID: number) {
    try {
      const newLike = await Likes().build({
        userID,
        postID,
        publicationTime: new Date().toISOString(),
      });

      await newLike.save();
    } catch (e) {
      throw e;
    }
  }

  static async deleteLike(postID: number, userID: number) {
    try {
      await Likes().destroy({ where: { postID, userID } });
    } catch (e) {
      throw e;
    }
  }
}

module.exports = {
  LikesRepository,
};
export {};
