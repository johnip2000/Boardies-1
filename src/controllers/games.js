const { sql, poolPromise } = require('../config/database')

class GamesController {
    async AllGame(req, res) {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Products");
        return res.render('games/allGame', {listGame: result.recordset});
    }
}

module.exports =  GamesController