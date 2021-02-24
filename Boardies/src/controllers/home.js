const { sql,poolPromise } = require('../config/database')
class HomeController {
    async Index(req, res) {
        try {
            const pool = await poolPromise
            const result = await pool.request()
                .query("SELECT * FROM Users")
            console.log(result.recordset)
        } catch (error) {
            console.log(error.message)
        }
        return res.render('pages/homepage');
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
}

module.exports =  HomeController