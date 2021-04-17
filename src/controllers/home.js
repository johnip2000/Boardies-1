const MailMessage = require('nodemailer/lib/mailer/mail-message');
const db = require('../config/database');
const runQuery = db.runQuery;
const mail = require('../mail');

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
        req.session['ConfirmAddr'] = false;
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        //console.log(req.session);
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
            });
        }
        //console.log(req.session.Voucher);
        if (isLogin == false) {
            return res.redirect('/login');
        } else {

            var TotalPrice = 0;
            var preorderexist = false;

            runQuery('SELECT * FROM Cart WHERE UserEmail = \'' + req.session.username + '\'', function (result) {
                for (var i = 0; i < result.recordset.length; i++) {
                    TotalPrice = TotalPrice + result.recordset[i].Price * result.recordset[i].CartProductQuantity;
                    runQuery('SELECT * FROM PreOrder', function (result) {
                        for (var i = 0; i < result.recordset.length; i++) {
                            if (req.session.username == result.recordset[i].UserEmail) {
                                preorderexist = true;
                            }
                        }
                        if (preorderexist == true) {
                            var updatequery = 'UPDATE PreOrder SET TotalPrePrice = \'' + TotalPrice + '\' WHERE \ UserEmail = \'' + req.session.username + '\' ';
                            runQuery(updatequery, function (result) {
                            });
                        } else {
                            var insertquery = "INSERT INTO PreOrder(UserEmail, TotalPrePrice, UseCoupon) VALUES ('" + req.session.username + "','" + TotalPrice + "' , 0)";
                            runQuery(insertquery, function (result) {
                            });
                        }
                    });
                }
                if (req.session.Voucher == true) {
                    runQuery('SELECT * FROM Promotions WHERE code = \'' + req.session.code + '\' ', function (dresult) {
                        if (dresult.recordset[0].status == 1) {
                            TotalPrice = TotalPrice * (1 - (dresult.recordset[0].percentOff / 100));
                            runQuery('UPDATE PreOrder SET UseCoupon = 1   WHERE  UserEmail = \'' + req.session.username + '\' ', function(updatecoupon){
                                runQuery('UPDATE PreOrder SET TotalPrePrice =  \'' + TotalPrice + '\' WHERE  UserEmail = \'' + req.session.username + '\' ', function (result) {
                                })
                            })
                            return res.render('pages/cart', {
                                Warning: null,
                                listCart: result.recordset,
                                isLogin,
                                isAdmin,
                                Subtotal: TotalPrice,
                                VoucherStatus: "You are using the " + dresult.recordset[0].percentOff + "% off Voucher."
                            });
                        } else {
                            return res.render('pages/cart', {
                                Warning: null,
                                listCart: result.recordset,
                                isLogin,
                                isAdmin,
                                Subtotal: TotalPrice,
                                VoucherStatus: "We are so sorry that your voucher is expired."
                            });
                        }
                    });
                } else {
                    if (req.session.Voucher == false) {
                        return res.render('pages/cart', {
                            Warning: null,
                            listCart: result.recordset,
                            isLogin,
                            isAdmin,
                            Subtotal: TotalPrice,
                            VoucherStatus: "You put a wrong voucher code. Please try again. Thanks."
                        });
                    } else {
                        return res.render('pages/cart', {
                            Warning: null,
                            listCart: result.recordset,
                            isLogin,
                            isAdmin,
                            Subtotal: TotalPrice,
                            VoucherStatus: ""
                        });
                    }
                }
            });
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
            var preorderexist = false;
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
                                duplicateID = result.recordset[i].CartID
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
                                        runQuery('SELECT * FROM PreOrder', function (result) {
                                            for (var i = 0; i < result.recordset.length; i++) {
                                                //console.log(result.recordset[i].UserEmail);
                                                if (req.session.username == result.recordset[i].UserEmail) {
                                                    preorderexist = true;
                                                }
                                            }
                                            if (preorderexist == true) {
                                                var updatequery = 'UPDATE PreOrder SET TotalPrePrice = \'' + TotalPrice + '\' WHERE \ UserEmail = \'' + req.session.username + '\' ';
                                                runQuery(updatequery, function (result) {
                                                });
                                            } else {
                                                var insertquery = "INSERT INTO PreOrder(UserEmail, TotalPrePrice) VALUES ('" + req.session.username + "','" + TotalPrice + "')";
                                                runQuery(insertquery, function (result) {
                                                });
                                            }
                                        });
                                    }

                                    if (req.session.Voucher == true) {
                                        runQuery('SELECT * FROM Promotions WHERE code = \'' + req.session.code + '\' ', function (dresult) {
                                            if (dresult.recordset[0].status == 1) {
                                                TotalPrice = TotalPrice * (1 - (dresult.recordset[0].percentOff / 100));

                                                return res.render('pages/cart', {
                                                    Warning: null,
                                                    listCart: result.recordset,
                                                    isLogin,
                                                    isAdmin,
                                                    Subtotal: TotalPrice,
                                                    VoucherStatus: "You are using the " + dresult.recordset[0].percentOff + "% off Voucher."
                                                });
                                            } else {
                                                return res.render('pages/cart', {
                                                    Warning: null,
                                                    listCart: result.recordset,
                                                    isLogin,
                                                    isAdmin,
                                                    Subtotal: TotalPrice,
                                                    VoucherStatus: "We are so sorry that your voucher is expired."
                                                });
                                            }
                                        });
                                    } else {
                                        return res.render('pages/cart', {
                                            Warning: null,
                                            listCart: result.recordset,
                                            isLogin,
                                            isAdmin,
                                            Subtotal: TotalPrice,
                                            VoucherStatus: ""
                                        });
                                    }
                                });
                            });
                        } else {
                            //var insertquery = "INSERT INTO Cart(ProductID,ProductName, Price, CartProductImage, ProductCate, CartProductQuantity, UserEmail) VALUES ('" + productbb + "', '" + insertcartproduct + "', '" + insertcartproductprice + "', '" + insertcartproductpic + "', '" + insertcartprodcat + "', 1 , '" + req.session.username + "')";
                            var updatequery = 'UPDATE Cart SET CartProductQuantity = CartProductQuantity + 1 WHERE CartID = \'' + duplicateID + '\'';

                            runQuery(updatequery, function (result) {
                                runQuery('SELECT * FROM Cart WHERE UserEmail = \'' + req.session.username + '\'', function (result) {
                                    for (var i = 0; i < result.recordset.length; i++) {
                                        //console.log(result.recordset[i].Price);

                                        TotalPrice = TotalPrice + result.recordset[i].Price * result.recordset[i].CartProductQuantity;
                                        runQuery('SELECT * FROM PreOrder', function (result) {
                                            for (var i = 0; i < result.recordset.length; i++) {
                                                //console.log(result.recordset[i].UserEmail);
                                                if (req.session.username == result.recordset[i].UserEmail) {
                                                    preorderexist = true;
                                                }
                                            }
                                            if (preorderexist == true) {
                                                var updatequery = 'UPDATE PreOrder SET TotalPrePrice = \'' + TotalPrice + '\' WHERE \ UserEmail = \'' + req.session.username + '\' ';
                                                runQuery(updatequery, function (result) {
                                                });
                                            } else {
                                                var insertquery = "INSERT INTO PreOrder(UserEmail, TotalPrePrice) VALUES ('" + req.session.username + "','" + TotalPrice + "')";
                                                runQuery(insertquery, function (result) {
                                                });
                                            }
                                        });
                                    }


                                    if (req.session.Voucher == true) {
                                        runQuery('SELECT * FROM Promotions WHERE code = \'' + req.session.code + '\' ', function (dresult) {
                                            if (dresult.recordset[0].status == 1) {
                                                TotalPrice = TotalPrice * (1 - (dresult.recordset[0].percentOff / 100));

                                                return res.render('pages/cart', {
                                                    Warning: null,
                                                    listCart: result.recordset,
                                                    isLogin,
                                                    isAdmin,
                                                    Subtotal: TotalPrice,
                                                    VoucherStatus: "You are using the " + dresult.recordset[0].percentOff + "% off Voucher."
                                                });
                                            } else {
                                                return res.render('pages/cart', {
                                                    Warning: null,
                                                    listCart: result.recordset,
                                                    isLogin,
                                                    isAdmin,
                                                    Subtotal: TotalPrice,
                                                    VoucherStatus: "We are so sorry that your voucher is expired."
                                                });
                                            }
                                        });
                                    } else {
                                        return res.render('pages/cart', {
                                            Warning: null,
                                            listCart: result.recordset,
                                            isLogin,
                                            isAdmin,
                                            Subtotal: TotalPrice,
                                            VoucherStatus: ""
                                        });
                                    }
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
                        runQuery('SELECT * FROM PreOrder', function (result) {
                            for (var i = 0; i < result.recordset.length; i++) {
                                //console.log(result.recordset[i].UserEmail);
                                if (req.session.username == result.recordset[i].UserEmail) {
                                    preorderexist = true;
                                }
                            }
                            if (preorderexist == true) {
                                var updatequery = 'UPDATE PreOrder SET TotalPrePrice = \'' + TotalPrice + '\' WHERE \ UserEmail = \'' + req.session.username + '\' ';
                                runQuery(updatequery, function (result) {
                                });
                            } else {
                                var insertquery = "INSERT INTO PreOrder(UserEmail, TotalPrePrice) VALUES ('" + req.session.username + "','" + TotalPrice + "')";
                                runQuery(insertquery, function (result) {
                                });
                            }
                        });
                    }
                    //console.log(TotalPrice);
                    if (req.session.Voucher == true) {
                        runQuery('SELECT * FROM Promotions WHERE code = \'' + req.session.code + '\' ', function (dresult) {
                            if (dresult.recordset[0].status == 1) {
                                TotalPrice = TotalPrice * (1 - (dresult.recordset[0].percentOff / 100));

                                return res.render('pages/cart', {
                                    Warning: null,
                                    listCart: result.recordset,
                                    isLogin,
                                    isAdmin,
                                    Subtotal: TotalPrice,
                                    VoucherStatus: "You are using the " + dresult.recordset[0].percentOff + "% off Voucher."
                                });
                            } else {
                                return res.render('pages/cart', {
                                    Warning: null,
                                    listCart: result.recordset,
                                    isLogin,
                                    isAdmin,
                                    Subtotal: TotalPrice,
                                    VoucherStatus: "We are so sorry that your voucher is expired."
                                });
                            }
                        });
                    } else {
                        return res.render('pages/cart', {
                            Warning: null,
                            listCart: result.recordset,
                            isLogin,
                            isAdmin,
                            Subtotal: TotalPrice,
                            VoucherStatus: ""
                        });
                    }
                });
            }
        }
    }

    async Minusitem(req, res) {

        var minusitem = req.query.CartID;
        //console.log(minusitem);
        runQuery('UPDATE Cart SET CartProductQuantity = CartProductQuantity - 1 WHERE CartID = \'' + minusitem + '\'', function (result) {
            runQuery('SELECT * FROM Cart WHERE CartID = \'' + minusitem + '\'', function (result) {
                //console.log(result.recordset[0].CartProductQuantity);
                if (result.recordset[0].CartProductQuantity == 0) {
                    runQuery('DELETE FROM Cart WHERE CartID =  \'' + minusitem + '\'', function (result) {
                        return res.redirect('/cart');
                    });
                } else {
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

    async Promotions(req, res) {
        var RightVoucher = false;
        //console.log(req.session.username);
        runQuery('SELECT * FROM PreOrder WHERE UserEmail = \'' + req.session.username + '\'', function (result) {
            //console.log(result.recordset[0].TotalPrePrice);
            //console.log(req.body.voucher);
            runQuery('SELECT * FROM Promotions', function (result) {
                for (var i = 0; i < result.recordset.length; i++) {
                    //console.log(result.recordset[i].code);
                    if (req.body.voucher == result.recordset[i].code) {
                        RightVoucher = true;
                        break;
                    } else {
                        RightVoucher = false;
                    }
                }
                if (RightVoucher == true) {
                    req.session['Voucher'] = true;
                    req.session['code'] = req.body.voucher
                    return res.redirect('/cart');
                } else {
                    req.session['Voucher'] = false
                    return res.redirect('/cart');
                }
            })
        });
    }
}

module.exports = HomeController