const db = require('../config/database');
const runQuery = db.runQuery;

class GamesController {
    async AllGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        runQuery('SELECT * FROM Products', function(result) {
            return res.render('games/allGame', {listGame: result.recordset, isLogin, isAdmin, Title: "ALL GAMES"});
        });
    }

    async ChildGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        runQuery('SELECT * FROM Products WHERE categoryID =1', function(result) {
            return res.render('games/allGame', {listGame: result.recordset, isLogin, isAdmin, Title: "ALL CHILD GAMES"});
        });
    }

    async FamilyGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        runQuery('SELECT * FROM Products WHERE categoryID =2', function(result) {
            return res.render('games/allGame', {listGame: result.recordset, isLogin, isAdmin, Title: "ALL FAMILY GAMES"});
        });
    }

    async StrategyLGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        runQuery('SELECT * FROM Products WHERE categoryID =3', function(result) {
            return res.render('games/allGame', {listGame: result.recordset, isLogin, isAdmin, Title: "ALL STRATEGY LIGHT GAMES"});
        });
    }

    async StrategyAGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        runQuery('SELECT * FROM Products WHERE categoryID =4', function(result) {
            return res.render('games/allGame', {listGame: result.recordset, isLogin, isAdmin, Title: "ALL STRATEGY ADVANCED GAMES"});
        });
    }

    async WarGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        runQuery('SELECT * FROM Products WHERE categoryID =5', function(result) {
            return res.render('games/allGame', {listGame: result.recordset, isLogin, isAdmin, Title: "ALL WAR GAMES"});
        });
    }

    async AdventuresGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        runQuery('SELECT * FROM Products WHERE categoryID =6', function(result) {
            return res.render('games/allGame', {listGame: result.recordset, isLogin, isAdmin, Title: "ALL ADVENTURES GAMES"});
        });
    }

    async Detail(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            var email = req.session.username;
            runQuery("SELECT * FROM Users WHERE email = \'' + email + '\'", function(user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        var productid = req.query.productID;
        runQuery("SELECT * FROM Products p JOIN Categories c ON p.categoryID = c.categoryID WHERE productID =" + productid, function(result) {
            return res.render('games/gameDetails', {product: result.recordset[0], isLogin, isAdmin});
        });
    }
}

module.exports =  GamesController