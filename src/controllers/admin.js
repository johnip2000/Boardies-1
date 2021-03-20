const db = require('../config/database');
const runQuery = db.runQuery;

class AdminController {
    async Index(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    return res.render('admin/index', {isLogin, isAdmin});
                }
                else {
                    return res.render('pages/errors');
                }
            }); 
        } 
    }

    async Products(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    runQuery('SELECT * FROM Products', (products) => {
                        return res.render('admin/products', {products: products.recordset});
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            }); 
        }    
    }

    async Customers(req, res) {

    }

    async Orders(req, res) {

    }
}

module.exports =  AdminController