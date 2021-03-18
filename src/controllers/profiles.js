const db = require('../config/database');
const runQuery = db.runQuery;

class ProfileController {
    async getProfile(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    res.render('profiles/index', {isLogin, isAdmin, userInfo: user.recordset[0]});
                }); 
            }
        }
    }

    async getAddress(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    res.render('profiles/address', {isLogin, isAdmin});
                }); 
            }
        }
    }

    async getAddressForm(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    res.render('profiles/addressForm', {isLogin, isAdmin});
                }); 
            }        
        }
    }

    async getOrder(req, res) {

    }

    async ChangePassword(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                }); 
                res.render('profiles/changepassword', {isLogin, isAdmin});
            }  
        }
    }
}

module.exports =  ProfileController