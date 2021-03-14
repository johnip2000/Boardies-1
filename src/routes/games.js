var express = require('express');
var GamesController = require('../controllers/games');

const router = express.Router();
const gamesController = new GamesController();

router
    .get('/', gamesController.AllGame)
    .get('/Child', gamesController.ChildGame)
    .get('/Family', gamesController.FamilyGame)
    .get('/StrategyLight', gamesController.StrategyLGame)
    .get('/StrategyAdvanced', gamesController.StrategyAGame)
    .get('/Wargames', gamesController.WarGame)
    .get('/Adventures', gamesController.AdventuresGame)
    .get('/GameDetails', gamesController.Detail)

module.exports = router;