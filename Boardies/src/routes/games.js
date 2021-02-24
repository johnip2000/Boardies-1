var express = require('express');
var GamesController = require('../controllers/games');

const router = express.Router();
const gamesController = new GamesController();

router
    .get('/', gamesController.AllGame)

module.exports = router;