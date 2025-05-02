const Router = require('express');
const router = new Router();
const usersController = require('./users.controller');
import multer from 'multer';

const upload = multer();

router.get('/users', usersController.getUsers);
router.get('/users/:id', usersController.getUser);
router.post('/users', usersController.postUser);
router.put('/users/:id', upload.single('image'), usersController.updateUser);
router.delete('/users/:id', usersController.deleteUser);

module.exports = router;
export {};
