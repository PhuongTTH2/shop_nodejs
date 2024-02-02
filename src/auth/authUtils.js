"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "refreshToken",
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
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new AuthFailureError("Invalid Request");
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Invalid Request");

  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new AuthFailureError("Invalid Request");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Request");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
    check userId
    get accessToken
    verifyToken
    check user in DB
    check keyStore with this userId
    OK return next()

  */
    console.log('11111111111111')
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new AuthFailureError("Invalid Request");
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");
  console.log('22222222222222222')
  if (req.body[HEADER.REFRESHTOKEN]) {
    try {
      console.log('dddddddddddddddd')
      const refreshToken = req.body[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      console.log('zzzzzzzzzzzz', decodeUser)
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid Request");
      req.keyStore = keyStore
      console.log('333333333333333', decodeUser)
      req.user = decodeUser
      console.log('sadsadsad',decodeUser)
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      throw error;
    }
  }

  console.log('4444444444444444')
  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new AuthFailureError("Invalid Request");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Request");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT,
};
