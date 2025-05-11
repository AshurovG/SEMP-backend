const Router = require('express');
const router = new Router();
const likesCotroller = require('./likes.controller');

router.post('/likes/:post_id', likesCotroller.postLike);
router.delete('/likes/:post_id', likesCotroller.deleteLike);

module.exports = router;
export {};
