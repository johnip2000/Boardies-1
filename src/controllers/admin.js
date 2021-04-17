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
                    runQuery('SELECT COUNT(*) AS totalUser FROM Users', (users) => {
                        runQuery('SELECT COUNT(*) AS totalOrder FROM Orders', (orders) => {
                            runQuery('SELECT COUNT(*) AS totalProduct FROM Products', (products) => {
                                runQuery('SELECT SUM(total) AS totalEarn FROM Orders', (earns) => {
                                    var contextDict = {
                                        totalUser: users.recordset[0],
                                        totalOrder: orders.recordset[0],
                                        totalProduct: products.recordset[0],
                                        earns: earns.recordset[0],
                                        isAdmin: isAdmin,
                                        isLogin: isLogin
                                    }
                                    return res.render('admin/index', contextDict);
                                })
                            })
                        })
                    })
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
                    const sqlQuery = 'SELECT categoryName From Categories c \
                                    JOIN Products p ON c.categoryID = p.categoryID';
                    runQuery('SELECT * FROM Products', (products) => {
                        runQuery(sqlQuery, (category) => {
                            return res.render('admin/products', {products: products.recordset, categories: category.recordset});
                        })
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async newProductForm(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    return res.render('admin/addProduct', {isLogin, isAdmin});
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async AddProduct(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    let {productName, category, price, unitInStock, description, year, image} = req.body;
                    if(productName == "" || price == "" || unitInStock == "" || description == "" || year == "" || image == "") {
                        if(productName == "") {
                            var nameError = "Please enter valid product name";
                        }
                        if(price == "") {
                            var priceError = "Please enter price of product";
                        }
                        if(unitInStock == "") {
                            var unitInStockError = "Please enter number unit in stock";
                        }
                        if(description == "") {
                            var descriptionError = "Please enter product description";
                        }
                        if(year == "") {
                            var yearError = "Please enter product's manufacture year";
                        }
                        if(image == "") {
                            var imageError = "Please enter image link of product";
                        }
                        var contextDict = {
                            isAdmin: isAdmin,
                            isLogin: isLogin,
                            nameError: nameError,
                            priceError: priceError,
                            unitInStockError: unitInStockError,
                            descriptionError: descriptionError,
                            yearError: yearError,
                            imageError: imageError
                        }
                        res.render('admin/addProduct', contextDict)
                    }
                    else {
                        var insertQuery = 'INSERT INTO Products(productName, categoryID, productPrice, unitsInStock, productDescription, manufactureYear, productImage) \
                        VALUES(\'' + productName + '\', \
                        \'' + category + '\', \
                        \'' + price + '\', \
                        \'' + unitInStock + '\', \
                        \'' + description + '\', \
                        \'' + year + '\', \
                        \'' + image + '\')';
                        runQuery(insertQuery, (result) => {
                            return res.redirect('/admin/products');
                        })
                    }
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async EditProductForm(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    runQuery('SELECT * FROM Products WHERE productID = \'' + req.query.productID + '\'', (products) => {
                        res.render('admin/editProduct', {product: products.recordset[0], productID: req.query.productID})
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async EditProduct(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    let {productID, productName, category, price, unitInStock, description, year, image} = req.body;
                    if(productName == "" || price == "" || unitInStock == "" || description == "" || year == "" || image == "") {
                        if(productName == "") {
                            var nameError = "Please enter valid product name";
                        }
                        if(price == "") {
                            var priceError = "Please enter price of product";
                        }
                        if(unitInStock == "") {
                            var unitInStockError = "Please enter number unit in stock";
                        }
                        if(description == "") {
                            var descriptionError = "Please enter product description";
                        }
                        if(year == "") {
                            var yearError = "Please enter product's manufacture year";
                        }
                        if(image == "") {
                            var imageError = "Please enter image link of product";
                        }
                        var contextDict = {
                            isAdmin: isAdmin,
                            isLogin: isLogin,
                            nameError: nameError,
                            priceError: priceError,
                            unitInStockError: unitInStockError,
                            descriptionError: descriptionError,
                            yearError: yearError,
                            imageError: imageError
                        }
                        runQuery('SELECT * FROM Products WHERE productID = \'' + productID + '\'', (products) => {
                            res.render('admin/editProduct', {product: products.recordset[0], contextDict})
                        })
                    }
                    else {
                        var updateQuery = 'UPDATE Products SET \
                                        productName = \'' + productName + '\', \
                                        categoryID = \'' + category + '\', \
                                        productPrice = \'' + price + '\', \
                                        unitsInStock = \'' + unitInStock + '\', \
                                        productDescription = \'' + description + '\', \
                                        manufactureYear = \'' + year + '\', \
                                        productImage = \'' + image + '\' \
                                        WHERE productID = \'' + productID + '\'';
                        runQuery(updateQuery, (result) => {
                            return res.redirect('/admin/products');
                        })
                    }
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async DeleteProduct(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    runQuery('DELETE FROM Products WHERE productID = \'' + req.query.productID + '\'', (result) => {
                        return res.redirect('/admin/products');
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async ProductDetail(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    runQuery('SELECT * FROM Products WHERE productID = \'' + req.query.productID + '\'', (products) => {
                        res.render('admin/productDetail', {product: products.recordset[0]})
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async Customers(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    runQuery('SELECT * FROM Users WHERE email NOT LIKE \'' + req.session.username + '\'', (customers) => {
                        return res.render('admin/customers', {customers: customers.recordset});
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async CustomerDetail(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    runQuery('SELECT * FROM Users WHERE userID = \'' + req.query.customerID + '\'', (customers) => {
                        res.render('admin/customerDetail', {customer: customers.recordset[0]})
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async Blocked(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    const sqlUpdate = 'UPDATE Users SET blocked = \'' + true + '\' WHERE userID = \'' + req.body.customerID + '\'';
                    runQuery(sqlUpdate, (result) => {
                        return res.redirect('/admin/customers');
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async Unblocked(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    const sqlUpdate = 'UPDATE Users SET blocked = \'' + false + '\' WHERE userID = \'' + req.body.customerID + '\'';
                    runQuery(sqlUpdate, (result) => {
                        return res.redirect('/admin/customers');
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async Orders(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    const sqlQuery = 'SELECT userName From Users u \
                                    JOIN Orders o ON u.userID = o.userID';
                    runQuery('SELECT * FROM Orders', (orders) => {
                        runQuery(sqlQuery, (users) => {
                            return res.render('admin/orders', {orders: orders.recordset, users: users.recordset});
                        })
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async OrderDetails(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    const sqlOrder = 'SELECT * FROM Orders o \
                                    JOIN Order_Details od ON od.orderID = o.orderID \
                                    JOIN Products p ON p.productID = od.productID \
                                    WHERE o.orderID = \'' + req.query.orderID + '\'';
                    const sqlAddress = 'SELECT * FROM Orders \
                                        WHERE orderID = \'' + req.query.orderID + '\'';

                    runQuery(sqlOrder, (orders) => {
                        runQuery(sqlAddress, (order) => {
                            //console.log(order.recordset[0])
                            res.render('admin/orderDetail', {order: order.recordset[0], orders: orders.recordset})
                        })
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }

    async CancelOrder(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if(req.session.username != "" && typeof(req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function(user) {
                isAdmin = user.recordset[0].isAdmin;
                if(isLogin && isAdmin) {
                    const status = 'cancelled';
                    const sqlUpdate = 'UPDATE Orders SET status = \'' + status + '\' WHERE orderID = \'' + req.body.orderID + '\'';
                    runQuery(sqlUpdate, (results) => {
                        res.redirect('/admin/orders');
                    })
                }
                else {
                    return res.render('pages/errors');
                }
            });
        }
    }
}

module.exports =  AdminController