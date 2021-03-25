const db = require('../config/database');
const runQuery = db.runQuery;
const fs = require('fs');
const { DH_NOT_SUITABLE_GENERATOR } = require('constants');
const { render } = require('ejs');

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

    async Orders(req, res) {

    }
}

module.exports =  AdminController