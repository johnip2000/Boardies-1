const db = require('../config/database');
const runQuery = db.runQuery;

class GamesController {
    async AllGame(req, res) {
        runQuery("SELECT * FROM Products", function(result) {
            return res.render('games/allGame', {listGame: result.recordset});
        });
    }

    async ChildGame(req, res) {
        runQuery("SELECT * FROM Products WHERE categoryID =1", function(result) {
            return res.render('games/childGame', {listGame: result.recordset});
        });       
    }

    async FamilyGame(req, res) {
        runQuery("SELECT * FROM Products WHERE categoryID =2", function(result) {
            return res.render('games/familyGame', {listGame: result.recordset});
        });    
    }

    async StrategyLGame(req, res) {
        runQuery("SELECT * FROM Products WHERE categoryID =3", function(result) {
            return res.render('games/strategylGame', {listGame: result.recordset});
        });    
    }

    async StrategyAGame(req, res) {
        runQuery("SELECT * FROM Products WHERE categoryID =4", function(result) {
            return res.render('games/strategyaGame', {listGame: result.recordset});
        });   
    }

    async WarGame(req, res) {
        runQuery("SELECT * FROM Products WHERE categoryID =5", function(result) {
            return res.render('games/warGame', {listGame: result.recordset});
        });   
    }

    async AdventuresGame(req, res) {
        runQuery("SELECT * FROM Products WHERE categoryID =6", function(result) {
            return res.render('games/adventuresGame', {listGame: result.recordset});
        });      
    }

    async Detail(req, res) {
        var productid = req.param('productID');
        runQuery("SELECT * FROM Products WHERE productID =" + productid, function(result) {
            return res.render('games/gameDetails', {listGame: result.recordset});
        });           
    }
}

module.exports =  GamesController