class HomeController {
    async Index(req, res) {
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
}

export default  HomeController