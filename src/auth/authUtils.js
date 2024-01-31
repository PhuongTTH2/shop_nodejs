"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {

    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: 'RS256',
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: "7 days",
    });
    console.log("createTokenPair ", payload, publicKey, privateKey);
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("error verify", err);
      } else {
        console.log("decode verify", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    check userId
    get accessToken
    verifyToken
    check user in DB
    check keyStore with this userId
    OK return next()

  */
    console.log('0000000')
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new AuthFailureError("Invalid Request");
  console.log(';1111111111')
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Invalid Request");
  console.log(';222222222222')
  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new AuthFailureError("Invalid Request");
  console.log(';33333333333', accessToken, keyStore)
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    console.log(';decodeUser',decodeUser)
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Request");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT =  async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}
module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
};
