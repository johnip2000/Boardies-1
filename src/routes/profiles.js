var express = require('express');
var ProfileController = require('../controllers/profiles');

const router = express.Router();
const profileController = new ProfileController();

router
    .get('/profile', profileController.getProfile)
    .get('/address', profileController.getAddress)
    .get('/address/edit', profileController.getAddressForm)
    .get('/changepassword', profileController.GetChangePassword)
    .post('/profile/save', profileController.UpdateProfile)
    .post('/changepassword', profileController.ChangePassword)

module.exports = router;