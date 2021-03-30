const db = require('../config/database');
const runQuery = db.runQuery;

class CheckoutController {
    async Addresses(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin) {
                    return res.render('checkout/addresses', {isLogin, isAdmin});
                }
                else {
                    return res.render('pages/errors');
                }
            }); 
        } 
    }

    async ShippingAndPayment(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin) {
                    return res.render('checkout/shipping', {isLogin, isAdmin});
                }
                else {
                    return res.render('pages/errors');
                }
            }); 
        } 
    }

    async PlaceOrder(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin) {
                    return res.render('checkout/confirmation', {isLogin, isAdmin});
                }
                else {
                    return res.render('pages/errors');
                }
            }); 
        } 
    }
}

module.exports =  CheckoutController