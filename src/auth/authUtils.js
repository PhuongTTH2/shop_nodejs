"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    console.log("aaaaaaaaaa ");
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days',
    });
    console.log("bbbbbbbbbbbbbbbb ");
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days',
    });
    console.log("createTokenPair ", payload, publicKey, privateKey);
    JWT.verify(accessToken, publicKey,(err, decode) =>{
        if(err) {
            console.error('error verify', err)
        } else {
            console.log('decode verify', decode)
        }
    } )
    return { accessToken, refreshToken };
  } catch (error) {}
};

module.exports = {
  createTokenPair,
};
