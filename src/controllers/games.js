const { sql, poolPromise } = require('../config/database')

class GamesController {
    async AllGame(req, res) {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Products");
        return res.render('games/allGame', {listGame: result.recordset});
    }

    async ChildGame(req, res) {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Products WHERE categoryID =1");
        return res.render('games/childGame', {listGame: result.recordset});
    }

    async FamilyGame(req, res) {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Products WHERE categoryID =2");
        return res.render('games/familyGame', {listGame: result.recordset});
    }

    async StrategyLGame(req, res) {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Products WHERE categoryID =3");
        return res.render('games/strategylGame', {listGame: result.recordset});
    }

    async StrategyAGame(req, res) {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Products WHERE categoryID =4");
        return res.render('games/strategyaGame', {listGame: result.recordset});
    }

    async WarGame(req, res) {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Products WHERE categoryID =5");
        return res.render('games/warGame', {listGame: result.recordset});
    }

    async AdventuresGame(req, res) {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Products WHERE categoryID =6");
        return res.render('games/adventuresGame', {listGame: result.recordset});
    }

    async Detail(req, res) {
        var productid = req.param('productID');
        //console.log(productid);
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Products WHERE productID =" + productid);
        return res.render('games/gameDetails', {listGame: result.recordset});
    }
}

module.exports =  GamesController