var express = require('express');
var HomeController = require('../controllers/home');

const router = express.Router();
const homeController = new HomeController();

router
    .get('/', homeController.Index)
    .get('/about-us', homeController.AboutUs)
    .get('/contact-us', homeController.ContactUs)
    .get('/FAQ', homeController.FAQ)
    .get('/login', homeController.Login)
    .get('/shipping-info', homeController.ShippingInfo)
    .get('/cart', homeController.Cart)
    .post('/cart', homeController.AddtoCart)
    .post('/promotions', homeController.Promotions)
    .get('/remove', homeController.Remove)
    .get('/minusitem',homeController.Minusitem)
    .get('/additem',homeController.Additem)
    .get('/search', homeController.SearchProduct)
    .get('/errors', homeController.Error)

module.exports = router;