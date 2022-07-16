const express = require('express')

const router = express.Router();


//middlewares

const register = require('../controllers/auth')


//controllers

const user  = require('../controllers/user')


//validator

const validator = require('../validators/auth')

const runValidation = require('../validators/validationResult')

//routes


router.get('/user', register.requireSignIn, register.authMiddleware, user.read)

router.get('/admin', register.requireSignIn, register.adminMiddleware, user.read)


router.put('/user', validator.userUpdateValidator , runValidation, register.requireSignIn, register.authMiddleware, user.update)









module.exports = router;