var express = require('express');
var UserController = require('../controllers/users');

const router = express.Router();
const userController = new UserController();

router
    .post('/sign-in', userController.Login)
    .post('/sign-up', userController.SignUp)

module.exports = router;