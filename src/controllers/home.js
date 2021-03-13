const db = require('../config/database');
const runQuery = db.runQuery;

class HomeController {
    async Index(req, res) {
        runQuery("SELECT TOP(10) * FROM Products", function(result) {
            runQuery("SELECT * FROM Categories", function(listCategories) {
                var contextDict = {
                    currentUrl: '/',
                    title: 'Home',
                    Categories: listCategories.recordset,
                    listGame: result.recordset
                };
                return res.render('pages/homepage', contextDict);
            });
        });
    }
    async AboutUs(req, res) {
        return res.render('pages/about-us');
    }
    async ContactUs(req, res) {
        return res.render('pages/contact-us');
    }
    async FAQ(req, res) {
        return res.render('pages/faq');
    }
    async Login(req, res) {
        return res.render('pages/login');
    }
    async ShippingInfo(req, res) {
        return res.render('pages/shipping-info');
    }

    async Cart(req, res) {
        return res.render('pages/cart');
    }
}

module.exports =  HomeController