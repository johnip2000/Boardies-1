var express = require('express');
var CheckoutController = require('../controllers/checkout');

const router = express.Router();
const checkoutController = new CheckoutController();

router
    .get('/addresses', checkoutController.Addresses)
    .post('/addresses', checkoutController.PostAddresses)
    .get('/shipping', checkoutController.ShippingAndPayment)
    .post('/shipping', checkoutController.PostShippingAndPayment)
    .get('/review', checkoutController.Review)
    .post('/review', checkoutController.Payment)
//.get('/confirmation', checkoutController.PlaceOrder)
module.exports = router;