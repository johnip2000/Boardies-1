const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../config/database');
var runQuery = db.runQuery;

class UserController {
    async Login(req, res) {
        let {email, password} = req.body;
        if(email == "" || password == "") {
            return res.render('pages/login', {
                signInError: "Field cannot be empty, please enter email and password",
                isAdmin: false,
                isLogin: false
            });
        }
        else {
            runQuery('SELECT * FROM Users WHERE email = \'' + email + '\'', function(user){
                if(user.recordset.length > 0) {
                    if(user.recordset && bcrypt.compareSync(password, user.recordset[0].userPassword)) {
                        req.session.loggedin = true;
                        req.session.username = email;
                        runQuery("SELECT TOP(10) * FROM Products", function(result) {
                            runQuery("SELECT * FROM Categories", function(listCategories) {
                                var contextDict = {
                                    currentUrl: '/',
                                    title: 'Home',
                                    Categories: listCategories.recordset,
                                    listGame: result.recordset,
                                    isAdmin: user.recordset[0].isAdmin,
                                    isLogin: true
                                };
                                return res.render('pages/homepage', contextDict);
                            });
                        });            
                    }
                }
                else {
                    return res.render('pages/login', {
                        signInError: "Wrong username or password",
                        isAdmin: false,
                        isLogin: false
                    });  
                }
            })
        }
    }

    async SignUp(req, res) {
        let {firstname, lastname, emailNew, passwordNew} = req.body;
        if(firstname == "" || lastname == "" || emailNew == "" || passwordNew == "") {
            return res.render('pages/login', {
                signUpError: "Field cannot be empty. please try again",
                isAdmin: false,
                isLogin: false
            });
        }
        else {
            runQuery('SELECT * FROM Users WHERE email = \'' + emailNew + '\'', function(user) {
            if(user.recordset.length == 1) {
                return res.render('pages/login', {
                    signUpError: "This email has already used. Please try another email.",
                    isAdmin: false,
                    isLogin: false
                });
            }
            else {
                const userID = Math.random().toString(36).substr(2, 9);
                var fullName = firstname + ', ' + lastname;
                var passwordHash = bcrypt.hashSync(passwordNew, 10);
                var insertQuery = 'INSERT INTO Users(userID, fullName, email, userName, userPassword, isAdmin)\
                                    VALUES(\'' + userID + '\', \
                                    \'' + fullName + '\', \
                                    \'' + emailNew + '\', \
                                    \'' + emailNew + '\', \
                                    \'' + passwordHash + '\', \
                                    \'' + false + '\')';
                runQuery(insertQuery, (result) => {
                    req.session.loggedin = true;
                    req.session.username = emailNew;
                    runQuery("SELECT TOP(10) * FROM Products", function(result) {
                        runQuery("SELECT * FROM Categories", function(listCategories) {
                            var contextDict = {
                                currentUrl: '/',
                                title: 'Home',
                                Categories: listCategories.recordset,
                                listGame: result.recordset,
                                isAdmin: false,
                                isLogin: true
                            };
                            return res.render('pages/homepage', contextDict);
                        });
                    });       
                })
            }
            
            });
        }
    }

    async Logout(req, res) {
        req.session.loggedin = false;
        delete req.session.username;
            return res.redirect('/');
    }
}

module.exports =  UserController