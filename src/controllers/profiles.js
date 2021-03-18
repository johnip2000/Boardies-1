const db = require('../config/database');
const runQuery = db.runQuery;
const bcrypt = require('bcryptjs');

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

    async UpdateProfile(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    let {userID, fullName, phoneNumber, password} = req.body;
                    if(password == "" || password == null) {
                        var passwordError = "Please enter your current password";
                        return res.render('profiles/index', {isLogin, isAdmin, userInfo: user.recordset[0], passwordError});
                    }
                    else {
                        if(bcrypt.compareSync(password, user.recordset[0].userPassword)) {
                            const sqlUpdate = 'UPDATE Users SET fullName = \'' + fullName + '\', phone = \'' + phoneNumber + '\' WHERE \
                            userId = \'' + userID + '\' ';
                            runQuery(sqlUpdate, function(result) {
                                var successUpdate = "New information successfully saved.";
                                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) { 
                                    return res.render('profiles/index', {isLogin, isAdmin, userInfo: user.recordset[0], successUpdate});
                                })
                                
                            })
                        }
                        else {
                            var passwordError = "Current password is not match, please try again.";
                            return res.render('profiles/index', {isLogin, isAdmin, userInfo: user.recordset[0], passwordError});
                        }
                    }    
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