'use strict'

const express = require('express')
const { apiKey, permisstion } = require('../auth/checkAuth')

const router = express.Router()
//check apiKey
/* The line `// router.use(apiKey)` is commented out, which means it is not being executed. However,
based on the code, it appears that it is intended to check the `apiKey` for authentication purposes. */
router.use(apiKey)
router.use(permisstion('0000'))

// check permission

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))
// router.get('/', (req, res, next) =>{
//     return res.status(200).json({
//         message: 'Welcome',
//     })
// })
module.exports = router