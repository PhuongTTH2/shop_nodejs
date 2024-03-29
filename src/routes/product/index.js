'use strict'

const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller') 
const {asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')

// check authentication

router.use(authentication)
router.post('', asyncHandler(productController.createProduct))

module.exports = router