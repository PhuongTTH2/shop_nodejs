const { OK, CREATED,LOGIN, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    // new SuccessResponse({
    //   message: 'RefreshToken success',
    //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    // }).send(res)
    new SuccessResponse({
      message: 'RefreshToken success',
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken : req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      }),
    }).send(res)
  }
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res)
  }

  login = async (req, res, next) => {
    new LOGIN({
      message: 'Login OK',
      metadata: await AccessService.login(req.body),
    }).send(res)
  }
  signUp = async (req, res, next) => {
    // try {
      console.log(`[P]::signUp::`, req.body);
      new CREATED({
        message: 'Registerd OK',
        metadata: await AccessService.signUp(req.body),
        options: {
          limit: 10
        }
      }).send(res)
      // return res.status(200).json(await AccessService.signUp(req.body));
      
    // } catch (error) {
    //   console.log(error);
    // }
  };
}

module.exports = new AccessController();
