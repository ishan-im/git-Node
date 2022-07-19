const express = require('express')

const router = express.Router();

// controllers


const auth = require('../controllers/auth')

const link = require('../controllers/link')


// validators

const linkValidator = require("../validators/link")

const runValidation = require('../validators/validationResult')


//routes


router.post('/link', linkValidator.linkCreateValidator, runValidation, auth.requireSignIn, auth.authMiddleware,  link.createLink)
router.post('/link', linkValidator.linkCreateValidator, runValidation, auth.requireSignIn, auth.adminMiddleware,  link.createLink)

router.post('/links', auth.requireSignIn, auth.adminMiddleware, link.listLink)

router.put('/click-count', link.clickCount)

router.get('/link/popular', link.popular)

router.get('/link/popular/:slug', link.popularInCategory)

router.post('/link/:id', link.readLink)



router.put('/link/:id', linkValidator.linkUpdateValidator, runValidation, auth.requireSignIn, auth.authMiddleware, auth.canUpdateDeleteLink, link.updateLink)

router.put('/link/admin/:id', linkValidator.linkUpdateValidator, runValidation, auth.requireSignIn, auth.adminMiddleware,  link.updateLink)

router.delete('/link/:id',   auth.requireSignIn, auth.authMiddleware, auth.canUpdateDeleteLink, link.deleteLink)

router.delete('/link/admin/:id', auth.requireSignIn, auth.adminMiddleware,  link.deleteLink)

module.exports = router