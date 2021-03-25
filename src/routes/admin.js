var express = require('express');
var AdminController = require('../controllers/admin');

const router = express.Router();
const adminController = new AdminController();

router
    .get('/', adminController.Index)
    .get('/orders', adminController.Orders)
    .get('/products', adminController.Products)
    .get('/products/details', adminController.ProductDetail)
    .get('/products/add', adminController.newProductForm)
    .get('/products/edit', adminController.EditProductForm)
    .get('/products/delete', adminController.DeleteProduct)
    .get('/customers', adminController.Customers)
    .post('/products/add', adminController.AddProduct)
    .put('/products/save', adminController.EditProduct)

module.exports = router;