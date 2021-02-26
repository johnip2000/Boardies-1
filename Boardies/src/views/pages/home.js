const { sql, poolPromise } = require('../config/database')
class HomeController {
    async Index(req, res) {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT TOP(10) * FROM Products");
        const listCategories = await pool.request().query("SELECT * FROM Categories");
        return res.render('pages/homepage', {listGame: result.recordset, Categories: listCategories.recordset});
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
}

module.exports =  HomeController