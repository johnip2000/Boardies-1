var express = require('express');
var CheckoutController = require('../controllers/checkout');

const router = express.Router();
const checkoutController = new CheckoutController();

router
    .get('/addresses', checkoutController.Addresses)
    .get('/shipping', checkoutController.ShippingAndPayment)
    .get('/review', checkoutController.Review)
    .get('/confirmation', checkoutController.PlaceOrder)
module.exports = router;