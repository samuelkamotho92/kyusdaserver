const express = require('express');
const memberAuth = require('../Controlers/authControler');
const authRoute = express.Router();

authRoute
.route('/signUp')
.post(memberAuth.memberSignUp);

authRoute
.route('/signIn')
.post(memberAuth.memberSignin);

authRoute
.route('/resetToken')
.post(memberAuth.memberResetToken);

authRoute
.route('/resetPassword/:token')
.patch(memberAuth.resetPassword);

module.exports = authRoute;