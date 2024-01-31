"use strict";

const bcrypt = require("bcrypt");
//C1
// const crypto = require("crypto");
//C2
const crypto = require("node:crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "xxx1",
  EDITOR: "xxx2",
  ADMIN: "xxx3",
};
class AccessService {
  //check token used
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );

      console.log({ userId, email });

      await KeyTokenService.deleteKeyById(userId);

      throw new ForbiddenError("Something wrong");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)

    if(!holderToken) new AuthFailureError("Shop not registeted");

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log('2',{ userId, email });
    const foundShop = await findByEmail(email)

    if(!foundShop) new AuthFailureError("Shop not registeted 2");

    const tokens = await createTokenPair({userId, email}, holderToken.publicKey , holderToken.privateKey)

    await holderToken.updateOne({
      $set:{
        refreshToken: tokens.refreshToken
      },
      $addToSet:{
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user: {userId, email},
      tokens
    }
  };

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
  };
  /**
   * - check email
   * - match password
   * - create AT vs RT and save
   * - generate tokens
   * - get data return login
   *
   */

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registerd");

    const match = bcrypt.compare(password, foundShop.password);

    if (!match) new AuthFailureError("Authentication errror");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    console.log(";vvvvvvvvvvvvvv", tokens, userId, email);
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      metadata: {
        shop: getInfoData({
          fileds: ["_id", "name", "email"],
          object: foundShop,
        }),
        tokens,
      },
    };
  };
  static signUp = async ({ name, email, password }) => {
    // try {
    //  check email exists
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      // return {
      //   code: "error 1",
      //   message: "Shop registered",
      //   status: "error",
      // };

      throw new BadRequestError("Eror: Shop registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // create privateKey: dk token, publicKey: verify token
      //C1
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      //C2
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: "error 2 ",
          message: "publicKeyString error",
        };
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      console.log("Create Token ", tokens);
      return {
        code: 201,
        metadata: {
          // shop:newShop,
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   return {
    //     code: "error 3",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;
