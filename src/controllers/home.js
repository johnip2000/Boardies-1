const MailMessage = require('nodemailer/lib/mailer/mail-message');
const db = require('../config/database');
const runQuery = db.runQuery;
const mail = require('../mail');
const guid = require('guid');

class HomeController {
    async Index(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        runQuery('SELECT TOP(10) * FROM Products', function (result) {
            runQuery('SELECT * FROM Categories', function (listCategories) {
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
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        return res.render('pages/about-us', {isLogin, isAdmin});
    }

    async ContactUs(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        return res.render('pages/contact-us', {isLogin, isAdmin});
    }

    async FAQ(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        return res.render('pages/faq', {isLogin, isAdmin});
    }

    async Login(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        let isAdmin = false;
        if (typeof req.session.username != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        return res.render('pages/login', {isLogin, isAdmin});
    }

    async ShippingInfo(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        return res.render('pages/shipping-info', {isLogin, isAdmin});
    }

    async SearchProduct(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        const sqlQuery = 'SELECT * FROM Products WHERE productName LIKE \'%' + req.query.keyword + '%\'';
        runQuery(sqlQuery, (result) => {
            return res.render('games/gameSearch', {isLogin, isAdmin, listGame: result.recordset});
        })
    }

    async Error(req, res) {
        return res.render('pages/errors');
    }

    async Cart(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        if (isLogin == false) {
            return res.redirect('/login');
        } else {

            //console.log(isLogin);
            //console.log(req.session.username);
            //console.log(req.query.productID);
            var productbb = req.query.productID;
            var TotalPrice = 0;
            //console.log(productbb);
            if (productbb != null) {
                runQuery('SELECT * FROM Products p INNER JOIN Categories c ON p.categoryID = c.categoryID WHERE productID = \'' + productbb + '\'', function (result) {
                    var insertcartproductpic = result.recordset[0].productImage;
                    var insertcartproductprice = result.recordset[0].productPrice;
                    var insertcartproduct = result.recordset[0].productName;
                    var insertcartprodcat = result.recordset[0].categoryName;

                    //console.log(insertcartproductpic);


                    var insertquery = "INSERT INTO Cart(ProductID,ProductName, Price, CartProductImage, ProductCate, CartProductQuantity, UserEmail) VALUES ('" + productbb + "', '" + insertcartproduct + "', '" + insertcartproductprice + "', '" + insertcartproductpic + "', '" + insertcartprodcat + "', 1 , '" + req.session.username + "')";

                    runQuery(insertquery, function (result) {
                        runQuery('SELECT * FROM Cart WHERE UserEmail = \'' + req.session.username + '\'', function (result) {
                            for (var i = 0; i < result.recordset.length; i++) {
                                //console.log(result.recordset[i].Price);
                                TotalPrice = TotalPrice + result.recordset[i].Price * result.recordset[i].CartProductQuantity;
                            }
                            //console.log(TotalPrice);
                            return res.render('pages/cart', {
                                Warning: null,
                                listCart: result.recordset,
                                isLogin,
                                isAdmin,
                                Subtotal: TotalPrice
                            });
                        });
                    });
                });
            } else {
                runQuery('SELECT * FROM Cart WHERE UserEmail = \'' + req.session.username + '\'', function (result) {
                    for (var i = 0; i < result.recordset.length; i++) {
                        //console.log(result.recordset[i].Price);
                        TotalPrice = TotalPrice + result.recordset[i].Price * result.recordset[i].CartProductQuantity;
                    }
                    //console.log(TotalPrice);
                    return res.render('pages/cart', {
                        Warning: null,
                        listCart: result.recordset,
                        isLogin,
                        isAdmin,
                        Subtotal: TotalPrice
                    });
                });
            }
        }
    }

    async Remove(req, res) {

        var RemoveProduct = req.query.CartID;
        //console.log(RemoveProduct);
        runQuery('DELETE FROM Cart WHERE CartID =  \'' + RemoveProduct + '\'', function (result) {
            return res.redirect('/cart');
        });
    }

    async AddtoCart(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        if (isLogin == false) {
            return res.redirect('/login');
        } else {
            var productbb = req.body.buyitem;
            var TotalPrice = 0;
            var duplicate = false;
            var duplicateID = 0;
            //console.log(productbb);

            if (productbb != null) {
                runQuery('SELECT * FROM Products p INNER JOIN Categories c ON p.categoryID = c.categoryID WHERE productID = \'' + productbb + '\'', function (result) {
                    var insertcartproductpic = result.recordset[0].productImage;
                    var insertcartproductprice = result.recordset[0].productPrice;
                    var insertcartproduct = result.recordset[0].productName;
                    var insertcartprodcat = result.recordset[0].categoryName;

                    //console.log(insertcartproductpic);

                    runQuery('SELECT * FROM Cart WHERE UserEmail = \'' + req.session.username + '\'', function (result) {
                        for (var i = 0; i < result.recordset.length; i++) {
                            //console.log(result.recordset[i].Price);
                            if (result.recordset[i].ProductID == productbb) {
                                duplicate = true;
                                duplicateID=result.recordset[i].CartID
                                //console.log(result.recordset[i].CartID);
                            }
                        }
                        //console.log(duplicate);

                        if (duplicate != true) {
                            var insertquery = "INSERT INTO Cart(ProductID,ProductName, Price, CartProductImage, ProductCate, CartProductQuantity, UserEmail) VALUES ('" + productbb + "', '" + insertcartproduct + "', '" + insertcartproductprice + "', '" + insertcartproductpic + "', '" + insertcartprodcat + "', 1 , '" + req.session.username + "')";

                            runQuery(insertquery, function (result) {
                                runQuery('SELECT * FROM Cart WHERE UserEmail = \'' + req.session.username + '\'', function (result) {
                                    for (var i = 0; i < result.recordset.length; i++) {
                                        //console.log(result.recordset[i].Price);
                                        TotalPrice = TotalPrice + result.recordset[i].Price * result.recordset[i].CartProductQuantity;
                                    }
                                    //console.log(TotalPrice);
                                    return res.render('pages/cart', {
                                        Warning: null,
                                        listCart: result.recordset,
                                        isLogin,
                                        isAdmin,
                                        Subtotal: TotalPrice
                                    });
                                });
                            });
                        }else {
                            //var insertquery = "INSERT INTO Cart(ProductID,ProductName, Price, CartProductImage, ProductCate, CartProductQuantity, UserEmail) VALUES ('" + productbb + "', '" + insertcartproduct + "', '" + insertcartproductprice + "', '" + insertcartproductpic + "', '" + insertcartprodcat + "', 1 , '" + req.session.username + "')";
                            var updatequery = 'UPDATE Cart SET CartProductQuantity = CartProductQuantity + 1 WHERE CartID = \'' + duplicateID + '\'';

                            runQuery(updatequery, function (result) {
                                runQuery('SELECT * FROM Cart WHERE UserEmail = \'' + req.session.username + '\'', function (result) {
                                    for (var i = 0; i < result.recordset.length; i++) {
                                        //console.log(result.recordset[i].Price);
                                        TotalPrice = TotalPrice + result.recordset[i].Price * result.recordset[i].CartProductQuantity;
                                    }
                                    //console.log(TotalPrice);
                                    return res.render('pages/cart', {
                                        Warning: null,
                                        listCart: result.recordset,
                                        isLogin,
                                        isAdmin,
                                        Subtotal: TotalPrice
                                    });
                                });
                            });
                        }
                    });
                });
            } else {
                runQuery('SELECT * FROM Cart WHERE UserEmail = \'' + req.session.username + '\'', function (result) {
                    for (var i = 0; i < result.recordset.length; i++) {
                        //console.log(result.recordset[i].Price);
                        TotalPrice = TotalPrice + result.recordset[i].Price * result.recordset[i].CartProductQuantity;
                    }
                    //console.log(TotalPrice);
                    return res.render('pages/cart', {
                        Warning: null,
                        listCart: result.recordset,
                        isLogin,
                        isAdmin,
                        Subtotal: TotalPrice
                    });
                });
            }
        }
    }

    async Minusitem(req, res) {

        var minusitem = req.query.CartID;
        //console.log(minusitem);
        runQuery('UPDATE Cart SET CartProductQuantity = CartProductQuantity - 1 WHERE CartID = \'' + minusitem + '\'', function (result) {
            runQuery('SELECT * FROM Cart WHERE CartID = \'' + minusitem + '\'' , function(result){
                //console.log(result.recordset[0].CartProductQuantity);
                if(result.recordset[0].CartProductQuantity == 0){
                    runQuery('DELETE FROM Cart WHERE CartID =  \'' + minusitem + '\'',function (result){
                        return res.redirect('/cart');
                    });
                }else{
                    return res.redirect('/cart');
                }
            });
        });
    }

    async Additem(req, res) {

        var additem = req.query.CartID;
        runQuery('UPDATE Cart SET CartProductQuantity = CartProductQuantity + 1 WHERE CartID = \'' + additem + '\'', function (result) {

            return res.redirect('/cart');
        });
    }
}

module.exports = HomeController