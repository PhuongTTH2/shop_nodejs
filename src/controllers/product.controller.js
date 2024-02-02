

const { SuccessResponse } = require('../core/success.response')
const ProductService = require('../services/product.service')


class ProducController {
  createProduct = async (req, res, next) =>{
    new SuccessResponse({
      message: 'Product success',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.keyStore.user
      }),
    }).send(res)
  }
}

module.exports = new ProducController()