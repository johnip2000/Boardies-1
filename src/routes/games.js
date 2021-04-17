var express = require('express');
var GamesController = require('../controllers/games');

const router = express.Router();
const gamesController = new GamesController();

router
    .get('/', gamesController.AllGame)
    .get('/Child', gamesController.ChildGame)
    .get('/Family', gamesController.FamilyGame)
    .get('/Strategy%20Light', gamesController.StrategyLGame)
    .get('/Strategy%20Advanced', gamesController.StrategyAGame)
    .get('/Wargames', gamesController.WarGame)
    .get('/Adventures', gamesController.AdventuresGame)
    .get('/GameDetails', gamesController.Detail)

module.exports = router;