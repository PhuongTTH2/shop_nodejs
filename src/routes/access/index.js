'use strict'
const accessController = require('../../controllers/access.controller') 

const express = require('express')
const {asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// check authentication

router.use(authentication)
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handlerRefreshToken))
module.exports = router