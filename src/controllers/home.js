
const MailMessage = require('nodemailer/lib/mailer/mail-message');
const db = require('../config/database');
const runQuery = db.runQuery;
const mail= require('../mail');

class HomeController {
    async Index(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        runQuery('SELECT TOP(10) * FROM Products', function(result) {
            runQuery('SELECT * FROM Categories', function(listCategories) {
                var contextDict = {
                    currentUrl: '/',
                    title: 'Home',
                    
                    Categories: listCategories.recordset,
                    listGame: result.recordset,
                    isLogin: isLogin,
                    isAdmin: isAdmin
                };
               
                return res.render('pages/homepage', contextDict);
            });
        });
    }
    async AboutUs(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        return res.render('pages/about-us',{isLogin, isAdmin});
    }
    async ContactUs(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        return res.render('pages/contact-us',{isLogin, isAdmin});
    }
    async FAQ(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        return res.render('pages/faq',{isLogin, isAdmin});
    }
    async Login(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        let isAdmin = false;
        if(typeof req.session.username != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin =  user.recordset[0].isAdmin;
            }); 
        }
        return res.render('pages/login', {isLogin, isAdmin});
    }
    async ShippingInfo(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        return res.render('pages/shipping-info',{isLogin, isAdmin});
    }

    async SearchProduct(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        const sqlQuery = 'SELECT * FROM Products WHERE productName LIKE \'%' + req.query.keyword + '%\'';
        runQuery(sqlQuery, (result) => {
            return res.render('games/gameSearch',{isLogin, isAdmin, listGame: result.recordset});
        })
    }

    async Error(req, res) {
        return res.render('pages/errors');
    }

    async Cart(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
            }); 
        }
        
        return res.render('pages/cart', {isLogin, isAdmin});
    }
}

module.exports =  HomeController