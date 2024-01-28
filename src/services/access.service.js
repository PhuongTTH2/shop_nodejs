"use strict";

const bcrypt = require("bcrypt");
//C1
// const crypto = require("crypto");
//C2
const crypto = require("node:crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError } = require("../core/error.response");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "xxx1",
  EDITOR: "xxx2",
  ADMIN: "xxx3",
};
class AccessService {
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

        throw new BadRequestError('Eror: Shop registered!')
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
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
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
            shop:getInfoData({fileds :['_id', 'name', 'email'],object: newShop}),
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
