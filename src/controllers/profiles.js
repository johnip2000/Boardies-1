const db = require('../config/database');
const runQuery = db.runQuery;
const bcrypt = require('bcryptjs');

function isEmpty(input) {
    if(input == "" || input == null || typeof(input) == 'undefined') {
        return true;
    }
    else {
        return false;
    }
}

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
                    var userID = user.recordset[0].userID;
                    runQuery('SELECT * FROM Addresses WHERE userID = \'' + userID + '\'', (address) => {
                        return res.render('profiles/address', {isLogin, isAdmin, userInfo: user.recordset[0], address: address.recordset});
                    })
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
                    res.render('profiles/addressForm', {isLogin, isAdmin, userInfo: user.recordset[0]});
                });
            }
        }
    }

    async getEditAddress(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    var userID = user.recordset[0].userID;
                    var addressID = req.query.addressID;
                    runQuery('SELECT * FROM Addresses WHERE userID = \'' + userID + '\' AND addressID = \'' + addressID + '\'', (address) => {
                        return res.render('profiles/editAddressForm', {isLogin, isAdmin, userInfo: user.recordset[0], address: address.recordset[0]});
                    })
                });
            }
        }
    }

    async AddAddress(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    let {userID, fullName, address1, address2, city, province, postalCode, country, phone} = req.body;
                    if(isEmpty(fullName) || isEmpty(address1) || isEmpty(city) || isEmpty(province) || isEmpty(postalCode)
                        || isEmpty(country) || isEmpty(phone)) {
                        if(isEmpty(fullName)) {
                            var errFullName = "Please enter valid name";
                        }
                        if(isEmpty(address1)) {
                            var errAddress = "Please enter valid address";
                        }
                        if(isEmpty(city)) {
                            var errCity = "Please enter your city";
                        }
                        if(isEmpty(postalCode)) {
                            var errPostalCode = "Please enter valid postal code";
                        }
                        if(isEmpty(phone)) {
                            var errPhone = "Please enter valid phone number";
                        }
                        var contextDict = {
                            isAdmin: isAdmin,
                            isLogin: isLogin,
                            userInfo: user.recordset[0],
                            errorFullName: errFullName,
                            errorAddress: errAddress,
                            errorCity: errCity,
                            errorPostalCode: errPostalCode,
                            errorPhone: errPhone
                        };
                        res.render('profiles/addressForm', contextDict);
                    }
                    else {
                        const sqlInsert = 'INSERT INTO Addresses VALUES(\'' + userID + '\', \
                                            \'' + fullName + '\', \
                                            \'' + address1 + '\', \
                                            \'' + address2 + '\', \
                                            \'' + city + '\', \
                                            \'' + province + '\', \
                                            \'' + postalCode + '\', \
                                            \'' + country + '\', \
                                            \'' + phone + '\')';
                        runQuery(sqlInsert, (result) => {
                            return res.redirect('/customer/address');
                        })
                    }
                });
            }
        }
    }

    async editAddress(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    let {userID, addressID, name, address1, address2, city, province, postalCode, country, phone} = req.body;
                    if(isEmpty(name) || isEmpty(address1) || isEmpty(city) || isEmpty(province) || isEmpty(postalCode)
                        || isEmpty(country) || isEmpty(phone)) {
                        if(isEmpty(name)) {
                            var errFullName = "Please enter valid name";
                        }
                        if(isEmpty(address1)) {
                            var errAddress = "Please enter valid address";
                        }
                        if(isEmpty(city)) {
                            var errCity = "Please enter your city";
                        }
                        if(isEmpty(postalCode)) {
                            var errPostalCode = "Please enter valid postal code";
                        }
                        if(isEmpty(phone)) {
                            var errPhone = "Please enter valid phone number";
                        }
                        var contextDict = {
                            isAdmin: isAdmin,
                            isLogin: isLogin,
                            userInfo: user.recordset[0],
                            errorFullName: errFullName,
                            errorAddress: errAddress,
                            errorCity: errCity,
                            errorPostalCode: errPostalCode,
                            errorPhone: errPhone
                        };
                        res.render('profiles/addressForm', contextDict);
                    }
                    else {
                        const sqlUpdate = 'UPDATE Addresses SET name =  \'' + name + '\', \
                                            address1 = \'' + address1 + '\', \
                                            address2 = \'' + address2 + '\', \
                                            city =  \'' + city + '\', \
                                            province = \'' + province + '\', \
                                            postalCode = \'' + postalCode + '\', \
                                            country =  \'' + country + '\', \
                                            phone = \'' + phone + '\' \
                                            WHERE addressID = \'' + addressID + '\' AND \
                                            userID = \'' + userID + '\'';
                        runQuery(sqlUpdate, (result) => {
                            return res.redirect('/customer/address');
                        })
                    }
                });
            }
        }
    }

    async deleteAddress(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    var userID = user.recordset[0].userID;
                    let {addressID} = req.query;
                    const sqlDelete = 'DELETE FROM Addresses WHERE addressID = \'' + addressID + '\' AND userID = \'' + userID + '\'';
                    runQuery(sqlDelete, (result) => {
                        return res.redirect('/customer/address');
                    })
                });
            }
        }
    }

    async getOrder(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    var userID = user.recordset[0].userID;
                    runQuery('SELECT * FROM Orders WHERE userID = \'' + userID + '\'', (orders) => {
                        return res.render('profiles/orders', {isLogin, isAdmin, userInfo: user.recordset[0], orders: orders.recordset});
                    })
                });
            }
        }
    }

    async OrderDetail(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    var userID = user.recordset[0].userID;
                    const sqlOrder = 'SELECT * FROM Orders o \
                                    JOIN Order_Details od ON od.orderID = o.orderID \
                                    JOIN Products p ON p.productID = od.productID \
                                    WHERE o.orderID = \'' + req.query.orderID + '\'';
                    const sqlAddress = 'SELECT * FROM Orders  \
                                        WHERE orderID = \'' + req.query.orderID + '\'';
                    runQuery(sqlOrder, (orders) => {
                        runQuery(sqlAddress, (order) => {
                            return res.render('profiles/orderDetail', {isLogin, isAdmin, userInfo: user.recordset[0], order: order.recordset[0], orders: orders.recordset});
                        })
                    })
                });
            }
        }
    }

    async GetChangePassword(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(isLogin == false) {
            return res.redirect('/errors');
        }
        else {
            if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                    isAdmin = user.recordset[0].isAdmin;
                    res.render('profiles/changepassword', {isLogin, isAdmin, userInfo: user.recordset[0]});
                });
            }
        }
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
                    let {userID, password, newPassword} = req.body;
                    if(password == "" || newPassword == "") {
                        if(password == "") {
                            var passwordError = "Please enter your current password."
                        }
                        if(newPassword == "") {
                            var newPasswordError = "Please enter your new password."
                        }
                        return res.render('profiles/changepassword', {isLogin, isAdmin, userInfo: user.recordset[0], passwordError, newPasswordError});
                    }
                    else {
                        if(bcrypt.compareSync(password, user.recordset[0].userPassword)) {
                            var passwordHash = bcrypt.hashSync(newPassword, 10);
                            const sqlUpdate = 'UPDATE Users SET userPassword = \'' + passwordHash + '\' WHERE userId = \'' + userID + '\' ';
                            runQuery(sqlUpdate, (result) => {
                                var updateMessage = "New password successfully saved.";
                                runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                                    return res.render('profiles/changepassword', {isLogin, isAdmin, userInfo: user.recordset[0], updateMessage});
                                })
                            })
                        }
                        else {
                            var updateError = "Current password is not match, please try again.";
                            return res.render('profiles/changepassword', {isLogin, isAdmin, userInfo: user.recordset[0], updateError});
                        }
                    }
                });
            }
        }
    }
}

module.exports =  ProfileController