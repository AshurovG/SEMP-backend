const Router = require('express');
const router = new Router();
const chatsController = require('./chats.controller');
import multer from 'multer';

const upload = multer();

router.get('/chats', chatsController.getChats);
router.get('/chats/:id', chatsController.getChatById);
router.post('/chats', upload.single('image'), chatsController.postChat);
router.put('/chats/:id', chatsController.updateChat); // TODO: Сделать частичное изменение полей
router.delete('/chats/:id', chatsController.deleteChat);
router.get('/chats/members/not/:id', chatsController.getUsersNotFromChat);
router.post('/chats/members/:id', chatsController.addUsersToChat);
router.delete('/chats/members/:id', chatsController.deleteUsersFromChat);

module.exports = router;
export {};
