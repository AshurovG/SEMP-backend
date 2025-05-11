const Post = require('../../models/post');
const Comment = require('../../models/comment');
const Like = require('../../models/like');
const User = require('../../models/user');
const PostData = require('./types');
const CommentData = require('./types');
const { minioClient } = require('../../db');

class PostsRepository {
  static async getPosts() {
    try {
      const posts = await Post().findAll();
      const postsWithComments = await Promise.all(
        posts.map(async (post: typeof PostData) => {
          const comments = await Comment().findAll({
            where: { postID: post.id },
          });

          const commentsWithUsers = await Promise.all(
            comments.map(async (comment: typeof CommentData) => {
              const user = await User().findByPk(comment.userID);
              return {
                ...comment.toJSON(),
                user: {
                  firstname: user.firstname,
                  lastname: user.lastname,
                },
              };
            })
          );

          const likes = await Like().findAll({
            where: { postID: post.id },
          });

          const LikesWithUsers = await Promise.all(
            likes.map(async (like: any) => {
              const user = await User().findByPk(like.userID);
              return {
                ...like.toJSON(),
                user: {
                  firstname: user.firstname,
                  lastname: user.lastname,
                  avatar: user.avatar,
                },
              };
            })
          );

          return {
            ...post.toJSON(),
            comments: commentsWithUsers,
            likes: LikesWithUsers,
          };
        })
      );

      return postsWithComments;
    } catch (e) {
      throw e;
    }
  }

  static async getPost(id: number) {
    try {
      const post = await Post().findByPk(id);
      return post;
    } catch (e) {
      throw e;
    }
  }

  static async postPost(text: string, image: any, publicationDate: Date) {
    try {
      if (image) {
        await minioClient.putObject(
          'semp',
          `posts/${image.originalname}`,
          image.buffer
        );
      }

      const newPost = await Post().build({
        text,
        ...(image && {
          image: `http://localhost:9000/semp/posts/${image.originalname}`,
        }),
        publicationDate,
      });

      await newPost.save();
    } catch (e) {
      throw e;
    }
  }

  static async updatePost(text: string, image: string, id: number) {
    try {
      const postToUpdate = await Post().findByPk(id);
      // if (!postToUpdate) {
      //   throw new Error("Post not found");
      // }
      postToUpdate.text = text;
      postToUpdate.image = image;
      await postToUpdate.save();
    } catch (e) {
      throw e;
    }
  }

  static async deletePost(id: number) {
    try {
      await Post().destroy({ where: { id } });
    } catch (e) {
      throw e;
    }
  }
}

module.exports = {
  PostsRepository,
};
export {};
