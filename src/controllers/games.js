const db = require('../config/database');
const runQuery = db.runQuery;

class GamesController {
    async AllGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            var email = req.session.username;
            runQuery("SELECT * FROM Users WHERE email = \'' + email + '\'", function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        runQuery("SELECT * FROM Products", function(result) {
            return res.render('games/allGame', {listGame: result.recordset, isLogin, isAdmin});
        });
    }

    async ChildGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            var email = req.session.username;
            runQuery("SELECT * FROM Users WHERE email = \'' + email + '\'", function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        runQuery("SELECT * FROM Products WHERE categoryID =1", function(result) {
            return res.render('games/childGame', {listGame: result.recordset, isLogin, isAdmin});
        });       
    }

    async FamilyGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            var email = req.session.username;
            runQuery("SELECT * FROM Users WHERE email = \'' + email + '\'", function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        runQuery("SELECT * FROM Products WHERE categoryID =2", function(result) {
            return res.render('games/familyGame', {listGame: result.recordset, isLogin, isAdmin});
        });    
    }

    async StrategyLGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            var email = req.session.username;
            runQuery("SELECT * FROM Users WHERE email = \'' + email + '\'", function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        runQuery("SELECT * FROM Products WHERE categoryID =3", function(result) {
            return res.render('games/strategylGame', {listGame: result.recordset, isLogin, isAdmin});
        });    
    }

    async StrategyAGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            var email = req.session.username;
            runQuery("SELECT * FROM Users WHERE email = \'' + email + '\'", function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        runQuery("SELECT * FROM Products WHERE categoryID =4", function(result) {
            return res.render('games/strategyaGame', {listGame: result.recordset, isLogin, isAdmin});
        });   
    }

    async WarGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            var email = req.session.username;
            runQuery("SELECT * FROM Users WHERE email = \'' + email + '\'", function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        runQuery("SELECT * FROM Products WHERE categoryID =5", function(result) {
            return res.render('games/warGame', {listGame: result.recordset, isLogin, isAdmin});
        });   
    }

    async AdventuresGame(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            var email = req.session.username;
            runQuery("SELECT * FROM Users WHERE email = \'' + email + '\'", function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        runQuery("SELECT * FROM Products WHERE categoryID =6", function(result) {
            return res.render('games/adventuresGame', {listGame: result.recordset}, isLogin, isAdmin);
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
        var productid = req.param('productID');
        runQuery("SELECT * FROM Products WHERE productID =" + productid, function(result) {
            return res.render('games/gameDetails', {listGame: result.recordset, isLogin, isAdmin});
        });           
    }
}

module.exports =  GamesController