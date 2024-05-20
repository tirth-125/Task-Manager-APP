const express = require('express');
const AuthController = require('../controller/authController');
 
const router = express.Router();

router.route('/signup').post(AuthController.signup);
router.route('/login').post(AuthController.login);
router.route('/forgotPassword').post(AuthController.forgotPassword);
router.route('/resetPassword').get(AuthController.getResetPassword);
router.route('/resetPassword/:token').post(AuthController.resetPassword);



module.exports  = router;