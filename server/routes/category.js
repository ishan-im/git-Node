const express = require('express')

const router = express.Router();

// controllers


const register = require('../controllers/auth');
const category = require('../controllers/category');


// validators

const categoryValidator = require("../validators/category")

const runValidation = require('../validators/validationResult')


//routes

router.post('/category', register.requireSignIn, register.adminMiddleware, categoryValidator.createCategoryValidator, category.createCategory)

router.get('/categories', category.list)

router.post('/category/:slug', category.read)

router.put('/category/:slug', register.requireSignIn, register.adminMiddleware, category.update)

router.delete('/category/:slug',   register.requireSignIn, register.adminMiddleware, category.remove)

module.exports = router